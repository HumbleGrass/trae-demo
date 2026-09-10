import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private authService: AuthService) {
    const jwtSecret = process.env.JWT_SECRET || 'library-management-secret-key-2024';

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    try {
      const user = await this.authService.validateUser(payload);
      if (!user) {
        this.logger.warn(`User not found for payload: ${JSON.stringify(payload)}`);
        throw new UnauthorizedException('用户不存在');
      }
      if (!user.isActive) {
        this.logger.warn(`User ${user.username} is inactive`);
        throw new UnauthorizedException('账户已被禁用');
      }
      return {
        userId: payload.sub,
        username: payload.username,
        role: payload.role,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(`JWT validation error: ${error.message}`);
      throw new UnauthorizedException('认证失败');
    }
  }
}