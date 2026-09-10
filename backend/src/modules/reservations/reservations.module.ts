import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { Reservation } from '../../entities/reservation.entity';
import { Book } from '../../entities/book.entity';
import { Member } from '../../entities/member.entity';
import { BooksModule } from '../books/books.module';
import { MembersModule } from '../members/members.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, Book, Member]),
    BooksModule,
    MembersModule,
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}