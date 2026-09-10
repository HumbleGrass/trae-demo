import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OverdueFine, FineStatus } from '../../entities/overdue-fine.entity';
import { BorrowRecord } from '../../entities/borrow-record.entity';
import { CreateFineDto } from './dto/create-fine.dto';
import { FineQueryDto } from './dto/fine-query.dto';

@Injectable()
export class FinesService {
  private readonly OVERDUE_RATE = 0.5;

  constructor(
    @InjectRepository(OverdueFine)
    private fineRepository: Repository<OverdueFine>,
    @InjectRepository(BorrowRecord)
    private borrowRepository: Repository<BorrowRecord>,
  ) {}

  async create(createFineDto: CreateFineDto): Promise<OverdueFine> {
    const fine = this.fineRepository.create(createFineDto);
    return this.fineRepository.save(fine);
  }

  async calculateFine(borrowId: number): Promise<{ days: number; amount: number }> {
    const borrow = await this.borrowRepository.findOne({
      where: { id: borrowId },
    });

    if (!borrow) {
      throw new NotFoundException('借阅记录不存在');
    }

    const now = new Date();
    const dueDate = new Date(borrow.dueDate);

    if (now <= dueDate) {
      return { days: 0, amount: 0 };
    }

    const days = Math.ceil((now.getTime() - dueDate.getTime()) / (24 * 60 * 60 * 1000));
    const amount = days * this.OVERDUE_RATE;

    return { days, amount };
  }

  async generateFineForReturn(borrowId: number): Promise<OverdueFine | null> {
    const { days, amount } = await this.calculateFine(borrowId);

    if (days <= 0) {
      return null;
    }

    const fine = await this.fineRepository.findOne({
      where: { borrowRecordId: borrowId },
    });

    if (fine) {
      return fine;
    }

    const borrowRecord = await this.borrowRepository.findOne({
      where: { id: borrowId },
    });

    if (!borrowRecord) {
      return null;
    }

    return this.create({
      borrowRecordId: borrowId,
      memberId: borrowRecord.memberId,
      fineAmount: amount,
      fineDate: new Date(),
    });
  }

  async findAll(query: FineQueryDto): Promise<{ data: OverdueFine[]; total: number }> {
    const { memberId, status, page = 1, pageSize = 20 } = query;

    const queryBuilder = this.fineRepository.createQueryBuilder('fine')
      .leftJoinAndSelect('fine.borrowRecord', 'borrow')
      .leftJoinAndSelect('borrow.member', 'member');

    if (memberId) {
      queryBuilder.andWhere('borrow.memberId = :memberId', { memberId });
    }

    if (status) {
      queryBuilder.andWhere('fine.status = :status', { status });
    }

    const total = await queryBuilder.getCount();
    const data = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('fine.createdAt', 'DESC')
      .getMany();

    return { data, total };
  }

  async findByMember(memberId: number): Promise<OverdueFine[]> {
    return this.fineRepository.find({
      where: { borrowRecord: { memberId } as any },
      relations: ['borrowRecord'],
    });
  }

  async pay(id: number): Promise<OverdueFine> {
    const fine = await this.fineRepository.findOne({ where: { id } });
    if (!fine) {
      throw new NotFoundException('罚款记录不存在');
    }

    if (fine.status === FineStatus.PAID) {
      throw new BadRequestException('该罚款已缴纳');
    }

    fine.status = FineStatus.PAID;
    fine.paidDate = new Date();
    return this.fineRepository.save(fine);
  }

  async getUnpaidTotal(memberId: number): Promise<number> {
    const fines = await this.findByMember(memberId);
    return fines
      .filter(f => f.status === FineStatus.UNPAID)
      .reduce((sum, f) => sum + f.fineAmount, 0);
  }
}