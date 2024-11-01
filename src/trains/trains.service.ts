import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JourneyStation } from 'src/entity/journey.station.entity';
import { SearchTrainsDto } from './dto/search-trains.dto';

@Injectable()
export class TrainsService {
    constructor(
        @InjectRepository(JourneyStation)
        private readonly journeyStationRepository: Repository<JourneyStation>
    ) { }

    async findTrains(searchTrainsDto: SearchTrainsDto): Promise<any[]> {
        const {
            departureStationId,
            arrivalStationId,
            travelDate,
        } = searchTrainsDto;

        return this.journeyStationRepository.createQueryBuilder('departure')
            .leftJoinAndSelect('journey_station', 'arrival', 'departure.journey_id = arrival.journey_id')
            .where('departure.station_id = :departureStationId', { departureStationId })
            .andWhere('arrival.station_id = :arrivalStationId', { arrivalStationId })
            .andWhere('departure.stop_order < arrival.stop_order')
            .andWhere('departure.departure_time::date = :travelDate', { travelDate }).getMany();
    }
}

/**
 * const sqlQuery = `
      SELECT 
        departure.journey_id, 
        departure.departure_time as departure_time,
        departure.station_id as departure_station_id,
        arrival.departure_time as arrival_time,
        arrival.station_id as arrival_station_id 
      FROM journey_station departure
      JOIN journey_station arrival 
        ON departure.journey_id = arrival.journey_id
      WHERE departure.station_id = $1 
        AND arrival.station_id = $2
        AND departure.stop_order < arrival.stop_order
        AND departure.departure_time::date = $3
    `;
 */