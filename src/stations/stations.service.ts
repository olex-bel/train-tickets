import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import TrainStation from 'src/entity/train.station.entity';
import { SearchStationsDto } from './dto/search-stations.dto';

@Injectable()
export class StationsService {
    constructor(
        @InjectRepository(TrainStation)
        private readonly trainStationRepository: Repository<TrainStation>
    ) { }

    async findByName(searchStationsDto: SearchStationsDto) {
        const { query } = searchStationsDto;

        return this.trainStationRepository
            .createQueryBuilder("train-station")
            .where("unaccent(station_name) ilike unaccent(:query)", { query: `${query}%` })
            .getMany();
    }
}
