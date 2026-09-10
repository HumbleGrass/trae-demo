import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { BorrowRecord } from '../../entities/borrow-record.entity';
import { Book } from '../../entities/book.entity';
import { Member } from '../../entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BorrowRecord, Book, Member])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}