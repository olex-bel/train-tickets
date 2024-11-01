import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { TrainJourney } from './train.journey.entity';

@Entity('journey_carriage')
export class JourneyCarriage {
    @Column()
    position: number;

    @ManyToOne(() => TrainJourney)
    @JoinColumn({ name: 'train_journey_id' })
    @PrimaryColumn({ name: 'train_journey_id' })
    trainJourney: TrainJourney;
}