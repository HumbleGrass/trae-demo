import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { BorrowRecord, BorrowStatus } from '../../entities/borrow-record.entity';
import { Book } from '../../entities/book.entity';
import { Member } from '../../entities/member.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(BorrowRecord)
    private borrowRepository: Repository<BorrowRecord>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  async getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayBorrow = await this.borrowRepository.count({
      where: {
        borrowDate: Between(today, tomorrow),
      },
    });

    const todayReturn = await this.borrowRepository.count({
      where: {
        actualReturnDate: Between(today, tomorrow),
      },
    });

    const overdueCount = await this.borrowRepository.count({
      where: {
        status: BorrowStatus.OVERDUE,
      },
    });

    const totalBooks = await this.bookRepository.count();
    const totalMembers = await this.memberRepository.count();
    const activeBorrows = await this.borrowRepository.count({
      where: {
        status: BorrowStatus.BORROWED,
      },
    });

    return {
      todayBorrow,
      todayReturn,
      overdueCount,
      totalBooks,
      totalMembers,
      activeBorrows,
    };
  }
}
