import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import JourneySchedule from './journey.schedule.entity';
import CarriageSeatAssignment from './carriage.seat.assignment.entity';

@Entity('carriage_assignment')
export default class CarriageAssignment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'carriage_no' })
    carriageNo: number;

    @ManyToOne(() => JourneySchedule)
    @JoinColumn({ name: 'schedule_id', referencedColumnName: 'id' })
    schedule: JourneySchedule;

    @OneToMany(() => CarriageSeatAssignment, (seatAssignmebt) => seatAssignmebt.carriage)
    seatsAssignment: CarriageSeatAssignment[];
}
