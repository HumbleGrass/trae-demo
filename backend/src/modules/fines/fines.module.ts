import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinesController } from './fines.controller';
import { FinesService } from './fines.service';
import { OverdueFine } from '../../entities/overdue-fine.entity';
import { BorrowRecord } from '../../entities/borrow-record.entity';
import { MembersModule } from '../members/members.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OverdueFine, BorrowRecord]),
    MembersModule,
  ],
  controllers: [FinesController],
  providers: [FinesService],
  exports: [FinesService],
})
export class FinesModule {}