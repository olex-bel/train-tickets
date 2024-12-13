import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import TrainStation from '../entity/train.station.entity';
import { SearchStationsDto } from './dto/search-stations.dto';
import { ITrainStationRepository } from '../repositories/train.station.repository';

@Injectable()
export class StationsService {
    constructor(
        @InjectRepository(TrainStation)
        private readonly trainStationRepository: ITrainStationRepository
    ) { }

    async findByName(searchStationsDto: SearchStationsDto) {
        const { query } = searchStationsDto;

        return this.trainStationRepository.findStationByName(query);
    }
}
