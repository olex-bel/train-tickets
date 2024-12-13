import { Module } from '@nestjs/common';
import { TypeOrmModule, getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TrainsController } from './trains.controller';
import { TrainsService } from './trains.service';
import JourneyStation from '../entity/journey.station.entity';
import Seat from '../entity/seats.entity';
import { customJourneyStationRepository } from '../repositories/journey.station.repository';
import { customSeatRepository } from '../repositories/seat.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([JourneyStation, Seat]),
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
        {
            provide: getRepositoryToken(Seat),
            inject: [getDataSourceToken()],
            useFactory(dataSource: DataSource) {
                return dataSource
                    .getRepository(Seat)
                    .extend(customSeatRepository);
            },
        },
        TrainsService
    ]
})
export class TrainsModule { }
