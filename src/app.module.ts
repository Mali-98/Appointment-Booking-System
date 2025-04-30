import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { Slot } from './appointments/entities/appointmentSlot.entity';
import { Booking } from './appointments/entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'appointment_system_user', // (environment variable recommended)
    password: 'appointment_system_pass',
    database: 'appointment_system_db',
    entities: [User, Slot, Booking],
    synchronize: true,
  }), UserModule, AuthModule, AppointmentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
