import { Repository } from 'typeorm';
import JourneyStation from '../entity/journey.station.entity';

type StopPosition = {
    station_id: number;
    stop_order: number;
};

type JourneyScheduleInfo = {
    name: string;
    journey_id: number;
    departure_station_id: number;
    departure_time: string;
    arrival_station_id: number;
    arrival_time: string;
};

export interface IJourneyStationRepository extends Repository<JourneyStation> {
    this: Repository<JourneyStation>;
    getStopsPosition(journeyId: string, stationIds: number[]): Promise<StopPosition[]>;
    findTrains(departureStationId: number, arrivalStationId: number, travelDate: string): Promise<JourneyScheduleInfo[]>;
};

type CustomJourneyStationMethods = Pick<IJourneyStationRepository, 'getStopsPosition' | 'findTrains'> ;
export type CustomJourneyStationRepository = Repository<JourneyStation> & CustomJourneyStationMethods;

export const customJourneyStationRepository: CustomJourneyStationMethods = {
    getStopsPosition: async function(this: CustomJourneyStationRepository, journeyId: string, stationIds: number[]): Promise<StopPosition[]> { 
        return this.createQueryBuilder()
            .select('station_id, stop_order')
            .where('journey_id = :journeyId', { journeyId })
            .andWhere('station_id IN (:...stationIds)', { stationIds })
            .orderBy('stop_order')
            .getRawMany();
    },

    findTrains: async function (this: CustomJourneyStationRepository, departureStationId: number, arrivalStationId: number, travelDate: string): Promise<JourneyScheduleInfo[]> {
        return this.createQueryBuilder('departure')
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
    },
};
