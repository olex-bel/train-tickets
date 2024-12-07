import { Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import TrainJourney from './train.journey.entity';

@Entity('journey_carriage')
export default class JourneyCarriage {
    @PrimaryColumn({ name: 'carriage_no' })
    carriageNo: number;

    @PrimaryColumn({ name: 'journey_id' })
    journeyId: number;

    @ManyToOne(() => TrainJourney)
    @JoinColumn({ name: 'journey_id' })
    trainJourney: TrainJourney;
}