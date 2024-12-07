import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import CarriageSeatAssignment from './carriage.seat.assignment.entity';

@Entity('seat_class')
export default class SeatClass {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 40, name: 'class_name' })
    className: string;

    @OneToMany(() => CarriageSeatAssignment, (seatAssignmebt) => seatAssignmebt.carriage)
    seatsAssignment: CarriageSeatAssignment[];
}
