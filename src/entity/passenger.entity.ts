import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('passenger')
export class Passenger {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'first_name', type: 'varchar', length: 50 })
    firstName: string;

    @Column({ name: 'last_name', type: 'varchar', length: 50 })
    lastName: string;
}