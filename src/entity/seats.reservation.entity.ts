import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn, Index, Exclusion } from 'typeorm';
import Seat from './seats.entity';

export enum ReservationStatus {
    AVAILABLE = 'available', 
    RESERVED = 'reserved', 
    SOLD = 'sold'
}

@Entity('seats_reservation')
@Exclusion(`USING gist ("journey_id" WITH =, "carriage_no" WITH =, "seat_no" WITH =, "start_end_stations" WITH &&)`)
@Index(['journeyId', 'carriageNo', 'seatNo'])
export default class SeatReservation {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Seat)
    @JoinColumn([
        { name: 'carriage_no', referencedColumnName: 'carriageNo' },
        { name: 'seat_no', referencedColumnName: 'seatNo' },
        { name: 'journey_id', referencedColumnName: 'journeyId' }
    ])
    seat: Seat;

    @Column({ name: 'journey_id' })
    journeyId: number;

    @Index({ spatial: true })
    @Column({ name: 'start_end_stations', type: 'int4range' })
    startEndtStations: string;

    @Column({ name: 'carriage_no' })
    carriageNo: number;
    
    @Column({ name: 'seat_no' })
    seatNo: number;
   
    @Column({ name: 'reserved_until', type: 'timestamp with time zone', nullable: true })
    reservedUntil: Date;

    @Column({ type: 'enum', enum: ReservationStatus, default: ReservationStatus.AVAILABLE })
    status: ReservationStatus;

    @Column({ name: 'reservation_token', length: 64,  nullable: true })
    reservationToken: string;
}
