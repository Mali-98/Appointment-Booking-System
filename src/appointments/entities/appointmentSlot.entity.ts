// src/appointments/entities/slot.entity.ts
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

    @Column()
    date: string; // ISO Date string: YYYY-MM-DD

    @Column()
    time: string; // HH:mm

    @Column()
    duration: number; // minutes

    @OneToOne(() => Booking, booking => booking.slot, { nullable: true })
    @JoinColumn()
    booking: Booking;
}
