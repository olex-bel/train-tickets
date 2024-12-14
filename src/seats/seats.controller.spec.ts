import { Test, TestingModule } from '@nestjs/testing';
import { SeatsController } from './seats.controller';
import { SeatsService } from './seats.service';
import { SeatConflictException } from './errors/seat-conflict.exception';
import { ConflictException } from '@nestjs/common';
import { InvalidReservationTokenException } from './errors/invalid-reservation-token.exception';
import { ForbiddenException } from '@nestjs/common';

describe('SeatsController', () => {
    let controller: SeatsController;
    let service: SeatsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SeatsController],
            providers: [{
                provide: SeatsService,
                useValue: {
                    reserveSeats: jest.fn(),
                },
            }]
        }).compile();

        controller = module.get<SeatsController>(SeatsController);
        service = module.get<SeatsService>(SeatsService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('reserveSeats', () => {
        it('should call reserveSeats with correct parameters', async () => {
            const seatsReserveDto = { departureStationId: 1001, arrivalStationId: 1002, seats: [1], token: null };

            service.reserveSeats = jest.fn().mockResolvedValue('reserved');
            const result = await controller.reserveSeats('101', '1', seatsReserveDto);
            
            expect(result).toBe('reserved');
            expect(service.reserveSeats).toHaveBeenCalledWith('101', '1', seatsReserveDto);
        });

        it('should throw ConflictException when SeatConflictException is thrown', async () => {
            const seatsReserveDto = { departureStationId: 1001, arrivalStationId: 1002, seats: [1], token: null };
            
            service.reserveSeats = jest.fn().mockRejectedValue(new SeatConflictException('Seats conflict'));
            
            await expect(controller.reserveSeats('101', '1', seatsReserveDto)).rejects.toThrow(ConflictException);
        });

        it('should throw ForbiddenException when InvalidReservationTokenException is thrown', async () => {
            const seatsReserveDto = { departureStationId: 1001, arrivalStationId: 1002, seats: [1], token: null };
            
            service.reserveSeats = jest.fn().mockRejectedValue(new InvalidReservationTokenException('Invalid token'));
            await expect(controller.reserveSeats('101', '1', seatsReserveDto)).rejects.toThrow(ForbiddenException);
        });

        it('should throw Error when unknown exception is thrown', async () => {
            const seatsReserveDto = { departureStationId: 1001, arrivalStationId: 1002, seats: [1], token: null };
            
            service.reserveSeats = jest.fn().mockRejectedValue(new Error('some error'));
            await expect(controller.reserveSeats('101', '1', seatsReserveDto)).rejects.toThrow(Error);
        });
    });
});