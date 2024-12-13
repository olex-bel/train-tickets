import { Module } from '@nestjs/common';
import { TrainJourneyCreatorService } from './train-journey-creator.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import JourneySchedule from '../entity/journey.schedule.entity';
import TrainJourney from '../entity/train.journey.entity';
import RouteStationSchedule from '../entity/route.station.schedule.entity';
import JourneyStation from '../entity/journey.station.entity';
import CarriageAssignment from '../entity/carriage.assignment.entity'; 

@Module({
    imports: [TypeOrmModule.forFeature([
        JourneySchedule,
        TrainJourney,
        RouteStationSchedule,
        JourneyStation,
        CarriageAssignment
    ])],
    providers: [TrainJourneyCreatorService],
    exports: [TrainJourneyCreatorService],
})
export class TrainJourneyCreatorModule { }
