import { IsNotEmpty, IsDateString, IsInt, Min } from 'class-validator';

export class CreateAppointmentDto {
    @IsNotEmpty()
    @IsDateString()
    dateTime: string; // ISO 8601 datetime string or timestamp

    @IsInt()
    @Min(1)
    duration: number; // minutes
}
