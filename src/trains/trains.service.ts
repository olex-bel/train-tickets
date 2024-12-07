import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import JourneyStation from 'src/entity/journey.station.entity';
import SeatReservation from 'src/entity/seats.reservation.entity';
import Seat from 'src/entity/seats.entity';
import { JourneyStationRepository } from 'src/repositories/journey.station.repository';
import { SearchTrainsDto } from './dto/search-trains.dto';
import { JourneyStationDto } from './dto/journey-station.dto';

@Injectable()
export class TrainsService {
    constructor(
        @InjectRepository(JourneyStation)
        private readonly journeyStationRepository: JourneyStationRepository,
        @InjectRepository(Seat)
        private readonly seatRepository: Repository<Seat>,
    ) { }

    async findTrains(searchTrainsDto: SearchTrainsDto): Promise<any[]> {
        const {
            departureStationId,
            arrivalStationId,
            travelDate,
        } = searchTrainsDto;

        return this.journeyStationRepository.createQueryBuilder('departure')
            .select([
                'journey.name',
                'departure.journey_id',
                'departure.station_id as departure_station_id',
                'departure.departure_time',
                'arrival.station_id as arrival_station_id',
                'arrival.arrival_time'
            ])
            .leftJoin('journey_station', 'arrival', 'departure.journey_id = arrival.journey_id')
            .leftJoin('train_journey', 'journey', 'departure.journey_id = journey.id')
            .where('departure.station_id = :departureStationId', { departureStationId })
            .andWhere('arrival.station_id = :arrivalStationId', { arrivalStationId })
            .andWhere('departure.stop_order < arrival.stop_order')
            .andWhere('departure.departure_time::date = :travelDate', { travelDate })
            .orderBy('departure.departure_time')
            .getRawMany();
    }

    async getTrainCarriagesAvailability(journeyId: string, journeyStationDto: JourneyStationDto) {
        const { departureStationId, arrivalStationId } = journeyStationDto;
        const stopsPositionMap = await this.journeyStationRepository.getStopsPosition(journeyId, [departureStationId, arrivalStationId]);
        const startStopIndex = stopsPositionMap[departureStationId];
        const endStopIndex = stopsPositionMap[arrivalStationId];

        return await this.seatRepository.createQueryBuilder('s')
            .select(['s.carriage_no', 'COUNT(s.seat_no) as free_seats'])
            .leftJoin(subQuery => {
                return subQuery
                    .select(['rs.seat_no', 'rs.carriage_no'])
                    .from(SeatReservation, 'rs')
                    .where('rs.journey_id = :journeyId')
                    .andWhere('start_end_stations @> :stationRange', {stationRange: `[${startStopIndex}, ${endStopIndex}]`});
            }, 'sr', 'sr.seat_no = s.seat_no AND sr.carriage_no = s.carriage_no')
            .where('s.journey_id = :journeyId')
            .andWhere('sr.seat_no is NULL')
            .groupBy('s.carriage_no')
            .setParameters({
                journeyId,
                startStopIndex,
                endStopIndex,
            })
            .getRawMany();
    }

    async getCarriageSeats(journeyId: string, carriageNo: string, journeyStationDto: JourneyStationDto) {
        const { departureStationId, arrivalStationId } = journeyStationDto;
        const stopsPositionMap = await this.journeyStationRepository.getStopsPosition(journeyId, [departureStationId, arrivalStationId]);
        const startStopIndex = stopsPositionMap[departureStationId];
        const endStopIndex = stopsPositionMap[arrivalStationId];

        return await this.seatRepository.createQueryBuilder('s')
            .select(['s.seat_no', 's.class_id'])
            .addSelect(`
                CASE
                    WHEN sr.status = 'sold' THEN false
                    WHEN sr.status = 'reserved' AND sr.reserved_until < NOW() THEN false
                    ELSE true
                END
            `, 'is_avaliable')
            .leftJoin(subQuery => {
                return subQuery
                    .select(['seat_no', 'carriage_no', 'status', 'reserved_until'])
                    .from(SeatReservation, 'rs')
                    .where('journey_id = :journeyId')
                    .andWhere('start_end_stations @> :stationRange', {stationRange: `[${startStopIndex}, ${endStopIndex}]`});
            }, 'sr', 'sr.seat_no = s.seat_no AND sr.carriage_no = s.carriage_no')
            .where('s.journey_id = :journeyId')
            .andWhere('s.carriage_no = :carriageNo')
            .setParameters({
                journeyId,
                startStopIndex,
                endStopIndex,
                carriageNo,
            })
            .getRawMany();
    }
}
