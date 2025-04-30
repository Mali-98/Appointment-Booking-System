// src/appointments/dto/create-slot.dto.ts
import { IsNotEmpty, IsDateString, IsString, IsInt, Min } from 'class-validator';

export class CreateAppointmentDto {
    @IsDateString()
    date: string;

    @IsString()
    time: string;

    @IsInt()
    @Min(1)
    duration: number;
}
