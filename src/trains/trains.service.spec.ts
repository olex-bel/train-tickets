import { Test, TestingModule } from '@nestjs/testing';
import { TrainsService } from './trains.service';

const mockSeatRepository = {
    findSeats: jest.fn(),
    getSeatAvailability: jest.fn(),
    getSeatAvailabilityStatus: jest.fn(),
};

const mockJourneyStationRepository = {
    findTrains: jest.fn(),
    getStopsPosition: jest.fn(),
};

describe('TrainsService', () => {
    let service: TrainsService;
    
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TrainsService],
        })
            .useMocker((token) => {
                if (token === 'JourneyStationRepository') {
                    return mockJourneyStationRepository;
                } else if (token === 'SeatRepository') {
                    return mockSeatRepository;
                }
            })
            .compile();

        service = module.get<TrainsService>(TrainsService);
        
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findTrains', () => {
        it('should return the train list', async () => {
            const result = [{
                name: 'test train 1',
                journey_id: 256,
                departure_station_id: 2001,
                departure_time: '08:00:00',
                arrival_station_id: 4001,
                arrival_time: '15:35:00',
            }, {
                name: 'test train 2',
                journey_id: 258,
                departure_station_id: 2001,
                departure_time: '09:00:00',
                arrival_station_id: 4001,
                arrival_time: '16:35:00',
            }];

            jest.spyOn(mockJourneyStationRepository, 'findTrains').mockImplementation(async () => result);
            expect(await service.findTrains({ departureStationId: 2001, arrivalStationId: 4001, travelDate: '2022-09-27' })).toBe(result);
        });
    });

    describe('getTrainCarriagesAvailability', () => {
        it('should trow error if stops number is invalid', async () => {
            const stops = [];
            const result = [];

            jest.spyOn(mockJourneyStationRepository, 'getStopsPosition').mockImplementation(async () => stops);
            jest.spyOn(mockSeatRepository, 'getSeatAvailability').mockImplementation(async () => result);
            
            expect(async () => {
                await service.getTrainCarriagesAvailability('101', { departureStationId: 1001, arrivalStationId: 2002 })
            }).rejects.toThrow();
        });

        it('should return carriages availability', async () => {
            const stops = [{
                station_id: 1001,
                stop_order: 1,
            }, {
                station_id: 2002,
                stop_order: 2,
            }];
            const result = [{
                carriage_no: 1,
                free_seats: 20,
            }, {
                carriage_no: 2,
                free_seats: 12,
            }];

            jest.spyOn(mockJourneyStationRepository, 'getStopsPosition').mockImplementation(async () => stops);
            jest.spyOn(mockSeatRepository, 'getSeatAvailability').mockImplementation(async () => result);

            expect(await service.getTrainCarriagesAvailability('101', { departureStationId: 1001, arrivalStationId: 2002 })).toBe(result);
        });
    });

    describe('getCarriageSeats', () => {
        it('should trow error if stops number is invalid', async () => {
            const stops = [];
            const result = [];

            jest.spyOn(mockJourneyStationRepository, 'getStopsPosition').mockImplementation(async () => stops);
            jest.spyOn(mockSeatRepository, 'getSeatAvailabilityStatus').mockImplementation(async () => result);
            
            expect(async () => {
                await service.getCarriageSeats('101', '1', { departureStationId: 1001, arrivalStationId: 2002 })
            }).rejects.toThrow();
        });

        it('should return seats status', () => {
            const stops = [{
                station_id: 1001,
                stop_order: 1,
            }, {
                station_id: 2002,
                stop_order: 2,
            }];
            const result = [{
                seat_no: 1,
                class_id: 2,
                is_avaliable: true,
            }, {
                seat_no: 2,
                class_id: 2,
                is_avaliable: true,
            }, {
                seat_no: 3,
                class_id: 2,
                is_avaliable: false,
            }];

            jest.spyOn(mockJourneyStationRepository, 'getStopsPosition').mockImplementation(async () => stops);
            jest.spyOn(mockSeatRepository, 'getSeatAvailabilityStatus').mockImplementation(async () => result);
        });
    });
});
