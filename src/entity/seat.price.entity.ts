import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import SeatClass from './seat.class.entity';
import JourneySchedule from './journey.schedule.entity';

@Entity('seat_price')
export class SeatPrice {
    @Column({ name: 'price', type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @ManyToOne(() => SeatClass)
    @JoinColumn({ name: 'class_id', referencedColumnName: 'id' })
    @PrimaryColumn({ name: 'class_id' })
    seatClass: SeatClass;

    @ManyToOne(() => JourneySchedule)
    @JoinColumn({ name: 'schedule_id', referencedColumnName: 'id' })
    @PrimaryColumn({ name: 'schedule_id' })
    schedule: JourneySchedule;
}