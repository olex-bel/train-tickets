import { Entity, PrimaryColumn, JoinColumn, ManyToOne, Column } from 'typeorm';
import SeatClass from './seat.class.entity';
import JourneyCarriage from './journey.carriage.entity';

@Entity('seats')
export default class Seat {
    @PrimaryColumn({ name: 'seat_no' })
    seatNo: number;

    @ManyToOne(() => JourneyCarriage)
    @JoinColumn([
        { name: 'carriage_no', referencedColumnName: 'carriageNo' },
        { name: 'journey_id', referencedColumnName: 'journeyId' },
    ])
    carriage: JourneyCarriage;

    @ManyToOne(() => SeatClass)
    @JoinColumn({ name: 'class_id' })
    seatClass: SeatClass;

    @Column({ name: 'class_id'})
    classId: number;

    @PrimaryColumn({ name: 'carriage_no' })
    carriageNo: number;

    @PrimaryColumn({ name: 'journey_id'})
    journeyId: number;
}