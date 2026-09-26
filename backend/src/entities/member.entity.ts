import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { User } from './user.entity';
import { BorrowRecord } from './borrow-record.entity';
import { Reservation } from './reservation.entity';
import { OverdueFine } from './overdue-fine.entity';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 50 })
  name: string;

  @Column({ unique: true, length: 20 })
  phone: string;

  @Column({ unique: true, length: 20 })
  idCard: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ name: 'borrow_limit', default: 5 })
  borrowLimit: number;

  @Column({ name: 'birth_date', nullable: true })
  birthDate: Date;

  @Column({ length: 10, nullable: true })
  gender: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => BorrowRecord, borrowRecord => borrowRecord.member)
  borrowRecords: BorrowRecord[];

  @OneToMany(() => Reservation, reservation => reservation.member)
  reservations: Reservation[];

  @OneToMany(() => OverdueFine, fine => fine.member)
  fines: OverdueFine[];
}