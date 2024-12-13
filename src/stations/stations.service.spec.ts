import { Test, TestingModule } from '@nestjs/testing';
import { StationsService } from './stations.service';

const mockStations = [
    { id: 1000, name: 'test'},
    { id: 2000, name: 'other-test'},
];

describe('StationsService', () => {
    let service: StationsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StationsService,
                
            ],
        })
        .useMocker((token) => {
            if (token === 'TrainStationRepository') {
                return { findStationByName: jest.fn().mockResolvedValue(mockStations) }
            }
        })
        .compile();

        service = module.get<StationsService>(StationsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findByName', () => {
        it('should return stations', async () => {
            const stationsResult = await service.findByName({
                query: 'test',
            });

            expect(stationsResult).toStrictEqual(mockStations);
        })
    });
});
