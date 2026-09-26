import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Book } from '../../entities/book.entity';
import { BorrowRecord, BorrowStatus } from '../../entities/borrow-record.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookQueryDto } from './dto/book-query.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(BorrowRecord)
    private borrowRepository: Repository<BorrowRecord>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const existingBook = await this.bookRepository.findOne({
      where: { isbn: createBookDto.isbn },
    });

    if (existingBook) {
      throw new ConflictException('ISBN 已存在');
    }

    const book = this.bookRepository.create(createBookDto);
    return this.bookRepository.save(book);
  }

  async findAll(query: BookQueryDto): Promise<{ data: Book[]; total: number }> {
    const { keyword, category, page = 1, pageSize = 20 } = query;

    const queryBuilder = this.bookRepository.createQueryBuilder('book');

    if (keyword) {
      queryBuilder.andWhere(
        '(book.title LIKE :keyword OR book.author LIKE :keyword OR book.isbn LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    if (category) {
      queryBuilder.andWhere('book.categoryId = :category', { category });
    }

    const total = await queryBuilder.getCount();
    const data = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('book.createdAt', 'DESC')
      .getMany();

    return { data, total };
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException('书籍不存在');
    }
    return book;
  }

  async findByIsbn(isbn: string): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { isbn } });
    if (!book) {
      throw new NotFoundException('书籍不存在');
    }
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);

    if (updateBookDto.isbn && updateBookDto.isbn !== book.isbn) {
      const existingBook = await this.bookRepository.findOne({
        where: { isbn: updateBookDto.isbn },
      });
      if (existingBook) {
        throw new ConflictException('ISBN 已存在');
      }
    }

    Object.assign(book, updateBookDto);
    return this.bookRepository.save(book);
  }

  /**
   * 删除书籍
   * @param id - 书籍 ID
   * @throws NotFoundException 书籍不存在时抛出
   * @throws BadRequestException 存在未归还借阅记录时抛出
   */
  async remove(id: number): Promise<void> {
    const book = await this.findOne(id);

    // 删除前校验是否存在未归还的借阅记录（借阅中或已逾期），避免删除正在外借的书籍
    const activeBorrowCount = await this.borrowRepository.count({
      where: { bookId: id, status: BorrowStatus.BORROWED },
    });
    const overdueBorrowCount = await this.borrowRepository.count({
      where: { bookId: id, status: BorrowStatus.OVERDUE },
    });

    if (activeBorrowCount > 0 || overdueBorrowCount > 0) {
      throw new BadRequestException('该书籍存在未归还的借阅记录，无法删除');
    }

    await this.bookRepository.remove(book);
  }

  async updateStock(id: number, change: number, updateQuantity = false): Promise<Book> {
    const book = await this.findOne(id);
    if (updateQuantity) {
      book.quantity = book.quantity + change;
    }
    book.availableQuantity = book.availableQuantity + change;
    return this.bookRepository.save(book);
  }

  async getCategories(): Promise<number[]> {
    const result = await this.bookRepository
      .createQueryBuilder('book')
      .select('DISTINCT book.categoryId', 'categoryId')
      .where('book.categoryId IS NOT NULL')
      .getRawMany();
    return result.map(r => r.categoryId);
  }
}