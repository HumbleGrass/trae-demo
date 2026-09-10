import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('data_dict')
export class DataDict {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 50 })
  type: string;

  @Column({ length: 50 })
  label: string;

  @Column({ length: 50 })
  value: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ length: 200, nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}