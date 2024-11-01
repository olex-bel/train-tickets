import { Entity, Column, OneToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Seat } from './seat.entity';
import { TrainStation } from './train.station.entity';

export enum ReservationStatus {
    AVAILABLE = 'available', 
    RESERVED = 'reserved', 
    SOLD = 'sold'
}

@Entity('seat_reservation')
export class SeatReservation {
    @Column({ name: 'reserved_until', type: 'timestamp' })
    reservedUntil: Date;

    @Column({ type: 'enum', enum: ReservationStatus, default: ReservationStatus.AVAILABLE })
    status: ReservationStatus;

    @Column({ name: 'reservation_token', length: 64 })
    reservationToken: string;

    @OneToOne(() => Seat)
    @JoinColumn([
        { name: 'train_journey_id' },
        { name: 'seat_no' },
    ])
    seat: Seat;
    @PrimaryColumn({ name: 'train_journey_id' })
    trainJourneyId: number;
    @PrimaryColumn({ name: 'seat_no' })
    seatNo: number;

    @OneToOne(() => TrainStation)
    @JoinColumn({ name: 'starting_station_id', referencedColumnName: 'id' })
    startingStation: TrainStation;

    @OneToOne(() => TrainStation)
    @JoinColumn({ name: 'ending_station_id', referencedColumnName: 'id' })
    endingStation: TrainStation;
}
