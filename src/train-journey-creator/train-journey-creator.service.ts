import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';
import JourneySchedule, { DayOfWeek } from '../entity/journey.schedule.entity';
import TrainJourney from '../entity/train.journey.entity';
import RouteStationSchedule from '../entity/route.station.schedule.entity';
import JourneyStation from '../entity/journey.station.entity';
import CarriageAssignment from '../entity/carriage.assignment.entity';
import JourneyCarriage from '../entity/journey.carriage.entity';
import Seat from '../entity/seats.entity';
import { addMinutesToDate } from '../utils/data-utils';
import { IJourneyScheduleRepository } from '../repositories/journey.schedule.repository';

@Injectable()
export class TrainJourneyCreatorService {
    private readonly logger = new Logger(TrainJourneyCreatorService.name);

    constructor(
        @InjectRepository(JourneySchedule)
        private readonly journeySchedule: IJourneyScheduleRepository,
        private dataSource: DataSource
    ) { }

    async createJourneys() {
        const processingDay = new Date();
        const currentDayOfMonth = processingDay.getDate();
        this.logger.debug('Start creating journeys.');

        for (let i = 0; i < 7; i++) {
            processingDay.setDate(currentDayOfMonth + i);
            this.logger.debug(`Processing for the day ${processingDay}`);
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
        return this.journeySchedule.getJourneysToCreate(dayOfWeek, processingDay);
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
        const routeStations = await routeStationScheduleRepository.find({
            where: {
                routeId: trainJourney.route.id,
            },
            relations: {
                route: true,
            },
        });

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
