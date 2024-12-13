import { Test, TestingModule } from '@nestjs/testing';
import { SeatsService } from './seats.service';

xdescribe('SeatsService', () => {
  let service: SeatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeatsService],
    }).compile();

    service = module.get<SeatsService>(SeatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
