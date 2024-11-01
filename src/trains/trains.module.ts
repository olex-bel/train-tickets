import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainsController } from './trains.controller';
import { TrainsService } from './trains.service';
import { JourneyStation } from 'src/entity/journey.station.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JourneyStation])],
  controllers: [TrainsController],
  providers: [TrainsService]
})
export class TrainsModule {}
