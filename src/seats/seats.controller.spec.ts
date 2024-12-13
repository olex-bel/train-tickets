import { Test, TestingModule } from '@nestjs/testing';
import { SeatsController } from './seats.controller';

xdescribe('SeatsController', () => {
  let controller: SeatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeatsController],
    }).compile();

    controller = module.get<SeatsController>(SeatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
