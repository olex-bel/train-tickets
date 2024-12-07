import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import Route from './route.entity';

export enum DayOfWeek {
    SUNDAY = 'sun', 
    MONDAY = 'mon', 
    TUESDAY  = 'tue', 
    WEDNESDAY = 'wed', 
    THURSDAY  = 'thu', 
    FRIDAY  = 'fri', 
    SATURDAY = 'sat'
}

@Entity('journey_schedule')
@Index(['id', 'departureTime'], { unique: true })
export default class JourneySchedule {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'day_of_week', enum: DayOfWeek })
    dayOfWeek: DayOfWeek;

    @Column({ name: 'departure_time', type: 'time' })
    departureTime: string;

    @ManyToOne(() => Route)
    @JoinColumn({ name: 'route_id', referencedColumnName: 'id'})
    route: Route;
}