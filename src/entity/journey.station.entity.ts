import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { TrainStation } from './train.station.entity';
import { TrainJourney } from './train.journey.entity';

@Entity("journey_station")
export class JourneyStation {
    @Column({ name: 'stop_order'})
    stopOrder: number;

    @Column({ name: 'departure_time', type: 'timestamp' })
    departureTime: Date;

    @Column({ name: 'distance_from_previous' })
    distanceFromPrevious: number;

    @ManyToOne(() => TrainStation)
    @JoinColumn({ name: 'station_id' })
    @PrimaryColumn({ name: 'station_id' })
    station: TrainStation;

    @ManyToOne(() => TrainJourney)
    @JoinColumn({ name: 'journey_id' })
    @PrimaryColumn({ name: 'journey_id' })
    journeyId: TrainJourney;
}