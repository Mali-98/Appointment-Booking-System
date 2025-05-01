// src/appointments/appointments.controller.ts
import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from 'src/user/entities/user.entity';

@Controller('appointments')
@UseGuards(RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) { }
}
