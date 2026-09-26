import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('system_menus')
export class SystemMenu {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 100, nullable: true })
  path: string;

  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @Column({ name: 'component', length: 200, nullable: true })
  component: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ length: 50, nullable: true })
  icon: string;

  @Column({ name: 'is_visible', default: true })
  isVisible: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}