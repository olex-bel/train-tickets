import { Module } from '@nestjs/common';
import { ReservationCleanupService } from './reservation-cleanup.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import SeatReservation from '../entity/seats.reservation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SeatReservation])],
  providers: [ReservationCleanupService],
  exports: [ReservationCleanupService],
})
export class ReservationCleanupModule {}
