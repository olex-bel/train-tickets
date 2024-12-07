import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import JourneySchedule, { DayOfWeek } from 'src/entity/journey.schedule.entity';
import TrainJourney from 'src/entity/train.journey.entity';
import RouteStationSchedule from 'src/entity/route.station.schedule.entity';
import JourneyStation from 'src/entity/journey.station.entity';
import CarriageAssignment from 'src/entity/carriage.assignment.entity';
import JourneyCarriage from 'src/entity/journey.carriage.entity';
import Seat from 'src/entity/seats.entity';
import { addMinutesToDate } from 'src/utils/data-utils';

@Injectable()
export class TrainJourneyCreatorService {
    private readonly logger = new Logger(TrainJourneyCreatorService.name);

    constructor(
        @InjectRepository(JourneySchedule)
        private readonly journeySchedule: Repository<JourneySchedule>,
        @InjectRepository(TrainJourney)
        private readonly trainJourney: Repository<TrainJourney>,
        private dataSource: DataSource
    ) { }

    async createJourneys() {
        const processingDay = new Date();
        this.logger.debug('Start creating journeys.');

        for (let i = 0; i < 7; i++) {
            processingDay.setDate(processingDay.getDate() + i);
            await this.processJourneysForDay(processingDay);
        }

        this.logger.debug('Finished creating journeys.');
    }

    private async processJourneysForDay(processingDay: Date) {
        const dayOfWeek = Object.values(DayOfWeek)[processingDay.getDay()];
        const journeySchedules = await this.getJourneysToCreate(dayOfWeek, processingDay);

        if (journeySchedules.length === 0) {
            this.logger.debug(`No journeys to create for ${processingDay}`);
            return;
        }

        await Promise.all(journeySchedules.map(schedule => this.createJourney(schedule, processingDay)));
    }

    private async getJourneysToCreate(dayOfWeek: string, processingDay: Date) {
        const existingJourneyQB = this.trainJourney.createQueryBuilder('tj')
            .select('id')
            .where('start_date = cast(:startDate as DATE) + js.departure_time')
            .andWhere('route_id = js.route_id');

        return this.journeySchedule.createQueryBuilder('js')
            .leftJoinAndSelect("js.route", "route")
            .where('js.dayOfWeek = :dayOfWeek', { dayOfWeek })
            .andWhere(`NOT EXISTS (${existingJourneyQB.getQuery()})`)
            .setParameter('startDate', processingDay.toISOString().substring(0, 10))
            .getMany();
    }

    private async createJourney(journeySchedule: JourneySchedule, date: Date) {
        const queryRunner = this.dataSource.createQueryRunner();
        const [hours, minutes, seconds] = journeySchedule.departureTime.split(':');
        const startDate = new Date(date.getTime());

        startDate.setHours(+hours, +minutes, +seconds, 0);
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const trainJourney = await this.addJourney(queryRunner, journeySchedule, startDate);
            const journeyStations = await this.generateJourneyStations(queryRunner, trainJourney, startDate);
            const { carriages, seats } = await this.assignCarriagesAndSeats(queryRunner, journeySchedule, trainJourney);

            await queryRunner.manager.save(journeyStations);
            await queryRunner.manager.save(carriages);
            await queryRunner.manager.save(seats);

            await queryRunner.commitTransaction();
            this.logger.debug(`Successfully created journey ID ${trainJourney.id}`);
        } catch (error) {
            this.logger.error(`Failed to create journey ${journeySchedule.id}: ${error}`);
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    private async addJourney(queryRunner: QueryRunner, journeySchedule: JourneySchedule, startDate: Date) {
        const trainJourney = new TrainJourney();

        trainJourney.name = journeySchedule.route.name;
        trainJourney.route = journeySchedule.route;
        trainJourney.startDate = startDate;
        trainJourney.schedule = journeySchedule;

        await queryRunner.manager.save(trainJourney);
        return trainJourney;
    }

    private async generateJourneyStations(queryRunner: QueryRunner, trainJourney: TrainJourney, startDate: Date) {
        const routeStationScheduleRepository = queryRunner.manager.getRepository(RouteStationSchedule);
        const routeStations = await routeStationScheduleRepository.createQueryBuilder()
            .where('route_id = :routeId', { routeId: trainJourney.route.id })
            .getMany();

        if (routeStations.length === 0) {
            throw new Error(`No stations found for route ${trainJourney.route.id}.`);
        }

        return routeStations.map((station) => {
            const journeyStation = new JourneyStation();
            const arrivalTime = addMinutesToDate(startDate, station.arrivalOffsetMinutes);
            const departureTime = addMinutesToDate(arrivalTime , station.stopDurationMinutes);

            journeyStation.station = station.station;
            journeyStation.stopOrder = station.stopOrder;
            journeyStation.journey = trainJourney;
            journeyStation.arrivalTime = arrivalTime;
            journeyStation.departureTime = departureTime;

            return journeyStation;
        });
    }

    private async assignCarriagesAndSeats(queryRunner: QueryRunner, journeySchedule: JourneySchedule, trainJourney: TrainJourney) {
        const carriageAssignmentRepository = queryRunner.manager.getRepository(CarriageAssignment);
        const carriageAssignments = await carriageAssignmentRepository.find({
            where: { schedule: { id: journeySchedule.id } },
            relations: {
                seatsAssignment: true,
            },
        });

        if (carriageAssignments.length === 0) {
            throw new Error(`No carriages assigned for schedule ${journeySchedule.id}.`);
        }

        const journeyCarriages = [];
        const seats = [];

        carriageAssignments.forEach((carriage) => {
            const journeyCarriage = new JourneyCarriage();
            journeyCarriage.carriageNo = carriage.carriageNo;
            journeyCarriage.trainJourney = trainJourney;

            if (carriage.seatsAssignment.length === 0) {
                throw new Error(`No seats assigment found for schedule ${journeySchedule.id} and carriage ${carriage.carriageNo}.`)
            }

            carriage.seatsAssignment.forEach((seatAssignment) => {
                for (let i = seatAssignment.startSeatNumber; i <= seatAssignment.endSeatNumber; i++) {
                    const seat = new Seat();
                    seat.classId = seatAssignment.classId;
                    seat.journeyId = trainJourney.id;
                    seat.carriageNo = journeyCarriage.carriageNo;
                    seat.seatNo = i;
                    seats.push(seat);
                }
            });

            journeyCarriages.push(journeyCarriage);
        });

        return { carriages: journeyCarriages, seats };
    }
}
