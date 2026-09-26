import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, MiddlewareConsumer } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { AuthLoggerMiddleware } from './common/middleware/auth-logger.middleware';

dotenv.config({ path: path.resolve(__dirname, '../..', '.env') });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  app.setGlobalPrefix('api/v1');

  await app.listen(process.env.PORT || 3030);
  console.log(`Application is running on: http://localhost:${process.env.PORT || 3030}`);
}
bootstrap();