import { Entity, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm';
import { TrainJourney } from './train.journey.entity';
import { SeatClass } from './seat.class.entity';

@Entity('seat')
export class Seat {
    @PrimaryColumn({ name: 'seat_no' })
    seatNo: number;

    @ManyToOne(() => TrainJourney)
    @JoinColumn({ name: 'train_journey_id' })
    @PrimaryColumn({ name: 'train_journey_id' })
    trainJourney: TrainJourney;

    @ManyToOne(() => SeatClass)
    @JoinColumn({ name: 'seat_class_id' })
    seatClass: SeatClass;
}