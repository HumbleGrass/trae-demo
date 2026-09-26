import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation, ReservationStatus } from '../../entities/reservation.entity';
import { BooksService } from '../books/books.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  private readonly MAX_RESERVATIONS_PER_MEMBER = 3;

  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    private booksService: BooksService,
  ) {}

  async create(memberId: number, createReservationDto: CreateReservationDto): Promise<Reservation> {
    const book = await this.booksService.findOne(createReservationDto.bookId);

    if (book.availableQuantity > 0) {
      throw new BadRequestException('该书籍有库存，无需预约');
    }

    const activeReservations = await this.getActiveReservationCount(memberId);
    if (activeReservations >= this.MAX_RESERVATIONS_PER_MEMBER) {
      throw new BadRequestException(`预约上限为${this.MAX_RESERVATIONS_PER_MEMBER}本`);
    }

    const existingReservation = await this.reservationRepository.findOne({
      where: {
        memberId,
        bookId: createReservationDto.bookId,
        status: ReservationStatus.PENDING,
      },
    });

    if (existingReservation) {
      throw new BadRequestException('您已预约过该书籍');
    }

    const reservation = this.reservationRepository.create({
      memberId,
      bookId: book.id,
      status: ReservationStatus.PENDING,
      reservationDate: new Date(),
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return this.reservationRepository.save(reservation);
  }

  async cancel(id: number, memberId: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { id, memberId },
    });

    if (!reservation) {
      throw new NotFoundException('预约记录不存在');
    }

    if (reservation.status !== ReservationStatus.PENDING) {
      throw new BadRequestException('该预约无法取消');
    }

    reservation.status = ReservationStatus.CANCELLED;
    return this.reservationRepository.save(reservation);
  }

  async findByMember(memberId: number): Promise<Reservation[]> {
    return this.reservationRepository.find({
      where: { memberId },
      relations: ['book'],
      order: { createdAt: 'DESC' },
    });
  }

  async findPendingByBook(bookId: number): Promise<Reservation[]> {
    return this.reservationRepository.find({
      where: { bookId, status: ReservationStatus.PENDING },
      order: { createdAt: 'ASC' },
    });
  }

  async notifyFirstInQueue(bookId: number): Promise<Reservation | null> {
    const pendingReservations = await this.findPendingByBook(bookId);
    if (pendingReservations.length === 0) {
      return null;
    }

    const firstReservation = pendingReservations[0];
    firstReservation.status = ReservationStatus.FULFILLED;
    firstReservation.fulfilDate = new Date();
    return this.reservationRepository.save(firstReservation);
  }

  async getActiveReservationCount(memberId: number): Promise<number> {
    return this.reservationRepository.count({
      where: { memberId, status: ReservationStatus.PENDING },
    });
  }

  async findAll(page = 1, pageSize = 20, status?: string): Promise<{ data: Reservation[]; total: number }> {
    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [data, total] = await this.reservationRepository.findAndCount({
      where,
      relations: ['book', 'member'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { data, total };
  }
}