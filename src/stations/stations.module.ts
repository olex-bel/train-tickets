import { Module } from '@nestjs/common';
import { TypeOrmModule, getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { StationsController } from './stations.controller';
import { StationsService } from './stations.service';
import TrainStation from '../entity/train.station.entity';
import { DataSource } from 'typeorm';
import { customTrainStationRepository } from '../repositories/train.station.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TrainStation])],
  controllers: [StationsController],
  providers: [
    {
      provide: getRepositoryToken(TrainStation),
      inject: [getDataSourceToken()],
      useFactory(dataSource: DataSource) {
        return dataSource
          .getRepository(TrainStation)
          .extend(customTrainStationRepository);
      },
    },
    StationsService
  ],
})
export class StationsModule { }
