import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { BorrowRecord, BorrowStatus } from '../../entities/borrow-record.entity';
import { Book } from '../../entities/book.entity';
import { Member } from '../../entities/member.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(BorrowRecord)
    private borrowRepository: Repository<BorrowRecord>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  async getBorrowStats(startDate?: string, endDate?: string): Promise<any> {
    const where: any = {};

    if (startDate && endDate) {
      where.borrowDate = Between(new Date(startDate), new Date(endDate));
    }

    const [borrows, total] = await this.borrowRepository.findAndCount({ where });

    const returned = borrows.filter(b => b.status === BorrowStatus.RETURNED).length;
    const overdue = borrows.filter(b => b.status === BorrowStatus.OVERDUE).length;
    const active = total - returned;

    return {
      total,
      returned,
      overdue,
      active,
    };
  }

  async getHotBooks(limit = 20): Promise<any[]> {
    const result = await this.borrowRepository
      .createQueryBuilder('borrow')
      .select('book.id', 'bookId')
      .addSelect('book.title', 'title')
      .addSelect('book.author', 'author')
      .addSelect('COUNT(*)', 'borrowCount')
      .leftJoin('borrow.book', 'book')
      .groupBy('book.id')
      .orderBy('borrowCount', 'DESC')
      .limit(limit)
      .getRawMany();

    return result;
  }

  async getMemberActivity(limit = 20): Promise<any[]> {
    const result = await this.borrowRepository
      .createQueryBuilder('borrow')
      .select('member.id', 'memberId')
      .addSelect('member.name', 'name')
      .addSelect('COUNT(*)', 'borrowCount')
      .leftJoin('borrow.member', 'member')
      .groupBy('member.id')
      .orderBy('borrowCount', 'DESC')
      .limit(limit)
      .getRawMany();

    return result;
  }

  async getCategoryDistribution(): Promise<any[]> {
    const result = await this.bookRepository
      .createQueryBuilder('book')
      .select('book.categoryId', 'category')
      .addSelect('COUNT(*)', 'count')
      .groupBy('book.categoryId')
      .orderBy('count', 'DESC')
      .getRawMany();

    return result;
  }
}