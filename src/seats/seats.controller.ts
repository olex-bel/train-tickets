import { Controller, Post, Param, Body } from '@nestjs/common';
import { ConflictException, ForbiddenException } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { SeatsReserveDto } from './dto/seats-reserve.dto';
import { SeatConflictException } from './errors/seat-conflict.exception';
import { InvalidReservationTokenException } from './errors/invalid-reservation-token.exception';

@Controller('seats')
export class SeatsController {

    constructor(private readonly seatsService: SeatsService) {}

    @Post(':journeyId/carriages/:carriageNo/reserve')
    async reserveSeats(
        @Param('journeyId') journeyId: string,
        @Param('carriageNo') carriageNo: string,
        @Body() seatsReserveDto: SeatsReserveDto,
    ) {
        try {
            return await this.seatsService.reserveSeats(journeyId, carriageNo, seatsReserveDto);
        } catch (error) {
            if (error instanceof SeatConflictException) {
                throw new ConflictException(error.message);
            } else if (error instanceof InvalidReservationTokenException) {
                throw new ForbiddenException(error.message);
            }

            throw error;
        }
    }
}
