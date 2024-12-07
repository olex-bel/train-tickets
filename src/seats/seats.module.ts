import { Module } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenModule } from 'src/token/token.module';
import Seat from 'src/entity/seats.entity';
import SeatReservation from 'src/entity/seats.reservation.entity';
import JourneyStation from 'src/entity/journey.station.entity';
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
