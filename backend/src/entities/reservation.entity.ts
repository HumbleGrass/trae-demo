import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Member } from './member.entity';
import { Book } from './book.entity';

export enum ReservationStatus {
  PENDING = 'pending',
  FULFILLED = 'fulfilled',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'member_id' })
  memberId: number;

  @ManyToOne(() => Member, member => member.reservations)
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @Column({ name: 'book_id' })
  bookId: number;

  @ManyToOne(() => Book, book => book.reservations)
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @Column({ name: 'reservation_date' })
  reservationDate: Date;

  @Column({ name: 'expiry_date' })
  expiryDate: Date;

  @Column({ name: 'fulfil_date', nullable: true })
  fulfilDate: Date;

  @Column({ type: 'enum', enum: ReservationStatus, default: ReservationStatus.PENDING })
  status: ReservationStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}