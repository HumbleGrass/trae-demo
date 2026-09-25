import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { BorrowService } from './borrow.service';
import { BorrowRecord, BorrowStatus } from '../../entities/borrow-record.entity';
import { Book } from '../../entities/book.entity';
import { Member } from '../../entities/member.entity';
import { BooksService } from '../books/books.service';
import { MembersService } from '../members/members.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BorrowService', () => {
  let service: BorrowService;
  let borrowRepository: Repository<BorrowRecord>;
  let booksService: BooksService;
  let membersService: MembersService;

  const mockBook: Partial<Book> = {
    id: 1,
    title: '测试书籍',
    author: '测试作者',
    isbn: '1234567890',
    availableQuantity: 5,
    quantity: 10,
  };

  const mockMember: Partial<Member> = {
    id: 1,
    name: '张三',
    phone: '13800138000',
    borrowLimit: 5,
  };

  const mockBorrowRecord: Partial<BorrowRecord> = {
    id: 1,
    memberId: 1,
    bookId: 1,
    borrowDate: new Date(),
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    status: BorrowStatus.BORROWED,
    renewCount: 0,
  };

  // 所有用例共享同一个 queryBuilder 实例，避免断言命不中每次新建的对象
  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getCount: jest.fn().mockResolvedValue(1),
    getMany: jest.fn().mockResolvedValue([mockBorrowRecord]),
  };

  const mockBorrowRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  const mockBooksService = {
    findOne: jest.fn(),
    updateStock: jest.fn(),
  };

  const mockMembersService = {
    findOne: jest.fn(),
    getCurrentBorrowCount: jest.fn(),
  };

  // BorrowService.create/returnBook 走 dataSource.transaction，mock 出事务管理器
  const mockDataSource = {
    transaction: jest.fn(async (work) => work({
      findOne: jest.fn(async (entity: any) => {
        if (entity === Book) return { ...mockBook };
        if (entity === Member) return { ...mockMember };
        return null;
      }),
      count: jest.fn(async () => 0),
      increment: jest.fn(async () => undefined),
      create: jest.fn((_entity: any, data: any) => ({ renewCount: 0, ...data })),
      save: jest.fn(async (record: any) => record),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BorrowService,
        {
          provide: getRepositoryToken(BorrowRecord),
          useValue: mockBorrowRepository,
        },
        {
          provide: getRepositoryToken(Book),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Member),
          useValue: {},
        },
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
        {
          provide: MembersService,
          useValue: mockMembersService,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<BorrowService>(BorrowService);
    borrowRepository = module.get<Repository<BorrowRecord>>(getRepositoryToken(BorrowRecord));
    booksService = module.get<BooksService>(BooksService);
    membersService = module.get<MembersService>(MembersService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    const createBorrowDto = { bookId: 1 };

    it('应该成功借书', async () => {
      // 事务管理器返回借阅记录，mockDataSource 内部 findOne 返回 mockBook / mockMember
      const result = await service.create(1, createBorrowDto);
      expect(result).toEqual({
        memberId: 1,
        bookId: 1,
        renewCount: 0,
        borrowDate: expect.any(Date),
        dueDate: expect.any(Date),
        status: BorrowStatus.BORROWED,
      });
      expect(mockDataSource.transaction).toHaveBeenCalled();
    });

    it('应该抛出BadRequestException当库存不足', async () => {
      mockBook.availableQuantity = 0;

      await expect(service.create(1, createBorrowDto)).rejects.toThrow(BadRequestException);
      await expect(service.create(1, createBorrowDto)).rejects.toThrow('该书籍库存不足');
      mockBook.availableQuantity = 5;
    });

    it('应该抛出BadRequestException当超借阅上限', async () => {
      mockBook.availableQuantity = 5;
      mockDataSource.transaction.mockImplementation(async (work) => work({
        findOne: jest.fn(async (entity: any) => {
          if (entity === Book) return { ...mockBook };
          if (entity === Member) return { ...mockMember };
          return null;
        }),
        count: jest.fn(async () => 5),
        increment: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
      }));

      await expect(service.create(1, createBorrowDto)).rejects.toThrow(BadRequestException);
      await expect(service.create(1, createBorrowDto)).rejects.toThrow('已达借阅上限（5本）');
    });
  });

  describe('returnBook', () => {
    it('应该成功还书', async () => {
      const borrowedRecord = { ...mockBorrowRecord, status: BorrowStatus.BORROWED };
      mockDataSource.transaction.mockImplementation(async (work) => work({
        findOne: jest.fn(async () => borrowedRecord),
        increment: jest.fn(),
        save: jest.fn(async (record: any) => record),
      }));

      const result = await service.returnBook(1, 1);
      expect(result.status).toBe(BorrowStatus.RETURNED);
      expect(mockDataSource.transaction).toHaveBeenCalled();
    });

    it('应该抛出NotFoundException当借阅记录不存在', async () => {
      mockDataSource.transaction.mockImplementation(async (work) => work({
        findOne: jest.fn(async () => null),
        increment: jest.fn(),
        save: jest.fn(),
      }));

      await expect(service.returnBook(1, 999)).rejects.toThrow(NotFoundException);
    });

    it('应该抛出BadRequestException当书籍已归还', async () => {
      const returnedRecord = { ...mockBorrowRecord, status: BorrowStatus.RETURNED };
      mockDataSource.transaction.mockImplementation(async (work) => work({
        findOne: jest.fn(async () => returnedRecord),
        increment: jest.fn(),
        save: jest.fn(),
      }));

      await expect(service.returnBook(1, 1)).rejects.toThrow(BadRequestException);
      await expect(service.returnBook(1, 1)).rejects.toThrow('该书籍已归还');
    });
  });

  describe('renew', () => {
    it('应该成功续借', async () => {
      const borrowedRecord = {
        ...mockBorrowRecord,
        status: BorrowStatus.BORROWED,
        renewCount: 0,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      };
      mockBorrowRepository.findOne.mockResolvedValue(borrowedRecord);
      mockBorrowRepository.save.mockResolvedValue({
        ...borrowedRecord,
        renewCount: 1,
        dueDate: expect.any(Date),
      });

      const result = await service.renew(1, 1);
      expect(result.renewCount).toBe(1);
    });

    it('应该抛出BadRequestException当书籍已归还', async () => {
      const returnedRecord = { ...mockBorrowRecord, status: BorrowStatus.RETURNED };
      mockBorrowRepository.findOne.mockResolvedValue(returnedRecord);

      await expect(service.renew(1, 1)).rejects.toThrow(BadRequestException);
      await expect(service.renew(1, 1)).rejects.toThrow('该书籍已归还，无法续借');
    });

    it('应该抛出BadRequestException当续借次数超限', async () => {
      const renewedRecord = {
        ...mockBorrowRecord,
        status: BorrowStatus.BORROWED,
        renewCount: 1,
      };
      mockBorrowRepository.findOne.mockResolvedValue(renewedRecord);

      await expect(service.renew(1, 1)).rejects.toThrow(BadRequestException);
      await expect(service.renew(1, 1)).rejects.toThrow('续借次数已达上限（1次）');
    });

    it('应该抛出NotFoundException当借阅记录不存在', async () => {
      mockBorrowRepository.findOne.mockResolvedValue(null);

      await expect(service.renew(1, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('calculateOverdue', () => {
    it('应该返回逾期天数和罚款', async () => {
      const pastDueDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const overdueRecord = {
        ...mockBorrowRecord,
        dueDate: pastDueDate,
      };
      mockBorrowRepository.findOne.mockResolvedValue(overdueRecord);

      const result = await service.calculateOverdue(1);
      expect(result.days).toBeGreaterThan(0);
      expect(result.fine).toBeGreaterThan(0);
    });

    it('应该返回0当未逾期', async () => {
      const futureDueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const notOverdueRecord = {
        ...mockBorrowRecord,
        dueDate: futureDueDate,
      };
      mockBorrowRepository.findOne.mockResolvedValue(notOverdueRecord);

      const result = await service.calculateOverdue(1);
      expect(result.days).toBe(0);
      expect(result.fine).toBe(0);
    });

    it('应该抛出NotFoundException当借阅记录不存在', async () => {
      mockBorrowRepository.findOne.mockResolvedValue(null);

      await expect(service.calculateOverdue(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('应该返回借阅记录列表', async () => {
      const result = await service.findAll({});
      expect(result).toEqual({ data: [mockBorrowRecord], total: 1 });
    });

    it('应该按会员ID筛选', async () => {
      await service.findAll({ memberId: 1 });
      expect(mockBorrowRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith(
        'borrow.memberId = :memberId',
        { memberId: 1 },
      );
    });

    it('应该按书籍ID筛选', async () => {
      await service.findAll({ bookId: 1 });
      expect(mockBorrowRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith(
        'borrow.bookId = :bookId',
        { bookId: 1 },
      );
    });

    it('应该按状态筛选', async () => {
      await service.findAll({ status: 'borrowed' });
      expect(mockBorrowRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith(
        'borrow.status = :status',
        { status: 'borrowed' },
      );
    });
  });

  describe('getCurrentBorrowCount', () => {
    it('应该返回当前借阅数量', async () => {
      mockBorrowRepository.count.mockResolvedValue(2);
      const result = await service.getCurrentBorrowCount(1);
      expect(result).toBe(2);
      expect(mockBorrowRepository.count).toHaveBeenCalledWith({
        where: { memberId: 1, status: 'borrowed' },
      });
    });
  });
});