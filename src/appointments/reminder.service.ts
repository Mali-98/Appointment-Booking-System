// src/appointments/reminder.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Slot } from './entities/appointmentSlot.entity';

@Injectable()
export class ReminderService {
    private readonly logger = new Logger(ReminderService.name);

    constructor(
        @InjectRepository(Booking)
        private bookingRepo: Repository<Booking>,

        @InjectRepository(Slot)
        private slotRepo: Repository<Slot>,
    ) { }

    @Cron(CronExpression.EVERY_MINUTE)
    async sendReminders() {
        const now = new Date();
        const in30Min = new Date(now.getTime() + 30 * 60 * 1000);

        const bookings = await this.bookingRepo
            .createQueryBuilder('booking')
            .leftJoinAndSelect('booking.slot', 'slot')
            .leftJoinAndSelect('booking.user', 'user')
            .where('booking.reminderSent = false')
            .andWhere('slot.dateTime BETWEEN :now AND :in30Min', { now, in30Min })
            .getMany();

        for (const booking of bookings) {
            this.logger.log(`📧 Sending reminder to ${booking.user.email} for slot at ${booking.slot.dateTime}`);
            booking.reminderSent = true;
            await this.bookingRepo.save(booking);
        }
    }

}
