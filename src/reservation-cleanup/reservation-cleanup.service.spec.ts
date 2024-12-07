import { Test, TestingModule } from '@nestjs/testing';
import { ReservationCleanupService } from './reservation-cleanup.service';

describe('ReservationCleanupService', () => {
  let service: ReservationCleanupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReservationCleanupService],
    }).compile();

    service = module.get<ReservationCleanupService>(ReservationCleanupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
