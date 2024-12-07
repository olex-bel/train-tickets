import { Test, TestingModule } from '@nestjs/testing';
import { JourneyTasksService } from './journey-tasks.service';

describe('JourneyTasksService', () => {
  let service: JourneyTasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JourneyTasksService],
    }).compile();

    service = module.get<JourneyTasksService>(JourneyTasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
