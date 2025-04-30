// src/appointments/entities/booking.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    OneToOne,
    ManyToOne,
    Column,
    JoinColumn,
} from 'typeorm';
import { Slot } from './appointmentSlot.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Booking {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, user => user.id)
    user: User;

    @OneToOne(() => Slot, slot => slot.booking)
    @JoinColumn()
    slot: Slot;

    @Column({ default: false })
    reminderSent: boolean;

    @Column({ default: false })
    isExpired: boolean;
}
