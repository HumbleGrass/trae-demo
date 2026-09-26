import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BorrowController } from './borrow.controller';
import { BorrowService } from './borrow.service';
import { BorrowRecord } from '../../entities/borrow-record.entity';
import { Book } from '../../entities/book.entity';
import { Member } from '../../entities/member.entity';
import { BooksModule } from '../books/books.module';
import { MembersModule } from '../members/members.module';
import { FinesModule } from '../fines/fines.module';
import { ReservationsModule } from '../reservations/reservations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BorrowRecord, Book, Member]),
    BooksModule,
    MembersModule,
    FinesModule,
    ReservationsModule,
  ],
  controllers: [BorrowController],
  providers: [BorrowService],
  exports: [BorrowService],
})
export class BorrowModule {}
