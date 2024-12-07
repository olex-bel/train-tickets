import { Module } from '@nestjs/common';
import { TrainJourneyCreatorService } from './train-journey-creator.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import JourneySchedule from 'src/entity/journey.schedule.entity';
import TrainJourney from 'src/entity/train.journey.entity';
import RouteStationSchedule from 'src/entity/route.station.schedule.entity';
import JourneyStation from 'src/entity/journey.station.entity';
import CarriageAssignment from 'src/entity/carriage.assignment.entity'; 

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
