import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import SeatReservation from 'src/entity/seats.reservation.entity';

@Injectable()
export class ReservationCleanupService {
    private readonly logger = new Logger(ReservationCleanupService.name);

    constructor(private dataSource: DataSource) {}

    async cleanupExpiredReservation() {
        const queryRunner = this.dataSource.createQueryRunner();
        const now = new Date();

        this.logger.debug('Start the removal process for expired reservations.')
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const result = await queryRunner.manager.createQueryBuilder()
                .delete()
                .from(SeatReservation)
                .where("status = 'reserved' and reserved_until < :currentTime", { currentTime: now })
                .execute();
            
            this.logger.debug(`Removed ${result.affected} reservations.`)

            await queryRunner.commitTransaction();
        } catch (error) {
            this.logger.error(`Failed to remove reservations: ${error}`);
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }
}
