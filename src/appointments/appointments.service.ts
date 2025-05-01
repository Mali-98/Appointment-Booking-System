// src/appointments/appointments.service.ts
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Slot } from './entities/appointmentSlot.entity';
import { Repository } from 'typeorm';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Slot)
    private slotRepo: Repository<Slot>,

    @InjectRepository(User)
    private userRepo: Repository<User>, // 👈 needed to fetch the provider
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

  async getAvailableSlots() {
    return this.slotRepo.find({
      where: { booking: null },
      relations: ['provider'],
    });
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
}
