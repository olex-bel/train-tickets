import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import Route from './route.entity';
import JourneySchedule from './journey.schedule.entity';

@Entity('train_journey')
export default class TrainJourney {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'timestamp', name: 'start_date' })
    startDate: Date;

    @ManyToOne(() => Route)
    @JoinColumn({ name: 'route_id', referencedColumnName: 'id'})
    route: Route;

    @ManyToOne(() => JourneySchedule)
    @JoinColumn({ name: 'schedule_id', referencedColumnName: 'id' })
    schedule: JourneySchedule;
}
