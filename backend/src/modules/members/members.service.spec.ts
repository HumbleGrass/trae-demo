import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MembersService } from './members.service';
import { Member } from '../../entities/member.entity';
import { User, UserRole } from '../../entities/user.entity';
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('MembersService', () => {
  let service: MembersService;
  let memberRepository: Repository<Member>;
  let userRepository: Repository<User>;

  const mockUser: Partial<User> = {
    id: 1,
    username: 'testuser',
    password: 'hashedPassword',
    role: UserRole.USER,
    isActive: true,
  };

  const mockMember: Partial<Member> = {
    id: 1,
    userId: 1,
    name: '张三',
    phone: '13800138000',
    idCard: '110101199001011234',
    email: 'zhangsan@example.com',
    gender: '男',
    borrowLimit: 5,
    user: mockUser as User,
  };

  const mockMemberRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getCount: jest.fn().mockResolvedValue(1),
      getMany: jest.fn().mockResolvedValue([mockMember]),
    })),
  };

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        {
          provide: getRepositoryToken(Member),
          useValue: mockMemberRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<MembersService>(MembersService);
    memberRepository = module.get<Repository<Member>>(getRepositoryToken(Member));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('应该返回会员列表', async () => {
      const result = await service.findAll({});
      expect(result).toEqual({ data: [mockMember], total: 1 });
      expect(mockMemberRepository.createQueryBuilder).toHaveBeenCalledWith('member');
    });

    it('应该按关键词搜索会员', async () => {
      const query = { keyword: '张三' };
      await service.findAll(query);
      expect(mockMemberRepository.createQueryBuilder().andWhere).toHaveBeenCalled();
    });

    it('应该支持分页', async () => {
      const query = { page: 1, pageSize: 10 };
      await service.findAll(query);
      expect(mockMemberRepository.createQueryBuilder().skip).toHaveBeenCalledWith(0);
      expect(mockMemberRepository.createQueryBuilder().take).toHaveBeenCalledWith(10);
    });
  });

  describe('findOne', () => {
    it('应该返回会员详情', async () => {
      mockMemberRepository.findOne.mockResolvedValue(mockMember);
      const result = await service.findOne(1);
      expect(result).toEqual(mockMember);
      expect(mockMemberRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['user'],
      });
    });

    it('应该抛出NotFoundException当会员不存在', async () => {
      mockMemberRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createDto = {
      username: 'newuser',
      password: 'password123',
      name: '李四',
      phone: '13900139000',
      idCard: '110101199002022345',
      email: 'lisi@example.com',
      gender: '女',
    };

    it('应该成功创建会员', async () => {
      mockMemberRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue({ ...mockUser, id: 2 });
      mockUserRepository.save.mockResolvedValue({ ...mockUser, id: 2 });
      mockMemberRepository.create.mockReturnValue({ ...mockMember, id: 2, ...createDto });
      mockMemberRepository.save.mockResolvedValue({ ...mockMember, id: 2, ...createDto });

      const result = await service.create(createDto);
      expect(result.id).toBe(2);
      expect(bcrypt.hash).toHaveBeenCalledWith(createDto.password, 10);
    });

    it('应该抛出ConflictException当手机号已存在', async () => {
      mockMemberRepository.findOne.mockResolvedValue(mockMember);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
      await expect(service.create(createDto)).rejects.toThrow('手机号已存在');
    });

    it('应该抛出ConflictException当身份证号已存在', async () => {
      mockMemberRepository.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockMember);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
      await expect(service.create(createDto)).rejects.toThrow('身份证号已存在');
    });
  });

  describe('update', () => {
    it('应该成功更新会员', async () => {
      const updateDto = { name: '王五' };
      mockMemberRepository.findOne.mockResolvedValue(mockMember);
      mockMemberRepository.save.mockResolvedValue({ ...mockMember, ...updateDto });

      const result = await service.update(1, updateDto);
      expect(result.name).toBe('王五');
    });

    it('应该抛出ConflictException当更新的手机号已存在', async () => {
      const updateDto = { phone: '13900139000' };
      mockMemberRepository.findOne
        .mockResolvedValueOnce(mockMember)
        .mockResolvedValueOnce({ ...mockMember, id: 2 });

      await expect(service.update(1, updateDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('应该成功删除会员', async () => {
      const memberWithRelations = {
        ...mockMember,
        borrowRecords: [],
        reservations: [],
      };
      mockMemberRepository.findOne.mockResolvedValue(memberWithRelations);
      mockUserRepository.delete.mockResolvedValue({ affected: 1 });
      mockMemberRepository.remove.mockResolvedValue(mockMember);

      await service.remove(1);
      expect(mockUserRepository.delete).toHaveBeenCalledWith(mockMember.userId);
      expect(mockMemberRepository.remove).toHaveBeenCalled();
    });

    it('应该抛出BadRequestException当有未还书时', async () => {
      const memberWithActiveBorrow = {
        ...mockMember,
        borrowRecords: [{ id: 1, actualReturnDate: null }],
        reservations: [],
      };
      mockMemberRepository.findOne.mockResolvedValue(memberWithActiveBorrow);

      await expect(service.remove(1)).rejects.toThrow(BadRequestException);
      await expect(service.remove(1)).rejects.toThrow('该会员有未归还的书籍，无法删除');
    });

    it('应该抛出BadRequestException当有未完成的预约时', async () => {
      const memberWithReservation = {
        ...mockMember,
        borrowRecords: [],
        reservations: [{ id: 1, status: 'pending' }],
      };
      mockMemberRepository.findOne.mockResolvedValue(memberWithReservation);

      await expect(service.remove(1)).rejects.toThrow(BadRequestException);
      await expect(service.remove(1)).rejects.toThrow('该会员有未完成的预约，无法删除');
    });
  });

  describe('updateBorrowLimit', () => {
    it('应该成功更新借阅上限', async () => {
      mockMemberRepository.findOne.mockResolvedValue(mockMember);
      mockMemberRepository.save.mockResolvedValue({ ...mockMember, borrowLimit: 10 });

      const result = await service.updateBorrowLimit(1, 10);
      expect(result.borrowLimit).toBe(10);
    });
  });

  describe('getCurrentBorrowCount', () => {
    it('应该返回当前借阅数量', async () => {
      const memberWithBorrows = {
        ...mockMember,
        borrowRecords: [
          { id: 1, actualReturnDate: null },
          { id: 2, actualReturnDate: new Date() },
        ],
      };
      mockMemberRepository.findOne
        .mockResolvedValueOnce(mockMember)
        .mockResolvedValueOnce(memberWithBorrows);

      const result = await service.getCurrentBorrowCount(1);
      expect(result).toBe(1);
    });
  });
});