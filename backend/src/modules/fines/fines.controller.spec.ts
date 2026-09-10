import { Test, TestingModule } from '@nestjs/testing';
import { FinesController } from './fines.controller';
import { FinesService } from './fines.service';

describe('FinesController', () => {
  let controller: FinesController;
  let service: FinesService;

  const mockFine = {
    id: 1,
    memberId: 1,
    borrowId: 1,
    amount: 10.5,
    isPaid: false,
    paidAt: null,
    createdAt: new Date(),
  };

  const mockFinesService = {
    findAll: jest.fn(),
    findByMember: jest.fn(),
    pay: jest.fn(),
    getUnpaidTotal: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinesController],
      providers: [
        { provide: FinesService, useValue: mockFinesService },
      ],
    }).compile();

    controller = module.get<FinesController>(FinesController);
    service = module.get<FinesService>(FinesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of fines', async () => {
      const fines = [mockFine, { ...mockFine, id: 2 }];
      mockFinesService.findAll.mockResolvedValue(fines);

      const result = await controller.findAll({});

      expect(result).toEqual(fines);
      expect(service.findAll).toHaveBeenCalledWith({});
    });

    it('should filter fines by isPaid status', async () => {
      const unpaidFines = [{ ...mockFine, isPaid: false }];
      mockFinesService.findAll.mockResolvedValue(unpaidFines);

      const query = { isPaid: false };
      const result = await controller.findAll(query);

      expect(result).toEqual(unpaidFines);
      expect(service.findAll).toHaveBeenCalledWith(query);
    });

    it('should filter fines by member id', async () => {
      const fines = [mockFine];
      mockFinesService.findAll.mockResolvedValue(fines);

      const query = { memberId: 1 };
      const result = await controller.findAll(query);

      expect(result).toEqual(fines);
      expect(service.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('getMyFines', () => {
    it('should return current user fines', async () => {
      const user = { userId: 1 };
      const fines = [mockFine];
      mockFinesService.findByMember.mockResolvedValue(fines);

      const result = await controller.getMyFines(user);

      expect(result).toEqual(fines);
      expect(service.findByMember).toHaveBeenCalledWith(user.userId);
    });

    it('should return empty array when user has no fines', async () => {
      const user = { userId: 1 };
      mockFinesService.findByMember.mockResolvedValue([]);

      const result = await controller.getMyFines(user);

      expect(result).toEqual([]);
      expect(service.findByMember).toHaveBeenCalledWith(user.userId);
    });
  });

  describe('getMyUnpaidTotal', () => {
    it('should return total unpaid fines for current user', async () => {
      const user = { userId: 1 };
      const total = 25.5;
      mockFinesService.getUnpaidTotal.mockResolvedValue(total);

      const result = await controller.getMyUnpaidTotal(user);

      expect(result).toEqual(total);
      expect(service.getUnpaidTotal).toHaveBeenCalledWith(user.userId);
    });

    it('should return zero when user has no unpaid fines', async () => {
      const user = { userId: 1 };
      mockFinesService.getUnpaidTotal.mockResolvedValue(0);

      const result = await controller.getMyUnpaidTotal(user);

      expect(result).toEqual(0);
      expect(service.getUnpaidTotal).toHaveBeenCalledWith(user.userId);
    });
  });

  describe('pay', () => {
    it('should pay a fine successfully', async () => {
      const paidFine = {
        ...mockFine,
        isPaid: true,
        paidAt: new Date(),
      };
      mockFinesService.pay.mockResolvedValue(paidFine);

      const result = await controller.pay(1);

      expect(result).toEqual(paidFine);
      expect(service.pay).toHaveBeenCalledWith(1);
    });

    it('should throw error when fine not found', async () => {
      mockFinesService.pay.mockRejectedValue(new Error('费用记录不存在'));

      await expect(controller.pay(999)).rejects.toThrow('费用记录不存在');
    });

    it('should throw error when fine already paid', async () => {
      mockFinesService.pay.mockRejectedValue(new Error('该费用已支付'));

      await expect(controller.pay(1)).rejects.toThrow('该费用已支付');
    });
  });
});
