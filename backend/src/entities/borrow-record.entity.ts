import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Member } from './member.entity';
import { Book } from './book.entity';

export enum BorrowStatus {
  BORROWED = 'borrowed',
  RETURNED = 'returned',
  OVERDUE = 'overdue',
}

@Entity('borrow_records')
@Index(['memberId', 'status'])
export class BorrowRecord {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'member_id' })
  memberId: number;

  @ManyToOne(() => Member, member => member.borrowRecords)
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @Column({ name: 'book_id' })
  bookId: number;

  @ManyToOne(() => Book, book => book.borrowRecords)
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @Column({ name: 'borrow_date' })
  borrowDate: Date;

  @Column({ name: 'due_date' })
  dueDate: Date;

  @Column({ name: 'actual_return_date', nullable: true })
  actualReturnDate: Date;

  @Index()
  @Column({ type: 'enum', enum: BorrowStatus, default: BorrowStatus.BORROWED })
  status: BorrowStatus;

  @Column({ name: 'renew_count', default: 0 })
  renewCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}