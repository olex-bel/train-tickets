import { Injectable, Logger  } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { TrainJourneyCreatorService } from '../train-journey-creator/train-journey-creator.service';
import { ReservationCleanupService } from '../reservation-cleanup/reservation-cleanup.service';

@Injectable()
export class JourneyTasksService {
    private readonly logger = new Logger(JourneyTasksService.name);

    constructor(
       private readonly trainJourneyService: TrainJourneyCreatorService,
       private readonly reservationCleanupService: ReservationCleanupService
    ) {}

    @Cron('0 4 * * * *')
    async createJourneys() {
       await this.trainJourneyService.createJourneys();
    }

    @Interval(5 * 60 * 1000)
    async cleanupReservations() {
      await this.reservationCleanupService.cleanupExpiredReservation();
    }
}
