import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Member } from '../../entities/member.entity';
import { User, UserRole } from '../../entities/user.entity';
import { BorrowStatus } from '../../entities/borrow-record.entity';
import * as bcrypt from 'bcrypt';
import { CreateMemberDto, CreateMemberWithUserDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MemberQueryDto } from './dto/member-query.dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async create(createMemberDto: CreateMemberWithUserDto): Promise<Member> {
    const existingPhone = await this.memberRepository.findOne({
      where: { phone: createMemberDto.phone },
    });
    if (existingPhone) {
      throw new ConflictException('手机号已存在');
    }

    const existingIdCard = await this.memberRepository.findOne({
      where: { idCard: createMemberDto.idCard },
    });
    if (existingIdCard) {
      throw new ConflictException('身份证号已存在');
    }

    const hashedPassword = await bcrypt.hash(createMemberDto.password, 10);

    return this.dataSource.transaction(async (manager) => {
      const user = manager.create(User, {
        username: createMemberDto.username,
        password: hashedPassword,
        role: UserRole.USER,
      });
      await manager.save(user);

      const member = manager.create(Member, {
        userId: user.id,
        name: createMemberDto.name,
        phone: createMemberDto.phone,
        idCard: createMemberDto.idCard,
        email: createMemberDto.email,
        gender: createMemberDto.gender,
        birthDate: createMemberDto.birthDate,
        borrowLimit: createMemberDto.borrowLimit || 5,
      });

      return manager.save(member);
    });
  }

  async findAll(query: MemberQueryDto): Promise<{ data: Member[]; total: number }> {
    const { keyword, page = 1, pageSize = 20 } = query;

    const queryBuilder = this.memberRepository.createQueryBuilder('member')
      .leftJoinAndSelect('member.user', 'user');

    if (keyword) {
      queryBuilder.andWhere(
        '(member.name LIKE :keyword OR member.phone LIKE :keyword OR member.idCard LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    const total = await queryBuilder.getCount();
    const data = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('member.createdAt', 'DESC')
      .getMany();

    return { data, total };
  }

  async findOne(id: number): Promise<Member> {
    const member = await this.memberRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!member) {
      throw new NotFoundException('会员不存在');
    }
    return member;
  }

  async findByUserId(userId: number): Promise<Member> {
    const member = await this.memberRepository.findOne({
      where: { userId },
      relations: ['borrowRecords', 'reservations'],
    });
    if (!member) {
      throw new NotFoundException('会员不存在');
    }
    return member;
  }

  async update(id: number, updateMemberDto: UpdateMemberDto): Promise<Member> {
    const member = await this.findOne(id);

    if (updateMemberDto.phone && updateMemberDto.phone !== member.phone) {
      const existing = await this.memberRepository.findOne({
        where: { phone: updateMemberDto.phone },
      });
      if (existing) {
        throw new ConflictException('手机号已存在');
      }
    }

    if (updateMemberDto.idCard && updateMemberDto.idCard !== member.idCard) {
      const existing = await this.memberRepository.findOne({
        where: { idCard: updateMemberDto.idCard },
      });
      if (existing) {
        throw new ConflictException('身份证号已存在');
      }
    }

    Object.assign(member, updateMemberDto);
    return this.memberRepository.save(member);
  }

  async remove(id: number): Promise<void> {
    const member = await this.memberRepository.findOne({
      where: { id },
      relations: ['borrowRecords', 'reservations'],
    });
    if (!member) {
      throw new NotFoundException('会员不存在');
    }

    const hasActiveBorrow = member.borrowRecords?.some(r => r.status === BorrowStatus.BORROWED);
    if (hasActiveBorrow) {
      throw new BadRequestException('该会员有未归还的书籍，无法删除');
    }

    const hasActiveReservation = member.reservations?.some(r => !r.status || r.status !== 'cancelled');
    if (hasActiveReservation) {
      throw new BadRequestException('该会员有未完成的预约，无法删除');
    }

    await this.dataSource.transaction(async (manager) => {
      await manager.remove(Member, member);
      await manager.delete(User, member.userId);
    });
  }

  async updateBorrowLimit(id: number, limit: number): Promise<Member> {
    const member = await this.findOne(id);
    member.borrowLimit = limit;
    return this.memberRepository.save(member);
  }

  async getCurrentBorrowCount(id: number): Promise<number> {
    const member = await this.memberRepository.findOne({
      where: { id },
      relations: ['borrowRecords'],
    });
    return member?.borrowRecords?.filter(r => r.status === BorrowStatus.BORROWED).length || 0;
  }
}