import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('schedule')
export class Schedule {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 100 })
    name: string;
}
