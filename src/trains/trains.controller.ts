import { Controller, Get, Query, Param } from '@nestjs/common';
import { TrainsService } from './trains.service';
import { SearchTrainsDto } from './dto/search-trains.dto';
import { JourneyStationDto } from './dto/journey-station.dto';

@Controller('trains')
export class TrainsController {

    constructor(
        private readonly trainsService: TrainsService,
    ) { }

    @Get('find')
    async findTrains(@Query() searchTrainsDto: SearchTrainsDto) {
        return await this.trainsService.findTrains(searchTrainsDto);
    }

    @Get(':journeyId/carriages/availability') 
    async getTrainCarriagesAvailability(@Param('journeyId') journeyId: string, @Query() journeyStationDto: JourneyStationDto) { 
        return await this.trainsService.getTrainCarriagesAvailability(journeyId, journeyStationDto);
    }

    @Get(':journeyId/carriages/:carriageNo/seats')
    async getCarriageSeats(
        @Param('journeyId') journeyId: string,
        @Param('carriageNo') carriageNo: string,
        @Query() journeyStationDto: JourneyStationDto
    ) {
        return await this.trainsService.getCarriageSeats(journeyId, carriageNo, journeyStationDto);
    }
}
