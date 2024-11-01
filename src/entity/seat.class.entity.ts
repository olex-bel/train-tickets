import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('seat_class')
export class SeatClass {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 40, name: 'class_name' })
    className: string;
}
