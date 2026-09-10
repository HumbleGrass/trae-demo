import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthLoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      this.logger.log(`Auth header present for ${req.method} ${req.originalUrl}`);
    }
    this.logger.log(`Request URL: ${req.method} ${req.originalUrl}`);
    next();
  }
}
