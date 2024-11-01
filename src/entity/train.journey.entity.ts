import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Schedule } from './schedule.entity';

@Entity('train_journey')
export class TrainJourney {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @ManyToOne(() => Schedule)
    @JoinColumn({ name: 'schedule_id' })
    schedule: Schedule;
}
