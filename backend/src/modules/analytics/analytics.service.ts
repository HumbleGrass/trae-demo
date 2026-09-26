import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BorrowRecord } from '../../entities/borrow-record.entity';
import { Book } from '../../entities/book.entity';
import { Member } from '../../entities/member.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(BorrowRecord)
    private borrowRepository: Repository<BorrowRecord>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  async getRecommendations(memberId?: number, limit = 10): Promise<Book[]> {
    const hotBookIds = await this.borrowRepository
      .createQueryBuilder('borrow')
      .select('book.id', 'bookId')
      .addSelect('COUNT(*)', 'borrowCount')
      .leftJoin('borrow.book', 'book')
      .groupBy('book.id')
      .orderBy('borrowCount', 'DESC')
      .limit(limit * 2)
      .getRawMany();

    const bookIds = hotBookIds.map(h => h.bookId);

    if (bookIds.length === 0) {
      return [];
    }

    return this.bookRepository
      .createQueryBuilder('book')
      .where('book.id IN (:...bookIds)', { bookIds })
      .andWhere('book.availableQuantity > 0')
      .limit(limit)
      .getMany();
  }

  /**
   * 获取借阅趋势（按月或按周聚合）
   * @param months - 统计最近几个月的数据，默认 6 个月
   * @param groupBy - 聚合维度，month（月，默认）或 week（周）
   * @returns 按时间聚合后的借阅次数列表
   */
  async getBorrowTrend(months = 6, groupBy: 'month' | 'week' = 'month'): Promise<any[]> {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    // 周维度按「年-周」聚合（ISO 周），月维度按「年-月」聚合
    const dateFormat = groupBy === 'week' ? '%Y-%u' : '%Y-%m';
    const label = groupBy === 'week' ? 'week' : 'month';

    const result = await this.borrowRepository
      .createQueryBuilder('borrow')
      .select(`DATE_FORMAT(borrow.borrowDate, "${dateFormat}")`, label)
      .addSelect('COUNT(*)', 'count')
      .where('borrow.borrowDate >= :startDate', { startDate })
      .groupBy(label)
      .orderBy(label, 'ASC')
      .getRawMany();

    return result;
  }

  async getReaderDemographics(): Promise<any> {
    const members = await this.memberRepository.find();

    const ageGroups = {
      '0-17': 0,
      '18-25': 0,
      '26-35': 0,
      '36-50': 0,
      '51+': 0,
    };

    const genderCount = {
      male: 0,
      female: 0,
      other: 0,
    };

    members.forEach(member => {
      if (member.birthDate) {
        const age = new Date().getFullYear() - new Date(member.birthDate).getFullYear();
        if (age < 18) ageGroups['0-17']++;
        else if (age <= 25) ageGroups['18-25']++;
        else if (age <= 35) ageGroups['26-35']++;
        else if (age <= 50) ageGroups['36-50']++;
        else ageGroups['51+']++;
      }

      if (member.gender === '男') genderCount.male++;
      else if (member.gender === '女') genderCount.female++;
      else genderCount.other++;
    });

    return { ageGroups, genderCount, total: members.length };
  }

  async getBookRankings(): Promise<any> {
    const borrowRanking = await this.borrowRepository
      .createQueryBuilder('borrow')
      .select('book.id', 'bookId')
      .addSelect('book.title', 'title')
      .addSelect('book.author', 'author')
      .addSelect('COUNT(*)', 'borrowCount')
      .leftJoin('borrow.book', 'book')
      .groupBy('book.id')
      .orderBy('borrowCount', 'DESC')
      .limit(20)
      .getRawMany();

    const newBooks = await this.bookRepository
      .createQueryBuilder('book')
      .orderBy('book.createdAt', 'DESC')
      .limit(20)
      .getMany();

    return {
      borrowRanking,
      newBooks,
    };
  }

  async getMemberGrowth(months = 6): Promise<any[]> {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const result = await this.memberRepository
      .createQueryBuilder('member')
      .select('DATE_FORMAT(member.createdAt, "%Y-%m")', 'month')
      .addSelect('COUNT(*)', 'count')
      .where('member.createdAt >= :startDate', { startDate })
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    return result;
  }
}