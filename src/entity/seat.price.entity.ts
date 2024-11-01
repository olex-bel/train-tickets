import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { SeatClass } from './seat.class.entity';
import { Schedule } from './schedule.entity';

@Entity('seat_price')
export class SeatPrice {
    @Column({ name: 'price_per_km', type: 'decimal', precision: 10, scale: 2 })
    pricePerKm: number;

    @ManyToOne(() => SeatClass)
    @JoinColumn({ name: 'seat_class_id' })
    @PrimaryColumn({ name: 'seat_class_id' })
    seatClass: SeatClass;

    @ManyToOne(() => Schedule)
    @JoinColumn({ name: 'schedule_id' })
    @PrimaryColumn({ name: 'schedule_id' })
    schedule: Schedule;
}