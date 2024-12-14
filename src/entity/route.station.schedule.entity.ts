import { Entity, ManyToOne, JoinColumn, PrimaryColumn, Column } from 'typeorm';
import TrainStation from './train.station.entity';
import Route from './route.entity';

@Entity('route_station_schedule')
export default class RouteStationSchedule {
    @ManyToOne(() => TrainStation)
    @JoinColumn({ name: 'station_id' })
    @PrimaryColumn({ name: 'station_id' })
    station: TrainStation;

    @ManyToOne(() => Route)
    @JoinColumn({ name: 'route_id', referencedColumnName: 'id' })
    route: Route;

    @PrimaryColumn({ name: 'route_id' })
    routeId: number;

    @Column({ name: 'stop_order' })
    stopOrder: number;

    @Column({ name: 'arrival_offset_minutes'})
    arrivalOffsetMinutes: number;

    @Column({ name: 'stop_duration_minutes' })
    stopDurationMinutes: number;
}
