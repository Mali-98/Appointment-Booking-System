// src/appointments/appointments.service.ts
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Slot } from './entities/appointmentSlot.entity';
import { Repository } from 'typeorm';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { User } from 'src/user/entities/user.entity';
import { Booking } from './entities/booking.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Slot)
    private slotRepo: Repository<Slot>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
  ) { }

  async createSlot(dto: CreateAppointmentDto, providerId: string) {
    const provider = await this.userRepo.findOne({ where: { id: providerId } });
    if (!provider) throw new NotFoundException('Provider not found');

    // Convert dateTime from string to Date
    const dateTime = new Date(dto.dateTime);

    if (isNaN(dateTime.getTime())) {
      throw new ForbiddenException('Invalid dateTime format');
    }

    // Check if there's already a slot at the same time for the same provider
    const existingSlot = await this.slotRepo.findOne({
      where: {
        provider: { id: providerId },
        dateTime: dateTime, // Compare Date objects directly
      },
    });

    if (existingSlot) {
      throw new ForbiddenException('Provider already has a slot at this time');
    }

    const slot = this.slotRepo.create({ ...dto, provider, dateTime }); // Use dateTime here
    return this.slotRepo.save(slot);
  }

  async getProviderSlots(providerId: string) {
    return this.slotRepo.find({ where: { provider: { id: providerId } }, relations: ['booking'] });
  }

  async updateSlot(slotId: string, dto: CreateAppointmentDto, providerId: string) {
    const slot = await this.slotRepo.findOne({
      where: { id: slotId },
      relations: ['provider'],
    });

    if (!slot) {
      throw new NotFoundException('Slot not found');
    }

    const newDate = new Date(dto.dateTime);
    if (isNaN(newDate.getTime())) {
      throw new ForbiddenException('Invalid dateTime format');
    }

    const existingSlot = await this.slotRepo.findOne({
      where: {
        provider: { id: providerId },
        dateTime: newDate,
      },
    });

    if (existingSlot && existingSlot.id !== slotId) {
      throw new ForbiddenException('Another slot already exists at this time');
    }

    slot.dateTime = newDate;
    slot.duration = dto.duration;
    return this.slotRepo.save(slot);
  }

  async deleteSlot(slotId: string, providerId: string) {
    const slot = await this.slotRepo.findOne({
      where: { id: slotId },
      relations: ['provider'],
    });

    if (!slot) {
      throw new NotFoundException('Slot not found');
    }

    await this.slotRepo.remove(slot);
    return { message: 'Slot deleted successfully' };
  }

  async bookSlot(slotId: string, userId: string) {
    const slot = await this.slotRepo.findOne({ where: { id: slotId }, relations: ['booking'] });
    if (!slot) {
      throw new NotFoundException('Slot not found');
    }

    if (slot.booking) {
      throw new ForbiddenException('This slot is already booked');
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const booking = this.bookingRepo.create({ user, slot });
    await this.bookingRepo.save(booking);

    slot.booking = booking;
    await this.slotRepo.save(slot);

    return booking;
  }

  async getUserBookings(userId: string) {
    return this.bookingRepo.find({
      where: { user: { id: userId } },
      relations: ['slot'], // Include slot details in the response
    });
  }

  async cancelBooking(slotId: string, userId: string) {
    const slot = await this.slotRepo.findOne({
      where: { id: slotId },
      relations: ['booking', 'booking.user'],
    });

    if (!slot || !slot.booking) {
      throw new NotFoundException('Booking not found for this slot');
    }

    if (slot.booking.user.id !== userId) {
      throw new ForbiddenException('You cannot cancel someone else\'s booking');
    }

    // First, break the relationship
    const booking = slot.booking;
    slot.booking = null;
    await this.slotRepo.save(slot);

    // Now remove the booking safely
    await this.bookingRepo.remove(booking);

    return { message: 'Booking canceled successfully' };
  }

}
