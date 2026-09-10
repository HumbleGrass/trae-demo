import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BooksService } from './books.service';
import { Book } from '../../entities/book.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('BooksService', () => {
  let service: BooksService;
  let repository: Repository<Book>;

  const mockBook: Partial<Book> = {
    id: 1,
    title: '测试书籍',
    author: '测试作者',
    isbn: '1234567890',
    publisher: '测试出版社',
    quantity: 10,
    availableQuantity: 5,
    categoryId: 1,
    isActive: true,
  };

  const queryBuilder = {
    andWhere: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getRawMany: jest.fn().mockResolvedValue([{ categoryId: 1 }, { categoryId: 2 }]),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getCount: jest.fn().mockResolvedValue(1),
    getMany: jest.fn().mockResolvedValue([mockBook]),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => queryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    repository = module.get<Repository<Book>>(getRepositoryToken(Book));
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('应该返回所有书籍列表', async () => {
      const result = await service.findAll({});
      expect(result).toEqual({ data: [mockBook], total: 1 });
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('book');
    });

    it('应该按关键词搜索书籍', async () => {
      const query = { keyword: '测试' };
      await service.findAll(query);
      expect(mockRepository.createQueryBuilder().andWhere).toHaveBeenCalled();
    });

    it('应该按分类搜索书籍', async () => {
      const query = { category: 1 };
      await service.findAll(query);
      expect(mockRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith(
        'book.categoryId = :category',
        { category: 1 },
      );
    });
  });

  describe('findOne', () => {
    it('应该返回书籍详情', async () => {
      mockRepository.findOne.mockResolvedValue(mockBook);
      const result = await service.findOne(1);
      expect(result).toEqual(mockBook);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('应该抛出NotFoundException当书籍不存在', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('应该成功创建书籍', async () => {
      const createDto = {
        title: '新书籍',
        author: '作者',
        isbn: '9876543210',
        publisher: '出版社',
        quantity: 5,
        categoryId: 1,
      };
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue({ ...createDto, id: 2 });
      mockRepository.save.mockResolvedValue({ ...createDto, id: 2 });

      const result = await service.create(createDto);
      expect(result.id).toBe(2);
      expect(mockRepository.create).toHaveBeenCalledWith(createDto);
    });

    it('应该抛出ConflictException当ISBN已存在', async () => {
      const createDto = {
        title: '新书籍',
        author: '作者',
        isbn: '9787115428028',
        publisher: '出版社',
        quantity: 5,
        categoryId: 1,
      };
      mockRepository.findOne.mockResolvedValue(mockBook);
      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('应该成功更新书籍', async () => {
      const updateDto = { title: '更新后的书名' };
      mockRepository.findOne.mockResolvedValue(mockBook);
      mockRepository.save.mockResolvedValue({ ...mockBook, ...updateDto });

      const result = await service.update(1, updateDto);
      expect(result.title).toBe('更新后的书名');
    });

    it('应该抛出ConflictException当更新的ISBN已存在', async () => {
      const updateDto = { isbn: '9876543210' };
      mockRepository.findOne
        .mockResolvedValueOnce(mockBook)
        .mockResolvedValueOnce({ ...mockBook, id: 2 });

      await expect(service.update(1, updateDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('updateStock', () => {
    it('应该成功更新库存', async () => {
      mockRepository.findOne.mockResolvedValue({ ...mockBook, stock: 5, available: 3 });
      mockRepository.save.mockResolvedValue({ ...mockBook, stock: 3, available: 1 });

      const result = await service.updateStock(1, -2);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('getCategories', () => {
    it('应该返回所有分类', async () => {
      const result = await service.getCategories();
      expect(result).toEqual([1, 2]);
      expect(mockRepository.createQueryBuilder().getRawMany).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('应该成功删除书籍', async () => {
      mockRepository.findOne.mockResolvedValue(mockBook);
      mockRepository.remove.mockResolvedValue(mockBook);

      await service.remove(1);
      expect(mockRepository.remove).toHaveBeenCalledWith(mockBook);
    });

    it('应该抛出NotFoundException当删除不存在的书籍', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});