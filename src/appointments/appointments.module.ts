import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Slot } from './entities/appointmentSlot.entity';
import { Booking } from './entities/booking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtService } from '@nestjs/jwt';
import { ProviderSlotsController } from './provider-slots.controller';
import { UserBookingController } from './user-booking.controller';
import { ReminderService } from './reminder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Slot, Booking, User])],
  controllers: [AppointmentsController, ProviderSlotsController, UserBookingController],
  providers: [AppointmentsService, RolesGuard, JwtService, ReminderService],
})
export class AppointmentsModule { }
