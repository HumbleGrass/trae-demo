import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: Partial<User>; token: string }> {
    const existingUser = await this.userRepository.findOne({
      where: { username: registerDto.username },
    });

    if (existingUser) {
      throw new ConflictException('用户名已存在');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = this.userRepository.create({
      username: registerDto.username,
      password: hashedPassword,
      email: registerDto.email,
      phone: registerDto.phone,
      bio: registerDto.bio,
      role: UserRole.USER,
    });

    await this.userRepository.save(user);

    const token = this.jwtService.sign({
      sub: user.id,
      username: user.username,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        bio: user.bio,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  async login(loginDto: LoginDto): Promise<{ user: Partial<User>; token: string }> {
    // 支持通过 username 或 email 登录
    const whereCondition = loginDto.username
      ? { username: loginDto.username }
      : loginDto.email
      ? { email: loginDto.email }
      : null;

    if (!whereCondition) {
      throw new UnauthorizedException('用户名或邮箱不能为空');
    }

    const user = await this.userRepository.findOne({
      where: whereCondition,
    });

    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('账户已被禁用');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      username: user.username,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        bio: user.bio,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async validateUser(payload: any): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: payload.sub } });
  }
}