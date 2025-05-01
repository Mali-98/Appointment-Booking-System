// src/appointments/provider-slots.controller.ts
import { Controller, Post, Get, Body, Req, UseGuards, Param, ForbiddenException, Patch, Delete } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from 'src/user/entities/user.entity';

@Controller('providers')
@UseGuards(RolesGuard)
@Roles(UserRole.PROVIDER)
export class ProviderSlotsController {
    constructor(private readonly appointmentsService: AppointmentsService) { }

    @Post(':providerId/slots')
    createSlot(
        @Param('providerId') providerId: string,
        @Body() dto: CreateAppointmentDto,
        @Req() req
    ) {
        // Check if authenticated provider matches route param
        if (providerId !== req.user.sub) {
            throw new ForbiddenException('You are not allowed to create slots for another provider.');
        }
        return this.appointmentsService.createSlot(dto, providerId);
    }

    @Get(':providerId/slots')
    getMySlots(@Param('providerId') providerId: string, @Req() req) {
        if (providerId !== req.user.sub) {
            throw new ForbiddenException('You are not allowed to view another provider\'s slots.');
        }
        return this.appointmentsService.getProviderSlots(providerId);
    }

    @Patch(':providerId/slots/:slotId')
    updateSlot(
        @Param('providerId') providerId: string,
        @Param('slotId') slotId: string,
        @Body() dto: CreateAppointmentDto,
        @Req() req,
    ) {
        if (providerId !== req.user.sub) {
            throw new ForbiddenException('You are not allowed to update slots for another provider.');
        }
        return this.appointmentsService.updateSlot(slotId, dto, providerId);
    }

    @Delete(':providerId/slots/:slotId')
    deleteSlot(
        @Param('providerId') providerId: string,
        @Param('slotId') slotId: string,
        @Req() req,
    ) {
        if (providerId !== req.user.sub) {
            throw new ForbiddenException('You are not allowed to delete slots for another provider.');
        }
        return this.appointmentsService.deleteSlot(slotId, providerId);
    }
}
