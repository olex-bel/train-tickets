import { Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn, Column, Unique, Check } from 'typeorm';
import CarriageAssignment from './carriage.assignment.entity';
import SeatClass from './seat.class.entity';

@Entity('carriage_seat_assignment')
@Unique('UQ_SEAT_ASSIGNMENT', ['seatClass', 'carriage'])
@Check('start_seat_number > 0 AND end_seat_number > 0 AND start_seat_number < end_seat_number')
export default class CarriageSeatAssignment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'start_seat_number' })
    startSeatNumber: number;

    @Column({ name: 'end_seat_number' })
    endSeatNumber: number;

    @ManyToOne(() => SeatClass, (seatClass) => seatClass.seatsAssignment)
    @JoinColumn({ name: 'class_id' })
    seatClass: SeatClass;

    @ManyToOne(() => CarriageAssignment, (carriage) => carriage.seatsAssignment)
    @JoinColumn({ name: 'carriage_id' })
    carriage: CarriageAssignment;

    @Column({ name: 'class_id'})
    classId: number;
}
