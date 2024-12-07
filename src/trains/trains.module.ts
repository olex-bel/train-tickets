import { Module } from '@nestjs/common';
import { TypeOrmModule, getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TrainsController } from './trains.controller';
import { TrainsService } from './trains.service';
import { SeatsModule } from 'src/seats/seats.module';
import JourneyStation from 'src/entity/journey.station.entity';
import Seat from 'src/entity/seats.entity';
import { customJourneyStationRepository } from 'src/repositories/journey.station.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([JourneyStation, Seat]),
        SeatsModule,
    ],
    controllers: [TrainsController],
    providers: [
        {
            provide: getRepositoryToken(JourneyStation),
            inject: [getDataSourceToken()],
            useFactory(dataSource: DataSource) {
                return dataSource
                    .getRepository(JourneyStation)
                    .extend(customJourneyStationRepository);
            },
        },
        TrainsService
    ]
})
export class TrainsModule { }
