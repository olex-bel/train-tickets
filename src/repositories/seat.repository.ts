import { Repository } from 'typeorm';
import Seat from 'src/entity/seats.entity';

type FindSeatsParams = {
    journeyId: string,
    carriageNo: string,
    seats: number[]
};

type SeatInfo = {
    seat_no: number;
};

export interface ISeatRepository extends Repository<Seat> {
    this: Repository<Seat>;
  
    findSeats(params: FindSeatsParams): Promise<SeatInfo[]>;
}

export type CustomSeatRepository = Pick<ISeatRepository, 'findSeats'>;
export type SeatRepository = Repository<Seat> & CustomSeatRepository;

export const customSeatRepository: CustomSeatRepository = {
    async findSeats(this: ISeatRepository, {
        journeyId,
        carriageNo,
        seats
    }: FindSeatsParams) {
        return this.createQueryBuilder('s')
            .select(['s.seat_no'])
            .where('journey_id = :journeyId', { journeyId })
            .andWhere('carriage_no = :carriageNo', { carriageNo })
            .andWhere('seat_no IN (:...seats)', { seats })
            .getRawMany();
    }
};
