import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('train_station')
export default class TrainStation {
    @PrimaryColumn()
    id: number;
 
    @Column({ type: 'varchar', length: 50, name: 'station_name'})
    name: string;
}