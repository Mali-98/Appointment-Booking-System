import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Booking } from './booking.entity';

@Entity()
export class Slot {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, user => user.id)
    provider: User;

    // Change to a single timestamp field
    @Column('timestamp')
    dateTime: Date; // Store both date and time as a timestamp

    @Column()
    duration: number; // minutes

    @OneToOne(() => Booking, booking => booking.slot, { nullable: true })
    @JoinColumn()
    booking: Booking;
}
