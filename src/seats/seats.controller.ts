import { Controller, Post, Param, Body } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { SeatsReserveDto } from './dto/seats-reserve.dto';

@Controller('seats')
export class SeatsController {

    constructor(private readonly seatsService: SeatsService) {}

    @Post(':journeyId/carriages/:carriageNo/reserve')
    async reserveSeats(
        @Param('journeyId') journeyId: string,
        @Param('carriageNo') carriageNo: string,
        @Body() seatsReserveDto: SeatsReserveDto,
    ) {
        return await this.seatsService.reserveSeats(journeyId, carriageNo, seatsReserveDto);
    }
}
