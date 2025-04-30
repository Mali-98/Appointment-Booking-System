// src/appointments/appointments.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
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

    const slot = this.slotRepo.create({ ...dto, provider });
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
}
