import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { BorrowRecord, BorrowStatus } from '../../entities/borrow-record.entity';
import { Book } from '../../entities/book.entity';
import { Member } from '../../entities/member.entity';
import { BooksService } from '../books/books.service';
import { MembersService } from '../members/members.service';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { BorrowQueryDto } from './dto/borrow-query.dto';

@Injectable()
export class BorrowService {
  private readonly BORROW_DAYS = 14;
  private readonly RENEW_DAYS = 7;
  private readonly OVERDUE_RATE = 0.5;

  constructor(
    @InjectRepository(BorrowRecord)
    private borrowRepository: Repository<BorrowRecord>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    private booksService: BooksService,
    private membersService: MembersService,
    private dataSource: DataSource,
  ) {}

  async create(memberId: number, createBorrowDto: CreateBorrowDto): Promise<BorrowRecord> {
    return this.dataSource.transaction(async (manager) => {
      const book = await manager.findOne(Book, {
        where: { id: createBorrowDto.bookId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!book || book.availableQuantity <= 0) {
        throw new BadRequestException('该书籍库存不足');
      }

      const targetMemberId = createBorrowDto.memberId || memberId;
      const member = await manager.findOne(Member, { where: { id: targetMemberId } });

      if (!member) {
        throw new NotFoundException('会员不存在');
      }

      const currentBorrowCount = await manager.count(BorrowRecord, {
        where: { memberId: targetMemberId, status: BorrowStatus.BORROWED },
      });

      if (currentBorrowCount >= member.borrowLimit) {
        throw new BadRequestException(`已达借阅上限（${member.borrowLimit}本）`);
      }

      // 原子性更新库存
      await manager.increment(Book, { id: book.id }, 'availableQuantity', -1);

      const borrowRecord = manager.create(BorrowRecord, {
        memberId: targetMemberId,
        bookId: book.id,
        borrowDate: new Date(),
        dueDate: new Date(Date.now() + this.BORROW_DAYS * 24 * 60 * 60 * 1000),
        status: BorrowStatus.BORROWED,
      });

      return manager.save(borrowRecord);
    });
  }

  async returnBook(memberId: number, borrowId: number): Promise<BorrowRecord> {
    return this.dataSource.transaction(async (manager) => {
      const borrowRecord = await manager.findOne(BorrowRecord, {
        where: { id: borrowId, memberId },
        relations: ['member'],
      });

      if (!borrowRecord) {
        throw new NotFoundException('借阅记录不存在');
      }

      if (borrowRecord.status === BorrowStatus.RETURNED) {
        throw new BadRequestException('该书籍已归还');
      }

      borrowRecord.actualReturnDate = new Date();
      borrowRecord.status = BorrowStatus.RETURNED;

      // 原子性更新库存
      await manager.increment(Book, { id: borrowRecord.bookId }, 'availableQuantity', 1);

      return manager.save(borrowRecord);
    });
  }

  async renew(memberId: number, borrowId: number): Promise<BorrowRecord> {
    const borrowRecord = await this.borrowRepository.findOne({
      where: { id: borrowId, memberId },
    });

    if (!borrowRecord) {
      throw new NotFoundException('借阅记录不存在');
    }

    if (borrowRecord.status === BorrowStatus.RETURNED) {
      throw new BadRequestException('该书籍已归还，无法续借');
    }

    if ((borrowRecord.renewCount || 0) >= 1) {
      throw new BadRequestException('续借次数已达上限（1次）');
    }

    const newDueDate = new Date(borrowRecord.dueDate);
    newDueDate.setDate(newDueDate.getDate() + this.RENEW_DAYS);
    borrowRecord.dueDate = newDueDate;
    borrowRecord.renewCount = (borrowRecord.renewCount || 0) + 1;

    return this.borrowRepository.save(borrowRecord);
  }

  async findAll(query: BorrowQueryDto): Promise<{ data: BorrowRecord[]; total: number }> {
    const { memberId, bookId, status, page = 1, pageSize = 20 } = query;

    const queryBuilder = this.borrowRepository.createQueryBuilder('borrow')
      .leftJoinAndSelect('borrow.member', 'member')
      .leftJoinAndSelect('borrow.book', 'book');

    if (memberId) {
      queryBuilder.andWhere('borrow.memberId = :memberId', { memberId });
    }

    if (bookId) {
      queryBuilder.andWhere('borrow.bookId = :bookId', { bookId });
    }

    if (status) {
      queryBuilder.andWhere('borrow.status = :status', { status });
    }

    const total = await queryBuilder.getCount();
    const data = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('borrow.borrowDate', 'DESC')
      .getMany();

    return { data, total };
  }

  async findByMember(memberId: number, includeReturned = false): Promise<BorrowRecord[]> {
    const queryBuilder = this.borrowRepository.createQueryBuilder('borrow')
      .leftJoinAndSelect('borrow.book', 'book')
      .where('borrow.memberId = :memberId', { memberId });

    if (!includeReturned) {
      queryBuilder.andWhere('borrow.status != :status', { status: BorrowStatus.RETURNED });
    }

    return queryBuilder.orderBy('borrow.borrowDate', 'DESC').getMany();
  }

  async getCurrentBorrowCount(memberId: number): Promise<number> {
    return this.borrowRepository.count({
      where: { memberId, status: BorrowStatus.BORROWED },
    });
  }

  async calculateOverdue(borrowId: number): Promise<{ days: number; fine: number }> {
    const borrow = await this.borrowRepository.findOne({
      where: { id: borrowId },
    });

    if (!borrow) {
      throw new NotFoundException('借阅记录不存在');
    }

    const now = new Date();
    const dueDate = new Date(borrow.dueDate);

    if (now <= dueDate) {
      return { days: 0, fine: 0 };
    }

    const days = Math.ceil((now.getTime() - dueDate.getTime()) / (24 * 60 * 60 * 1000));
    const fine = days * this.OVERDUE_RATE;

    return { days, fine };
  }

  /** 更新逾期状态：将超期未还的记录标记为 OVERDUE */
  async updateOverdueStatus(): Promise<number> {
    const result = await this.borrowRepository
      .createQueryBuilder()
      .update(BorrowRecord)
      .set({ status: BorrowStatus.OVERDUE })
      .where('status = :status', { status: BorrowStatus.BORROWED })
      .andWhere('dueDate < :now', { now: new Date() })
      .execute();

    return result.affected || 0;
  }
}
