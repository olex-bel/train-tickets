import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { TrainStation } from './train.station.entity';
import { Seat } from './seat.entity';
import { Passenger } from './passenger.entity';

@Entity()
export class Booking {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'booking_date', type: 'timestamp' })
    bookingDate: Date;

    @Column({ name: 'ticket_no' })
    ticketNo: number;

    @Column({ name: 'amount_paid', type: 'decimal', precision: 10, scale: 2})
    amountPaid: number;

    @OneToOne(() => TrainStation)
    @JoinColumn({ name: 'starting_station_id', referencedColumnName: 'id' })
    startingStation: TrainStation;

    @OneToOne(() => TrainStation)
    @JoinColumn({ name: 'ending_station_id', referencedColumnName: 'id' })
    endingStation: TrainStation;

    @ManyToOne(() => Passenger)
    @JoinColumn({ name: 'passenger_id', referencedColumnName: 'id' })
    passenger: Passenger;

    @OneToOne(() => Seat)
    @JoinColumn([
        { name: "seat_no", referencedColumnName: "seatNo" },
        { name: "train_journey_id", referencedColumnName: "trainJourney" }
    ])
    seat: Seat;
}