import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Route {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}