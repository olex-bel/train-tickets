import { Test, TestingModule } from '@nestjs/testing';
import { JourneyTasksService } from './journey-tasks.service';
import { TrainJourneyCreatorService } from '../train-journey-creator/train-journey-creator.service';
import { ReservationCleanupService } from '../reservation-cleanup/reservation-cleanup.service';

const MockTrainJourneyCreatorService = {
    createJourneys: jest.fn(),
};
const MockReservationCleanupService = {
    cleanupExpiredReservation: jest.fn(),
};

describe('JourneyTasksService', () => {
    let service: JourneyTasksService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [JourneyTasksService],
        })
            .useMocker((token) => {
                if (token === TrainJourneyCreatorService) {
                    return MockTrainJourneyCreatorService;
                } else if (token === ReservationCleanupService) {
                    return MockReservationCleanupService;
                }
            })
            .compile();

        service = module.get<JourneyTasksService>(JourneyTasksService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createJourneys', () => {
        it('should run journay creation task', async () => {
            await service.createJourneys();
            expect(MockTrainJourneyCreatorService.createJourneys).toHaveBeenCalled();
        })
    });

    describe('cleanupReservations', () => {
        it('should run reservation removing task', async () => {
            await service.cleanupReservations();
            expect(MockReservationCleanupService.cleanupExpiredReservation).toHaveBeenCalled();
        })
    });
});
