import { Test, TestingModule } from '@nestjs/testing';
import { TrainJourneyCreatorService as TrainJourneyCreatorService } from './train-journey-creator.service';

describe('TrainJourneyService', () => {
  let service: TrainJourneyCreatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrainJourneyCreatorService],
    }).compile();

    service = module.get<TrainJourneyCreatorService>(TrainJourneyCreatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
