import { Injectable, ConflictException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { DataSource, QueryFailedError } from 'typeorm';
import { TokenService } from 'src/token/token.service';
import { customSeatRepository, SeatRepository } from 'src/repositories/seat.repository';
import { customSeatReservationRepository, SeatReservationRepository } from 'src/repositories/seat.reservation.repository';
import { customJourneyStationRepository } from 'src/repositories/journey.station.repository';
import Seat from 'src/entity/seats.entity';
import SeatReservation, { ReservationStatus } from 'src/entity/seats.reservation.entity';
import JourneyStation from 'src/entity/journey.station.entity';
import { SeatsReserveDto } from './dto/seats-reserve.dto';

type SeatReservationParams = {
    journeyId: string;
    carriageNo: string;
    startStopIndex: number;
    endStopIndex: number;
    seats: number[];
};

type CreateReservationParams = {
    journeyId: string;
    carriageNo: string;
    seats: number[];
    startStopIndex: number;
    endStopIndex: number;
    token: string;
    expirationTime: Date;
};

type SeatValidationParams = {
    journeyId: string;
    carriageNo: string; 
    seats: number[];
};

@Injectable()
export class SeatsService {
    constructor( 
        private readonly tokenService: TokenService,
        private dataSource: DataSource
    ) { }

    async reserveSeats(journeyId: string, carriageNo: string, seatsReserveDto: SeatsReserveDto) {
        const { arrivalStationId, departureStationId, seats } = seatsReserveDto;
        
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();

        const seatReservationRepository = queryRunner.manager.getRepository(SeatReservation).extend(customSeatReservationRepository);
        const seatRepository = queryRunner.manager.getRepository(Seat).extend(customSeatRepository);
        const journeyStationRepository = queryRunner.manager.getRepository(JourneyStation).extend(customJourneyStationRepository);

        await queryRunner.startTransaction();
        
        const { startStopIndex, endStopIndex } = await journeyStationRepository.getStopIndices(journeyId, departureStationId, arrivalStationId);
       
        await this.validateSeats(seatRepository, {
            journeyId,
            carriageNo,
            seats
        });

        try {
            await this.validateSeatAvailability(seatReservationRepository, {
                journeyId,
                carriageNo,
                startStopIndex,
                endStopIndex,
                seats,
            });

            const { token, expirationTime } = await this.handleReservationToken(seatReservationRepository, seatsReserveDto.token);

            const seatReservations = this.createSeatReservations({
                journeyId,
                carriageNo,
                startStopIndex,
                endStopIndex,
                seats,
                token,
                expirationTime,
            });

            await queryRunner.manager.save(seatReservations);
            await queryRunner.commitTransaction();

            return {
                token,
                expirationTime,
            };
        } catch (error) {
            await queryRunner.rollbackTransaction();

            if (error instanceof QueryFailedError && 'code' in error && error.code === '23505') {
                throw new ConflictException('Seat(s) cannot be reserved.');
            }

            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    private async validateSeats(seatRepository: SeatRepository, {
        journeyId,
        carriageNo,
        seats,
    }: SeatValidationParams) {
        const existingSeats = await seatRepository.findSeats({
            journeyId,
            carriageNo,
            seats,
        });

        if (existingSeats.length !== seats.length) {
            const nonExistingSeats = seats.filter(seatNo => !existingSeats.some(seat => seat.seat_no === seatNo));

            throw new BadRequestException(`Seats ${nonExistingSeats.join(', ')} do not exist.`);
        }
    }

    private async validateSeatAvailability(seatReservationRepository: SeatReservationRepository, seatReservationParams: SeatReservationParams) {
        const seatsAvailability = await seatReservationRepository.getSeatAvailability(seatReservationParams);

        if (seatsAvailability.length > 0) {
            throw new ConflictException('Seat(s) cannot be reserved.');
        }
    }

    private async handleReservationToken(seatReservationRepository: SeatReservationRepository, existingToken: string | undefined) {
        if (existingToken) {
            const expirationTime = this.tokenService.decodeToken(existingToken);
            const validReservations = await seatReservationRepository.getReservationsByToken(existingToken);

            if (validReservations.length === 0) {
                throw new ForbiddenException('Invalid token.');
            }

            return { token: existingToken, expirationTime };
        }

        const [newToken, reservedUntil] = this.tokenService.generateToken();
        return { token: newToken, expirationTime: reservedUntil };
    }

    private createSeatReservations({journeyId, carriageNo, seats, startStopIndex, endStopIndex, token, expirationTime}: CreateReservationParams) {
        const seatReservations = [];

        seats.forEach((seatNo) => {
            const seatReservation = new SeatReservation();

            seatReservation.seatNo = seatNo;
            seatReservation.carriageNo = +carriageNo;
            seatReservation.journeyId = +journeyId;
            seatReservation.startEndtStations = `[${startStopIndex}, ${endStopIndex}]`;
            seatReservation.reservationToken = token;
            seatReservation.reservedUntil = expirationTime;
            seatReservation.status = ReservationStatus.RESERVED;
            seatReservations.push(seatReservation);
        });

        return seatReservations;
    }
}
