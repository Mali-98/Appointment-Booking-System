// src/users/dto/create-user.dto.ts
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @MinLength(6)
    password: string;

    @IsEnum(UserRole)
    role: UserRole;
}
