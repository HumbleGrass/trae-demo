import { Test, TestingModule } from '@nestjs/testing';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

describe('MembersController', () => {
  let controller: MembersController;
  let service: MembersService;

  const mockMember = {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138000',
    membershipDate: new Date(),
    isActive: true,
  };

  const mockMembersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByUserId: jest.fn(),
    updateBorrowLimit: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembersController],
      providers: [
        { provide: MembersService, useValue: mockMembersService },
      ],
    }).compile();

    controller = module.get<MembersController>(MembersController);
    service = module.get<MembersService>(MembersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new member', async () => {
      const dto: CreateMemberDto = {
        name: '张三',
        email: 'zhangsan@example.com',
        phone: '13800138000',
      };
      mockMembersService.create.mockResolvedValue(mockMember);

      const result = await controller.create(dto);

      expect(result).toEqual(mockMember);
      expect(service.create).toHaveBeenCalledWith(dto);
    });

    it('should throw error when member creation fails', async () => {
      const dto: CreateMemberDto = {
        name: '张三',
        email: 'zhangsan@example.com',
        phone: '13800138000',
      };
      mockMembersService.create.mockRejectedValue(new Error('创建会员失败'));

      await expect(controller.create(dto)).rejects.toThrow('创建会员失败');
    });
  });

  describe('findAll', () => {
    it('should return an array of members', async () => {
      const members = [mockMember, { ...mockMember, id: 2, name: '李四' }];
      mockMembersService.findAll.mockResolvedValue(members);

      const result = await controller.findAll({});

      expect(result).toEqual(members);
      expect(service.findAll).toHaveBeenCalledWith({});
    });

    it('should filter members by query parameters', async () => {
      const members = [mockMember];
      mockMembersService.findAll.mockResolvedValue(members);

      const query = { name: '张三', isActive: true };
      const result = await controller.findAll(query);

      expect(result).toEqual(members);
      expect(service.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return a single member', async () => {
      mockMembersService.findOne.mockResolvedValue(mockMember);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockMember);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw error when member not found', async () => {
      mockMembersService.findOne.mockResolvedValue(null);

      const result = await controller.findOne(999);

      expect(result).toBeNull();
      expect(service.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('update', () => {
    it('should update a member', async () => {
      const updateDto: UpdateMemberDto = { name: '张三更新' };
      const updatedMember = { ...mockMember, name: '张三更新' };
      mockMembersService.update.mockResolvedValue(updatedMember);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(updatedMember);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should update member email', async () => {
      const updateDto: UpdateMemberDto = { email: 'newemail@example.com' };
      const updatedMember = { ...mockMember, email: 'newemail@example.com' };
      mockMembersService.update.mockResolvedValue(updatedMember);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(updatedMember);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a member', async () => {
      mockMembersService.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should throw error when member deletion fails', async () => {
      mockMembersService.remove.mockRejectedValue(new Error('删除会员失败'));

      await expect(controller.remove(999)).rejects.toThrow('删除会员失败');
    });
  });

  describe('getProfile', () => {
    it('should return member profile by user id', async () => {
      const user = { userId: 1 };
      mockMembersService.findByUserId.mockResolvedValue(mockMember);

      const result = await controller.getProfile(user);

      expect(result).toEqual(mockMember);
      expect(service.findByUserId).toHaveBeenCalledWith(user.userId);
    });
  });

  describe('updateBorrowLimit', () => {
    it('should update member borrow limit', async () => {
      const updatedMember = { ...mockMember, borrowLimit: 10 };
      mockMembersService.updateBorrowLimit.mockResolvedValue(updatedMember);

      const result = await controller.updateBorrowLimit(1, 10);

      expect(result).toEqual(updatedMember);
      expect(service.updateBorrowLimit).toHaveBeenCalledWith(1, 10);
    });

    it('should increase borrow limit', async () => {
      const updatedMember = { ...mockMember, borrowLimit: 15 };
      mockMembersService.updateBorrowLimit.mockResolvedValue(updatedMember);

      const result = await controller.updateBorrowLimit(1, 15);

      expect(result).toEqual(updatedMember);
      expect(service.updateBorrowLimit).toHaveBeenCalledWith(1, 15);
    });
  });
});
