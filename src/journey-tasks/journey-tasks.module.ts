import { Module } from '@nestjs/common';
import { JourneyTasksService } from './journey-tasks.service';
import { TrainJourneyCreatorModule } from 'src/train-journey-creator/train-journey-creator.module';
import { ReservationCleanupModule } from 'src/reservation-cleanup/reservation-cleanup.module';

@Module({
  imports: [TrainJourneyCreatorModule, ReservationCleanupModule],
  providers: [JourneyTasksService]
})
export class JourneyTasksModule {}
