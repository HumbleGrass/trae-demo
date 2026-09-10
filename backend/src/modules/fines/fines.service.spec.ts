import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinesService } from './fines.service';
import { OverdueFine, FineStatus } from '../../entities/overdue-fine.entity';
import { BorrowRecord } from '../../entities/borrow-record.entity';
import { NotFoundException } from '@nestjs/common';

describe('FinesService', () => {
  let service: FinesService;
  let fineRepository: Repository<OverdueFine>;
  let borrowRepository: Repository<BorrowRecord>;

  const mockBorrowRecord: Partial<BorrowRecord> = {
    id: 1,
    memberId: 1,
    bookId: 1,
    borrowDate: new Date(),
    dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: 'returned',
  };

  const mockFine: Partial<OverdueFine> = {
    id: 1,
    memberId: 1,
    borrowRecordId: 1,
    overdueDays: 7,
    fineAmount: 3.5,
    status: FineStatus.UNPAID,
  };

  const mockFineRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getCount: jest.fn().mockResolvedValue(1),
      getMany: jest.fn().mockResolvedValue([mockFine]),
    })),
  };

  const mockBorrowRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinesService,
        {
          provide: getRepositoryToken(OverdueFine),
          useValue: mockFineRepository,
        },
        {
          provide: getRepositoryToken(BorrowRecord),
          useValue: mockBorrowRepository,
        },
      ],
    }).compile();

    service = module.get<FinesService>(FinesService);
    fineRepository = module.get<Repository<OverdueFine>>(getRepositoryToken(OverdueFine));
    borrowRepository = module.get<Repository<BorrowRecord>>(getRepositoryToken(BorrowRecord));

    jest.clearAllMocks();
  });

  describe('calculateFine', () => {
    it('应该返回逾期天数和罚款金额', async () => {
      mockBorrowRepository.findOne.mockResolvedValue(mockBorrowRecord);

      const result = await service.calculateFine(1);
      expect(result.days).toBeGreaterThan(0);
      expect(result.amount).toBeGreaterThan(0);
    });

    it('应该返回0当未逾期', async () => {
      const notOverdueRecord = {
        ...mockBorrowRecord,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };
      mockBorrowRepository.findOne.mockResolvedValue(notOverdueRecord);

      const result = await service.calculateFine(1);
      expect(result.days).toBe(0);
      expect(result.amount).toBe(0);
    });

    it('应该抛出NotFoundException当借阅记录不存在', async () => {
      mockBorrowRepository.findOne.mockResolvedValue(null);

      await expect(service.calculateFine(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('generateFineForReturn', () => {
    it('应该为逾期还书生成罚款记录', async () => {
      mockBorrowRepository.findOne.mockResolvedValue(mockBorrowRecord);
      mockFineRepository.findOne.mockResolvedValue(null);
      mockFineRepository.create.mockReturnValue(mockFine);
      mockFineRepository.save.mockResolvedValue(mockFine);

      const result = await service.generateFineForReturn(1);
      expect(result).toEqual(mockFine);
      expect(mockFineRepository.create).toHaveBeenCalledWith({
        borrowRecordId: 1,
        overdueDays: expect.any(Number),
        fineAmount: expect.any(Number),
        status: FineStatus.UNPAID,
      });
    });

    it('应该返回null当未逾期', async () => {
      const notOverdueRecord = {
        ...mockBorrowRecord,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };
      mockBorrowRepository.findOne.mockResolvedValue(notOverdueRecord);

      const result = await service.generateFineForReturn(1);
      expect(result).toBeNull();
    });

    it('应该返回已存在的罚款记录', async () => {
      mockBorrowRepository.findOne.mockResolvedValue(mockBorrowRecord);
      mockFineRepository.findOne.mockResolvedValue(mockFine);

      const result = await service.generateFineForReturn(1);
      expect(result).toEqual(mockFine);
      expect(mockFineRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('应该返回罚款列表', async () => {
      const result = await service.findAll({});
      expect(result).toEqual({ data: [mockFine], total: 1 });
    });

    it('应该按会员ID筛选', async () => {
      await service.findAll({ memberId: 1 });
      expect(mockFineRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith(
        'borrow.memberId = :memberId',
        { memberId: 1 },
      );
    });

    it('应该按状态筛选', async () => {
      await service.findAll({ status: FineStatus.UNPAID });
      expect(mockFineRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith(
        'fine.status = :status',
        { status: FineStatus.UNPAID },
      );
    });

    it('应该支持分页', async () => {
      await service.findAll({ page: 2, pageSize: 10 });
      expect(mockFineRepository.createQueryBuilder().skip).toHaveBeenCalledWith(10);
      expect(mockFineRepository.createQueryBuilder().take).toHaveBeenCalledWith(10);
    });
  });

  describe('findByMember', () => {
    it('应该返回会员的罚款列表', async () => {
      mockFineRepository.find.mockResolvedValue([mockFine]);
      const result = await service.findByMember(1);
      expect(result).toEqual([mockFine]);
      expect(mockFineRepository.find).toHaveBeenCalled();
    });
  });

  describe('pay', () => {
    it('应该成功支付罚款', async () => {
      const unpaidFine = { ...mockFine, status: FineStatus.UNPAID };
      mockFineRepository.findOne.mockResolvedValue(unpaidFine);
      mockFineRepository.save.mockResolvedValue({
        ...unpaidFine,
        status: FineStatus.PAID,
        paidDate: expect.any(Date),
      });

      const result = await service.pay(1);
      expect(result.status).toBe(FineStatus.PAID);
      expect(mockFineRepository.save).toHaveBeenCalled();
    });

    it('应该抛出NotFoundException当罚款记录不存在', async () => {
      mockFineRepository.findOne.mockResolvedValue(null);

      await expect(service.pay(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUnpaidTotal', () => {
    it('应该返回未支付罚款总额', async () => {
      const fines = [
        { ...mockFine, fineAmount: 10, status: FineStatus.UNPAID },
        { ...mockFine, fineAmount: 20, status: FineStatus.PAID },
        { ...mockFine, fineAmount: 30, status: FineStatus.UNPAID },
      ];
      mockFineRepository.find.mockResolvedValue(fines);

      const result = await service.getUnpaidTotal(1);
      expect(result).toBe(40);
    });

    it('应该返回0当没有未支付罚款', async () => {
      const paidFines = [
        { ...mockFine, fineAmount: 10, status: FineStatus.PAID },
        { ...mockFine, fineAmount: 20, status: FineStatus.PAID },
      ];
      mockFineRepository.find.mockResolvedValue(paidFines);

      const result = await service.getUnpaidTotal(1);
      expect(result).toBe(0);
    });
  });

  describe('create', () => {
    it('应该成功创建罚款记录', async () => {
      const createFineDto = {
        borrowRecordId: 1,
        overdueDays: 5,
        fineAmount: 2.5,
      };
      mockFineRepository.create.mockReturnValue({ ...mockFine, ...createFineDto });
      mockFineRepository.save.mockResolvedValue({ ...mockFine, ...createFineDto });

      const result = await service.create(createFineDto);
      expect(mockFineRepository.create).toHaveBeenCalledWith(createFineDto);
      expect(mockFineRepository.save).toHaveBeenCalled();
    });
  });
});