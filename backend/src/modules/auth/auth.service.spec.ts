import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { User, UserRole } from '../../entities/user.entity';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  const mockUser: Partial<User> = {
    id: 1,
    username: 'testuser',
    password: 'hashedPassword',
    role: UserRole.USER,
    isActive: true,
  };

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked_token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);

    (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto = {
      username: 'newuser',
      password: 'password123',
      role: UserRole.USER,
    };

    it('应该成功注册用户', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue({ ...mockUser, ...registerDto });
      mockUserRepository.save.mockResolvedValue({ ...mockUser, id: 2, ...registerDto });

      const result = await service.register(registerDto);
      expect(result.user.username).toBe(registerDto.username);
      expect(result.token).toBe('mocked_token');
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: expect.any(Number),
        username: registerDto.username,
        role: UserRole.USER,
      });
    });

    it('应该抛出ConflictException当用户名已存在', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
      await expect(service.register(registerDto)).rejects.toThrow('用户名已存在');
    });

    it('应该使用默认USER角色', async () => {
      const dtoWithoutRole = { username: 'newuser', password: 'password123' };
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue({ ...mockUser, ...dtoWithoutRole, role: UserRole.USER });
      mockUserRepository.save.mockResolvedValue({ ...mockUser, ...dtoWithoutRole, role: UserRole.USER });

      await service.register(dtoWithoutRole);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        username: dtoWithoutRole.username,
        password: expect.any(String),
        role: UserRole.USER,
      });
    });
  });

  describe('login', () => {
    const loginDto = {
      username: 'testuser',
      password: 'password123',
    };

    it('应该成功登录', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login(loginDto);
      expect(result.user.username).toBe(mockUser.username);
      expect(result.token).toBe('mocked_token');
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
    });

    it('应该抛出UnauthorizedException当用户不存在', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto)).rejects.toThrow('用户名或密码错误');
    });

    it('应该抛出UnauthorizedException当密码错误', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto)).rejects.toThrow('用户名或密码错误');
    });

    it('应该抛出UnauthorizedException当账户被禁用', async () => {
      const disabledUser = { ...mockUser, isActive: false };
      mockUserRepository.findOne.mockResolvedValue(disabledUser);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto)).rejects.toThrow('账户已被禁用');
    });

    it('应该返回用户信息和token', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login(loginDto);
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.id).toBe(mockUser.id);
      expect(result.user.username).toBe(mockUser.username);
      expect(result.user.role).toBe(mockUser.role);
    });
  });

  describe('getUserById', () => {
    it('应该返回用户信息', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      const result = await service.getUserById(1);
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('应该返回null当用户不存在', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      const result = await service.getUserById(999);
      expect(result).toBeNull();
    });
  });

  describe('validateUser', () => {
    it('应该通过payload验证用户', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      const payload = { sub: 1, username: 'testuser' };
      const result = await service.validateUser(payload);
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: payload.sub } });
    });
  });

  describe('token generation', () => {
    it('应该在注册时生成正确的token payload', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue({ ...mockUser, id: 2, username: 'newuser' });
      mockUserRepository.save.mockResolvedValue({ ...mockUser, id: 2, username: 'newuser' });

      await service.register({ username: 'newuser', password: 'password123' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: expect.any(Number),
        username: 'newuser',
        role: UserRole.USER,
      });
    });

    it('应该在登录时生成正确的token payload', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await service.login({ username: 'testuser', password: 'password123' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        username: mockUser.username,
        role: mockUser.role,
      });
    });
  });
});