import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('user_preferences')
export class UserPreferences {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'theme', length: 20, default: 'light' })
  theme: string;

  @Column({ name: 'language', length: 10, default: 'zh-CN' })
  language: string;

  @Column({ name: 'notification_enabled', default: true })
  notificationEnabled: boolean;

  @Column({ name: 'email_enabled', default: true })
  emailEnabled: boolean;

  @Column({ name: 'sms_enabled', default: true })
  smsEnabled: boolean;

  @Column({ type: 'json', nullable: true })
  preferences: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}