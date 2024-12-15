import { Repository, Raw } from 'typeorm';
import SeatReservation from '../entity/seats.reservation.entity';

type CheckSeatsParams = {
    journeyId: string;
    carriageNo: string;
    seats: number[];
    startStopIndex: number;
    endStopIndex: number;
};

type SeatAvailability = {
    seat_no: number;
    is_avaliable: boolean;
};

export interface ISeatReservationRepository extends Repository<SeatReservation> {
    this: Repository<SeatReservation>;
  
    getReservationsByToken(token: string): Promise<SeatReservation[]>;
    getSeatAvailability(params: CheckSeatsParams): Promise<SeatAvailability[]>;
};

export type CustomSeatReservationMethods = Pick<ISeatReservationRepository, 'getReservationsByToken' | 'getSeatAvailability'>;
export type CustomSeatReservationRepository = Repository<SeatReservation> & CustomSeatReservationMethods;

export const customSeatReservationRepository: CustomSeatReservationMethods = {
    getReservationsByToken: async function (this: CustomSeatReservationRepository, token: string) {
        return await this.find({
            where: {
                reservationToken: token,
                reservedUntil: Raw(alias => `${alias} > NOW()`),
            },
        });
    },

    getSeatAvailability: async function (this: CustomSeatReservationRepository, { journeyId, carriageNo, seats, startStopIndex, endStopIndex }: CheckSeatsParams) {
        return this.createQueryBuilder('sr')
            .select(['seat_no'])
            .addSelect(`
                CASE
                    WHEN status = 'sold' OR status = 'reserved' THEN false
                    ELSE true
                END
            `, 'is_avaliable')
            .where('journey_id = :journeyId', { journeyId })
            .andWhere('carriage_no = :carriageNo', { carriageNo })
            .andWhere('start_end_stations @> :stationRange', { stationRange: `[${startStopIndex}, ${endStopIndex})` })
            .andWhere('seat_no IN (:...seats)', { seats })
            .getRawMany();
    },
};
