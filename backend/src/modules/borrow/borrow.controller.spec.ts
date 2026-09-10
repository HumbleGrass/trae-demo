import { Test, TestingModule } from '@nestjs/testing';
import { BorrowController } from './borrow.controller';
import { BorrowService } from './borrow.service';
import { CreateBorrowDto } from './dto/create-borrow.dto';

describe('BorrowController', () => {
  let controller: BorrowController;
  let service: BorrowService;

  const mockBorrowRecord = {
    id: 1,
    bookId: 1,
    memberId: 1,
    borrowDate: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    actualReturnDate: null,
    status: 'BORROWED',
  };

  const mockBorrowService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByMember: jest.fn(),
    returnBook: jest.fn(),
    renew: jest.fn(),
    findAll: jest.fn(),
    calculateOverdue: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BorrowController],
      providers: [
        { provide: BorrowService, useValue: mockBorrowService },
      ],
    }).compile();

    controller = module.get<BorrowController>(BorrowController);
    service = module.get<BorrowService>(BorrowService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a borrow record', async () => {
      const dto: CreateBorrowDto = {
        bookId: 1,
        memberId: 1,
      };
      const user = { userId: 1 };
      mockBorrowService.create.mockResolvedValue(mockBorrowRecord);

      const result = await controller.create(user, dto);

      expect(result).toEqual(mockBorrowRecord);
      expect(service.create).toHaveBeenCalledWith(user.userId, dto);
    });

    it('should throw error when book is not available', async () => {
      const dto: CreateBorrowDto = {
        bookId: 999,
        memberId: 1,
      };
      const user = { userId: 1 };
      mockBorrowService.create.mockRejectedValue(new Error('图书不可用'));

      await expect(controller.create(user, dto)).rejects.toThrow('图书不可用');
    });

    it('should throw error when member has reached borrow limit', async () => {
      const dto: CreateBorrowDto = {
        bookId: 1,
        memberId: 1,
      };
      const user = { userId: 1 };
      mockBorrowService.create.mockRejectedValue(new Error('已达到借阅上限'));

      await expect(controller.create(user, dto)).rejects.toThrow('已达到借阅上限');
    });
  });

  describe('findAll', () => {
    it('should return an array of borrow records', async () => {
      const records = [mockBorrowRecord, { ...mockBorrowRecord, id: 2 }];
      mockBorrowService.findAll.mockResolvedValue(records);

      const result = await controller.findAll({});

      expect(result).toEqual(records);
      expect(service.findAll).toHaveBeenCalledWith({});
    });

    it('should filter borrow records by status', async () => {
      const records = [{ ...mockBorrowRecord, status: 'OVERDUE' }];
      mockBorrowService.findAll.mockResolvedValue(records);

      const query = { status: 'overdue' };
      const result = await controller.findAll(query);

      expect(result).toEqual(records);
      expect(service.findAll).toHaveBeenCalledWith(query);
    });

    it('should filter borrow records by member id', async () => {
      const records = [mockBorrowRecord];
      mockBorrowService.findAll.mockResolvedValue(records);

      const query = { memberId: 1 };
      const result = await controller.findAll(query);

      expect(result).toEqual(records);
      expect(service.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('getMyBorrows', () => {
    it('should return current user borrow records', async () => {
      const user = { userId: 1 };
      const records = [mockBorrowRecord];
      mockBorrowService.findByMember.mockResolvedValue(records);

      const result = await controller.getMyBorrows(user);

      expect(result).toEqual(records);
      expect(service.findByMember).toHaveBeenCalledWith(user.userId);
    });
  });

  describe('getOverdueList', () => {
    it('should return overdue borrow records', async () => {
      const records = [{ ...mockBorrowRecord, status: 'OVERDUE' }];
      mockBorrowService.findAll.mockResolvedValue(records);

      const result = await controller.getOverdueList();

      expect(result).toEqual(records);
      expect(service.findAll).toHaveBeenCalledWith({ status: 'overdue' } as any);
    });
  });

  describe('returnBook', () => {
    it('should return a book successfully', async () => {
      const user = { userId: 1 };
      const returnedRecord = {
        ...mockBorrowRecord,
        actualReturnDate: new Date(),
        status: 'RETURNED',
      };
      mockBorrowService.returnBook.mockResolvedValue(returnedRecord);

      const result = await controller.returnBook(user, 1);

      expect(result).toEqual(returnedRecord);
      expect(service.returnBook).toHaveBeenCalledWith(user.userId, 1);
    });

    it('should throw error when borrow record not found', async () => {
      const user = { userId: 1 };
      mockBorrowService.returnBook.mockRejectedValue(new Error('借阅记录不存在'));

      await expect(controller.returnBook(user, 999)).rejects.toThrow('借阅记录不存在');
    });
  });

  describe('renew', () => {
    it('should renew a borrow record successfully', async () => {
      const user = { userId: 1 };
      const renewedRecord = {
        ...mockBorrowRecord,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      };
      mockBorrowService.renew.mockResolvedValue(renewedRecord);

      const result = await controller.renew(user, 1);

      expect(result).toEqual(renewedRecord);
      expect(service.renew).toHaveBeenCalledWith(user.userId, 1);
    });

    it('should throw error when renewal is not allowed', async () => {
      const user = { userId: 1 };
      mockBorrowService.renew.mockRejectedValue(new Error('续借失败，已超期'));

      await expect(controller.renew(user, 1)).rejects.toThrow('续借失败，已超期');
    });

    it('should throw error when renewal limit reached', async () => {
      const user = { userId: 1 };
      mockBorrowService.renew.mockRejectedValue(new Error('续借次数已达上限'));

      await expect(controller.renew(user, 1)).rejects.toThrow('续借次数已达上限');
    });
  });

  describe('calculateOverdue', () => {
    it('should calculate overdue fine for a borrow record', async () => {
      const overdueInfo = {
        borrowId: 1,
        daysOverdue: 5,
        fineAmount: 2.5,
      };
      mockBorrowService.calculateOverdue.mockResolvedValue(overdueInfo);

      const result = await controller.calculateOverdue(1);

      expect(result).toEqual(overdueInfo);
      expect(service.calculateOverdue).toHaveBeenCalledWith(1);
    });
  });
});
