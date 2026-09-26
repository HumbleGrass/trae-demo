import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('language_configs')
export class LanguageConfig {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 10 })
  language: string;

  @Column({ length: 50 })
  module: string;

  @Column({ length: 100 })
  key: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}