import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StationsController } from './stations.controller';
import { StationsService } from './stations.service';
import TrainStation from 'src/entity/train.station.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrainStation])],
  controllers: [StationsController],
  providers: [StationsService],
})
export class StationsModule {}
