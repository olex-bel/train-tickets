import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn, Index } from 'typeorm';
import TrainStation from './train.station.entity';
import TrainJourney from './train.journey.entity';

@Entity('journey_station')
@Index(['journey', 'station', 'stopOrder'])
export default class JourneyStation {
    @Column({ name: 'stop_order'})
    stopOrder: number;

    @Column({ name: 'departure_time', type: 'timestamp' })
    departureTime: Date;

    @Column({ name: 'arrival_time', type: 'timestamp' })
    arrivalTime: Date;

    @ManyToOne(() => TrainJourney)
    @JoinColumn({ name: 'journey_id' })
    @PrimaryColumn({ name: 'journey_id' })
    journey: TrainJourney;

    @ManyToOne(() => TrainStation)
    @JoinColumn({ name: 'station_id' })
    @PrimaryColumn({ name: 'station_id' })
    station: TrainStation;
}