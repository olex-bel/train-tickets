import { Repository } from 'typeorm';
import TrainStation from '../entity/train.station.entity';

type StationItem = {
    id: number;
    name: string;
};

export interface ITrainStationRepository extends Repository<TrainStation> {
    this: Repository<TrainStation>;
    findStationByName(query: string): Promise<StationItem[]>;
};

type CustomTrainStationMethods = Pick<ITrainStationRepository, 'findStationByName'>;

export type CustomTrainStationRepository = Repository<TrainStation> & CustomTrainStationMethods;

export const customTrainStationRepository: CustomTrainStationMethods = {
    findStationByName(this:CustomTrainStationRepository,  query: string) {
        return this.createQueryBuilder("train-station")
            .where("unaccent(station_name) ilike unaccent(:query)", { query: `${query}%` })
            .getMany();
    },
};
