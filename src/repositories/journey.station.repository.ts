import { Repository } from 'typeorm';
import JourneyStation from 'src/entity/journey.station.entity';

type StopIndices = {
    startStopIndex: number;
    endStopIndex: number;
};

export interface IJourneyStationRepository extends Repository<JourneyStation> {
    this: Repository<JourneyStation>;
  
    getStopsPosition(journeyId: string, stationIds: number[]): Promise<Record<number, number>>;
    getStopIndices(journeyId: string, departureStationId: number, arrivalStationId: number): Promise<StopIndices>;
};

export type CustomJourneyStationRepository = Pick<IJourneyStationRepository, 'getStopsPosition' | 'getStopIndices'> ;
export type JourneyStationRepository = Repository<JourneyStation> & CustomJourneyStationRepository;

export const customJourneyStationRepository: CustomJourneyStationRepository= {
    getStopsPosition: async function(this: IJourneyStationRepository, journeyId: string, stationIds: number[]): Promise<Record<number, number>> { 
        const stopIndexes = await this.createQueryBuilder()
            .select('station_id, stop_order')
            .where('journey_id = :journeyId', { journeyId })
            .andWhere('station_id IN (:...stationIds)', { stationIds })
            .orderBy('stop_order')
            .getRawMany();
        
        if (stopIndexes.length !== stationIds.length) { 
            throw new Error('Invalid journey or station data.'); 
        } 
        
        const result = stopIndexes.reduce((acc, { station_id, stop_order }) => {
            acc[station_id] = stop_order;
            return acc; 
        }, {});

        return result;
    },

    getStopIndices: async function(this: IJourneyStationRepository, journeyId: string, departureStationId: number, arrivalStationId: number): Promise<StopIndices> {
        const stopsPositionMap = await this.getStopsPosition(journeyId, [
            departureStationId,
            arrivalStationId,
        ]);

        return {
            startStopIndex: stopsPositionMap[departureStationId],
            endStopIndex: stopsPositionMap[arrivalStationId],
        };
    },
};
