import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Member } from './member.entity';
import { BorrowRecord } from './borrow-record.entity';

export enum FineStatus {
  UNPAID = 'unpaid',
  PAID = 'paid',
}

@Entity('overdue_fines')
export class OverdueFine {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'member_id' })
  memberId: number;

  @ManyToOne(() => Member, member => member.fines)
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @Column({ name: 'borrow_record_id' })
  borrowRecordId: number;

  @ManyToOne(() => BorrowRecord)
  @JoinColumn({ name: 'borrow_record_id' })
  borrowRecord: BorrowRecord;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  fineAmount: number;

  @Column({ name: 'overdue_days', default: 0 })
  overdueDays: number;

  @Column({ type: 'enum', enum: FineStatus, default: FineStatus.UNPAID })
  status: FineStatus;

  @Column({ name: 'fine_date' })
  fineDate: Date;

  @Column({ name: 'paid_date', nullable: true })
  paidDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}