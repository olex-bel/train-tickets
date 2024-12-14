import { Test, TestingModule } from '@nestjs/testing';
import { SeatsService } from './seats.service';
import { TokenService } from '../token/token.service';
import { DataSource } from 'typeorm';
import SeatReservation from '../entity/seats.reservation.entity';
import Seat from '../entity/seats.entity';
import JourneyStation from '../entity/journey.station.entity';
import { SeatConflictException } from './errors/seat-conflict.exception';
import { InvalidReservationTokenException } from './errors/invalid-reservation-token.exception';
import { QueryFailedError } from 'typeorm';

const MockSeatReservationReposiotry = {
    getSeatAvailability: jest.fn(),
    getReservationsByToken: jest.fn(),
};

const MockSeatReposiotry = {
    findSeats: jest.fn(),
};

const MockJourneyStationRepository = {
    getStopsPosition: jest.fn(),
};

describe('SeatsService', () => {
    let service: SeatsService;
    let dataSource: DataSource;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SeatsService,
                {
                    provide: TokenService,
                    useValue: {
                        decodeToken: jest.fn(),
                        generateToken: jest.fn(),
                    },
                },
                {
                    provide: DataSource,
                    useValue: {
                        createQueryRunner: jest.fn().mockReturnValue({
                            connect: jest.fn(),
                            startTransaction: jest.fn(),
                            commitTransaction: jest.fn(),
                            rollbackTransaction: jest.fn(),
                            release: jest.fn(),
                            manager: {
                                getRepository: jest.fn().mockImplementation((entity) => {
                                    if (entity === SeatReservation) {
                                        return { extend: jest.fn(() => MockSeatReservationReposiotry) };
                                    } else if (entity === Seat) {
                                        return { extend: jest.fn(() => MockSeatReposiotry) };
                                    } else if (entity === JourneyStation) {
                                        return { extend: jest.fn(() => MockJourneyStationRepository) };
                                    }
                                }),
                                save: jest.fn(),
                            },
                        }),
                    },
                },
            ],
        }).compile();

        service = module.get<SeatsService>(SeatsService);
        dataSource = module.get<DataSource>(DataSource);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('reserveSeats', () => {
        it('should reserve seats successfully', async () => {
            const reserveDto = {
                arrivalStationId: 1001,
                departureStationId: 2001,
                seats: [1, 2],
                token: null,
            };

            const tokenData = { token: 'token123', expirationTime: new Date() };
            jest.spyOn(service as any, 'getStopIndices').mockResolvedValue([1, 2]);
            jest.spyOn(service as any, 'validateSeats').mockResolvedValue(undefined);
            jest.spyOn(service as any, 'validateSeatAvailability').mockResolvedValue(undefined);
            jest.spyOn(service as any, 'handleReservationToken').mockResolvedValue(tokenData);
            jest.spyOn(service as any, 'createSeatReservations').mockReturnValue([]);

            const result = await service.reserveSeats('101', '1', reserveDto);

            expect(result).toEqual(tokenData);
        });

        it('should throw SeatConflictException', async () => {
            const reserveDto = {
                arrivalStationId: 1001,
                departureStationId: 2001,
                seats: [1, 2],
                token: null,
            };

            jest.spyOn(service as any, 'getStopIndices').mockResolvedValue([1, 2]);
            jest.spyOn(service as any, 'validateSeats').mockResolvedValue(undefined);
            jest.spyOn(service as any, 'validateSeatAvailability').mockImplementation(() => {
                throw new SeatConflictException('Seat(s) cannot be reserved.');
            });

            await expect(service.reserveSeats('101', '1', reserveDto)).rejects.toThrow(SeatConflictException);
        });

        it('should throw InvalidReservationTokenException', async () => {
            const reserveDto = {
                arrivalStationId: 1001,
                departureStationId: 2001,
                seats: [1, 2],
                token: null,
            };

            jest.spyOn(service as any, 'getStopIndices').mockResolvedValue([1, 2]);
            jest.spyOn(service as any, 'validateSeats').mockResolvedValue(undefined);
            jest.spyOn(service as any, 'validateSeatAvailability').mockResolvedValue(undefined);
            jest.spyOn(service as any, 'handleReservationToken').mockImplementation(() => {
                throw new InvalidReservationTokenException('Invalid token.');
            });

            await expect(service.reserveSeats('101', '1', reserveDto)).rejects.toThrow(InvalidReservationTokenException);
        });

        it('should handle QueryFailedError and throw SeatConflictException', async () => {
            const reserveDto = {
                arrivalStationId: 1001,
                departureStationId: 2001,
                seats: [1, 2],
                token: null,
            };

            const queryRunnerMock = dataSource.createQueryRunner() as any;
            jest.spyOn(queryRunnerMock, 'rollbackTransaction').mockImplementation(() => Promise.resolve());
            jest.spyOn(queryRunnerMock, 'release').mockImplementation(() => Promise.resolve());

            jest.spyOn(service as any, 'getStopIndices').mockResolvedValue([1, 2]);
            jest.spyOn(service as any, 'validateSeats').mockResolvedValue(undefined);
            jest.spyOn(service as any, 'validateSeatAvailability').mockImplementation(() => {
                throw new QueryFailedError('', [], { code: '23P01' } as any);
            });

            await expect(service.reserveSeats('101', '1', reserveDto)).rejects.toThrow(SeatConflictException);
        });
    });
});
