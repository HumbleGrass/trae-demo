import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('system_config')
export class SystemConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '图书馆管理系统' })
  systemName: string;

  @Column({ default: 5 })
  maxBorrow: number;

  @Column({ default: 30 })
  borrowDays: number;

  @Column({ default: 72 })
  reserveExpireHours: number;

  @Column({ default: 0.5, type: 'decimal', precision: 10, scale: 2 })
  finePerDay: number;

  @Column({ default: 1 })
  maxRenewCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
