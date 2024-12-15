import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import JourneyStation from '../entity/journey.station.entity';
import Seat from '../entity/seats.entity';
import { IJourneyStationRepository } from '../repositories/journey.station.repository';
import { ISeatRepository } from '../repositories/seat.repository';
import { SearchTrainsDto } from './dto/search-trains.dto';
import { JourneyStationDto } from './dto/journey-station.dto';

@Injectable()
export class TrainsService {
    constructor(
        @InjectRepository(JourneyStation)
        private readonly journeyStationRepository: IJourneyStationRepository,
        @InjectRepository(Seat)
        private readonly seatRepository: ISeatRepository,
    ) { }

    async findTrains(searchTrainsDto: SearchTrainsDto) {
        const {
            departureStationId,
            arrivalStationId,
            travelDate,
        } = searchTrainsDto;

        return this.journeyStationRepository.findTrains(departureStationId, arrivalStationId, travelDate);
    }

    async getTrainCarriagesAvailability(journeyId: string, journeyStationDto: JourneyStationDto) {
        const [startStopIndex, endStopIndex] = await this.getStopIndices(journeyId, journeyStationDto);

        return this.seatRepository.getSeatAvailability({
            journeyId,
            startStopIndex,
            endStopIndex,
        })
    }

    async getCarriageSeats(journeyId: string, carriageNo: string, journeyStationDto: JourneyStationDto) {
        const [startStopIndex, endStopIndex] = await this.getStopIndices(journeyId, journeyStationDto);

        return this.seatRepository.getSeatAvailabilityStatus({
            journeyId,
            carriageNo,
            startStopIndex,
            endStopIndex,
        });
    }

    private async getStopIndices(journeyId: string, journeyStationDto: JourneyStationDto) {
        const { departureStationId, arrivalStationId } = journeyStationDto;
        const stopsPositions = await this.journeyStationRepository.getStopsPosition(journeyId, [departureStationId, arrivalStationId]);

        if (stopsPositions.length !== 2
            || departureStationId !== +stopsPositions[0].station_id
            || arrivalStationId !== +stopsPositions[1].station_id) {
            throw new Error('Invalid journey or stations data.'); 
        }

        return [stopsPositions[0].stop_order, stopsPositions[1].stop_order];
    }
}
