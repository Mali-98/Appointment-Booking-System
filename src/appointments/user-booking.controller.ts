import { Controller, Post, Get, Delete, Param, Body, Req, ForbiddenException } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { UserRole } from 'src/user/entities/user.entity';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UseGuards } from '@nestjs/common';

@Controller('slots')
@UseGuards(RolesGuard)
@Roles(UserRole.USER) // Only users can make bookings
export class UserBookingController {
    constructor(private readonly appointmentsService: AppointmentsService) { }

    // Book a slot
    @Post(':slotId/book')
    async bookSlot(@Param('slotId') slotId: string, @Req() req) {
        const userId = req.user.sub; // userId from JWT token
        const booking = await this.appointmentsService.bookSlot(slotId, userId);
        return { message: 'Slot booked successfully', booking };
    }

    // Get all booked slots for the current user
    @Get('booked')
    async getUserBookedSlots(@Req() req) {
        const userId = req.user.sub;
        return this.appointmentsService.getUserBookings(userId);
    }

    // Cancel a booking (optional)
    @Delete(':slotId/book')
    async cancelBooking(@Param('slotId') slotId: string, @Req() req) {
        const userId = req.user.sub;
        await this.appointmentsService.cancelBooking(slotId, userId);
        return { message: 'Booking cancelled successfully' };
    }
}
