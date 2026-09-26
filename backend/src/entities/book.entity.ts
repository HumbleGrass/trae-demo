import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { BorrowRecord } from './borrow-record.entity';
import { Reservation } from './reservation.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 50 })
  author: string;

  @Column({ unique: true, length: 20 })
  isbn: string;

  @Column({ length: 100, nullable: true })
  publisher: string;

  @Column({ name: 'publish_date', nullable: true })
  publishDate: Date;

  @Column({ default: 0 })
  quantity: number;

  @Column({ name: 'available_quantity', default: 0 })
  availableQuantity: number;

  @Column({ length: 500, nullable: true })
  description: string;

  @Column({ length: 100, nullable: true })
  cover: string;

  @Index()
  @Column({ name: 'category_id', nullable: true })
  categoryId: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => BorrowRecord, borrowRecord => borrowRecord.book)
  borrowRecords: BorrowRecord[];

  @OneToMany(() => Reservation, reservation => reservation.book)
  reservations: Reservation[];
}