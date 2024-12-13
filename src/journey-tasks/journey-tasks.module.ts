import { Module } from '@nestjs/common';
import { JourneyTasksService } from './journey-tasks.service';
import { TrainJourneyCreatorModule } from '../train-journey-creator/train-journey-creator.module';
import { ReservationCleanupModule } from '../reservation-cleanup/reservation-cleanup.module';

@Module({
  imports: [TrainJourneyCreatorModule, ReservationCleanupModule],
  providers: [JourneyTasksService]
})
export class JourneyTasksModule {}
