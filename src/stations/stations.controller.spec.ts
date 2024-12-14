import { Test, TestingModule } from '@nestjs/testing';
import { StationsController } from './stations.controller';
import { StationsService } from './stations.service';

describe('StationsController', () => {
    let controller: StationsController;
    let service: StationsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [StationsController],
            providers: [{
                provide: StationsService,
                useValue: {
                    findByName: jest.fn(),
                },
            }]
        }).compile();

        controller = module.get<StationsController>(StationsController);
        service = module.get<StationsService>(StationsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findByName', () => {
        it('should return list of stations', async () => {
            const result = [{ id: 1001, name: 'test' }, { id: 1001, name: 'test-other' }];

            jest.spyOn(service, 'findByName').mockImplementation(async () => result);
            expect(await controller.findByName({ query: 'test' })).toBe(result);
        });
    });
});
