import { Module } from '@nestjs/common';
import { TrainJourneyCreatorService } from './train-journey-creator.service';
import { TypeOrmModule, getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import JourneySchedule from '../entity/journey.schedule.entity';
import TrainJourney from '../entity/train.journey.entity';
import RouteStationSchedule from '../entity/route.station.schedule.entity';
import JourneyStation from '../entity/journey.station.entity';
import CarriageAssignment from '../entity/carriage.assignment.entity';
import { customJourneyScheduleRepository } from 'src/repositories/journey.schedule.repository';

@Module({
    imports: [TypeOrmModule.forFeature([
        JourneySchedule,
        TrainJourney,
        RouteStationSchedule,
        JourneyStation,
        CarriageAssignment
    ])],
    providers: [
        TrainJourneyCreatorService,
        {
            provide: getRepositoryToken(JourneySchedule),
            inject: [getDataSourceToken()],
            useFactory(dataSource: DataSource) {
                return dataSource
                    .getRepository(JourneySchedule)
                    .extend(customJourneyScheduleRepository);
            },
        },
    ],
    exports: [TrainJourneyCreatorService],
})
export class TrainJourneyCreatorModule { }
