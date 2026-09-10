import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from '../../entities/book.entity';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  const mockBook: Partial<Book> = {
    id: 1,
    title: '测试书籍',
    author: '作者',
    isbn: '1234567890',
    quantity: 5,
    availableQuantity: 5,
    isActive: true,
  };

  const mockBooksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getCategories: jest.fn(),
    updateStock: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        { provide: BooksService, useValue: mockBooksService },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a book', async () => {
      const dto: CreateBookDto = {
        title: '测试书籍',
        author: '作者',
        isbn: '1234567890',
        categoryId: 1,
        quantity: 5,
      };
      mockBooksService.create.mockResolvedValue(mockBook);

      const result = await controller.create(dto);

      expect(result).toEqual(mockBook);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const books = [mockBook, { ...mockBook, id: 2 }];
      mockBooksService.findAll.mockResolvedValue(books);

      const result = await controller.findAll({});

      expect(result).toEqual(books);
      expect(service.findAll).toHaveBeenCalledWith({});
    });

    it('should filter books by query parameters', async () => {
      const books = [mockBook];
      mockBooksService.findAll.mockResolvedValue(books);

      const query = { category: 1, title: '测试' };
      const result = await controller.findAll(query);

      expect(result).toEqual(books);
      expect(service.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return a single book', async () => {
      mockBooksService.findOne.mockResolvedValue(mockBook);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockBook);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw error when book not found', async () => {
      mockBooksService.findOne.mockResolvedValue(null);

      const result = await controller.findOne(999);

      expect(result).toBeNull();
      expect(service.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const updateDto: UpdateBookDto = { title: '更新后的标题' };
      const updatedBook = { ...mockBook, title: '更新后的标题' };
      mockBooksService.update.mockResolvedValue(updatedBook);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(updatedBook);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a book', async () => {
      mockBooksService.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('getCategories', () => {
    it('should return book categories', async () => {
      const categories = ['小说', '科技', '历史'];
      mockBooksService.getCategories.mockResolvedValue(categories);

      const result = await controller.getCategories();

      expect(result).toEqual(categories);
      expect(service.getCategories).toHaveBeenCalled();
    });
  });

  describe('updateStock', () => {
    it('should update book stock', async () => {
      const updatedBook = { ...mockBook, availableQuantity: 3 };
      mockBooksService.updateStock.mockResolvedValue(updatedBook);

      const result = await controller.updateStock(1, -2);

      expect(result).toEqual(updatedBook);
      expect(service.updateStock).toHaveBeenCalledWith(1, -2);
    });

    it('should increase stock when change is positive', async () => {
      const updatedBook = { ...mockBook, availableQuantity: 7 };
      mockBooksService.updateStock.mockResolvedValue(updatedBook);

      const result = await controller.updateStock(1, 2);

      expect(result).toEqual(updatedBook);
      expect(service.updateStock).toHaveBeenCalledWith(1, 2);
    });
  });
});
