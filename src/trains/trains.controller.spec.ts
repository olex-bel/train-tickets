import { Test, TestingModule } from '@nestjs/testing';
import { TrainsController } from './trains.controller';
import { TrainsService } from './trains.service';

describe('TrainsController', () => {
    let controller: TrainsController;
    let service: TrainsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TrainsController],
            providers: [TrainsService],
        })
        .useMocker((token) => {
            if (token === 'JourneyStationRepository') {
                return {
                    findTrains: jest.fn(),
                    getStopsPosition: jest.fn(),
                };
            } else if (token === 'SeatRepository') {
                return {
                    findSeats: jest.fn(),
                    getSeatAvailability: jest.fn(),
                    getSeatAvailabilityStatus: jest.fn(),
                };
            }
        })
        .compile();

        controller = module.get<TrainsController>(TrainsController);
        service = module.get<TrainsService>(TrainsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findTrains', () => {
        it('should return list of trains', async () => {
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

            jest.spyOn(service, 'findTrains').mockImplementation(async () => result);
            expect(await controller.findTrains({ departureStationId: 2001, arrivalStationId: 4001, travelDate: '2022-09-27' })).toBe(result);
        })
    });

    describe('getTrainCarriagesAvailability', () => {
        it('should return carriages availability', async () => {
            const result = [{
                carriage_no: 1,
                free_seats: 20,
            }, {
                carriage_no: 2,
                free_seats: 27,
            }];

            jest.spyOn(service, 'getTrainCarriagesAvailability').mockImplementation(async () => result);
            expect(await controller.getTrainCarriagesAvailability('101', { departureStationId: 1001, arrivalStationId: 1008 })).toBe(result);
        })
    });

    describe('getCarriageSeats', () => {
        it('should return carriage seats status', async () => {
            const result = [{
                seat_no: 1,
                class_id: 1,
                is_avaliable: true,
            }, {
                seat_no: 2,
                class_id: 1,
                is_avaliable: true,
            }, {
                seat_no: 3,
                class_id: 1,
                is_avaliable: false,
            }];

            jest.spyOn(service, 'getCarriageSeats').mockImplementation(async () => result);
            expect(await controller.getCarriageSeats('101', '1', { departureStationId: 1001, arrivalStationId: 2001 })).toBe(result);
        });
    });
});
