import { Module } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenModule } from '../token/token.module';
import Seat from '../entity/seats.entity';
import SeatReservation from '../entity/seats.reservation.entity';
import JourneyStation from '../entity/journey.station.entity';
import { SeatsController } from './seats.controller';

@Module({
	imports: [
		TypeOrmModule.forFeature([Seat, SeatReservation, JourneyStation]),
		TokenModule,
	],
	providers: [SeatsService],
	controllers: [SeatsController],
})
export class SeatsModule { }
