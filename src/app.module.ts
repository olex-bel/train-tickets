import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';
import { StationsModule } from './stations/stations.module';
import { TrainsModule } from './trains/trains.module';
import { JourneyTasksModule } from './journey-tasks/journey-tasks.module';
import { TrainJourneyCreatorModule } from './train-journey-creator/train-journey-creator.module';
import { ReservationCleanupModule } from './reservation-cleanup/reservation-cleanup.module';
import { SeatsModule } from './seats/seats.module';
import { TokenModule } from './token/token.module';
import { HealthController } from './health/health.controller';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get('POSTGRES_HOST'),
                port: +configService.get('POSTGRES_PORT'),
                username: configService.get('POSTGRES_USER'),
                password: configService.get('POSTGRES_PASSWORD'),
                database: configService.get('POSTGRES_DB'),
                ssl: configService.get('POSTGRES_SSL') === 'true',
                entities: ['dist/**/*.entity.js'],
                // logging: 'all',
            }),
            inject: [ConfigService],
        }),
        TerminusModule,
        ScheduleModule.forRoot(),
        StationsModule,
        TrainsModule,
        JourneyTasksModule,
        TrainJourneyCreatorModule,
        ReservationCleanupModule,
        SeatsModule,
        TokenModule,
    ],
    controllers: [HealthController],
})
export class AppModule {}
