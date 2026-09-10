import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { BooksModule } from './modules/books/books.module';
import { MembersModule } from './modules/members/members.module';
import { BorrowModule } from './modules/borrow/borrow.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { FinesModule } from './modules/fines/fines.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { SystemModule } from './modules/system/system.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { AuthLoggerMiddleware } from './common/middleware/auth-logger.middleware';

dotenv.config({ path: path.resolve(__dirname, '../..', '.env') });

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'library_management',
      entities: [__dirname + '/entities/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
      connectTimeout: 60000,
      acquireTimeout: 60000,
      retryAttempts: 10,
      retryDelay: 2000,
      extra: {
        connectionLimit: 20,
        waitForConnections: true,
        queueLimit: 0,
        connectTimeout: 60000,
        acquireTimeout: 60000,
        timeout: 60000,
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000,
      },
      poolSize: 20,
      keepConnectionAlive: true,
    }),
    AuthModule,
    BooksModule,
    MembersModule,
    BorrowModule,
    ReservationsModule,
    FinesModule,
    ReportsModule,
    AnalyticsModule,
    SystemModule,
    StatisticsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthLoggerMiddleware)
      .forRoutes('*');
  }
}