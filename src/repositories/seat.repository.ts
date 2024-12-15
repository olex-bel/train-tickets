import { Repository } from 'typeorm';
import Seat from '../entity/seats.entity';

type FindSeatsParams = {
    journeyId: string,
    carriageNo: string,
    seats: number[]
};

type GetSeatAvailabilityParams = {
    journeyId: string;
    startStopIndex: number;
    endStopIndex: number;
};

type GetSeatAvailabilityStatusParams = {
    journeyId: string;
    carriageNo: string;
    startStopIndex: number;
    endStopIndex: number;
};

type SeatInfo = {
    seat_no: number;
};

type CarriageSeatAvailability = {
    carriage_no: number;
    free_seats: number;
};

type CarriageSeatAvailabilityStatus = {
    seat_no: number;
    class_id: number;
    is_avaliable: boolean;
};

export interface ISeatRepository extends Repository<Seat> {
    this: Repository<Seat>;
    findSeats(params: FindSeatsParams): Promise<SeatInfo[]>;
    getSeatAvailability(params: GetSeatAvailabilityParams): Promise<CarriageSeatAvailability[]>;
    getSeatAvailabilityStatus(params: GetSeatAvailabilityStatusParams): Promise<CarriageSeatAvailabilityStatus[]>;
};

type CustomSeatMethods = Pick<ISeatRepository, 'findSeats' | 'getSeatAvailability' | 'getSeatAvailabilityStatus'>;
export type CustomSeatRepository = Repository<Seat> & CustomSeatMethods;

export const customSeatRepository: CustomSeatMethods = {
    async findSeats(this: ISeatRepository, { journeyId, carriageNo, seats }: FindSeatsParams) {
        return this.createQueryBuilder('s')
            .select(['s.seat_no'])
            .where('journey_id = :journeyId', { journeyId })
            .andWhere('carriage_no = :carriageNo', { carriageNo })
            .andWhere('seat_no IN (:...seats)', { seats })
            .getRawMany();
    },

    async getSeatAvailability(this: ISeatRepository, { journeyId, startStopIndex, endStopIndex }: GetSeatAvailabilityParams) {
        return this.createQueryBuilder('s')
            .select(['s.carriage_no', 'COUNT(s.seat_no) as free_seats'])
            .leftJoin(subQuery => {
                return subQuery
                    .select(['rs.seat_no', 'rs.carriage_no'])
                    .from('seats_reservation', 'rs')
                    .where('rs.journey_id = :journeyId')
                    .andWhere('start_end_stations @> :stationRange', { stationRange: `[${startStopIndex}, ${endStopIndex}]` });
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
    },

    async getSeatAvailabilityStatus(this: ISeatRepository, { journeyId, carriageNo, startStopIndex, endStopIndex }: GetSeatAvailabilityStatusParams) {
        return this.createQueryBuilder('s')
            .select(['s.seat_no', 's.class_id'])
            .addSelect(`
            CASE
                WHEN status = 'sold' OR status = 'reserved' THEN false
                ELSE true
            END
        `, 'is_avaliable')
            .leftJoin(subQuery => {
                return subQuery
                    .select(['seat_no', 'carriage_no', 'status', 'reserved_until'])
                    .from('seats_reservation', 'rs')
                    .where('journey_id = :journeyId')
                    .andWhere('start_end_stations @> :stationRange', { stationRange: `[${startStopIndex}, ${endStopIndex}]` });
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
};
