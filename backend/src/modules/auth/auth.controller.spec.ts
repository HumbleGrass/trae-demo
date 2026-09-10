import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockUser = {
    id: 1,
    username: 'testuser',
    role: 'USER',
  };

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const dto: RegisterDto = {
        username: 'newuser',
        password: 'password123',
      };
      const expectedResult = { user: mockUser, access_token: 'jwt_token' };
      mockAuthService.register.mockResolvedValue(expectedResult);

      const result = await controller.register(dto);

      expect(result).toEqual(expectedResult);
      expect(service.register).toHaveBeenCalledWith(dto);
    });

    it('should throw error when username already exists', async () => {
      const dto: RegisterDto = {
        username: 'existinguser',
        password: 'password123',
      };
      mockAuthService.register.mockRejectedValue(new Error('用户名已存在'));

      await expect(controller.register(dto)).rejects.toThrow('用户名已存在');
      expect(service.register).toHaveBeenCalledWith(dto);
    });

    it('should register user with specified role', async () => {
      const dto: RegisterDto = {
        username: 'adminuser',
        password: 'password123',
        role: 'ADMIN' as any,
      };
      const expectedResult = { user: { ...mockUser, role: 'ADMIN' }, access_token: 'jwt_token' };
      mockAuthService.register.mockResolvedValue(expectedResult);

      const result = await controller.register(dto);

      expect(result).toEqual(expectedResult);
      expect(service.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const dto: LoginDto = {
        username: 'testuser',
        password: 'password123',
      };
      const expectedResult = { user: mockUser, access_token: 'jwt_token' };
      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(dto);

      expect(result).toEqual(expectedResult);
      expect(service.login).toHaveBeenCalledWith(dto);
    });

    it('should throw error when user does not exist', async () => {
      const dto: LoginDto = {
        username: 'nonexistent',
        password: 'password123',
      };
      mockAuthService.login.mockRejectedValue(new Error('用户不存在'));

      await expect(controller.login(dto)).rejects.toThrow('用户不存在');
      expect(service.login).toHaveBeenCalledWith(dto);
    });

    it('should throw error when password is incorrect', async () => {
      const dto: LoginDto = {
        username: 'testuser',
        password: 'wrongpassword',
      };
      mockAuthService.login.mockRejectedValue(new Error('密码错误'));

      await expect(controller.login(dto)).rejects.toThrow('密码错误');
      expect(service.login).toHaveBeenCalledWith(dto);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const req = { user: mockUser };

      const result = await controller.getProfile(req);

      expect(result).toEqual(mockUser);
    });
  });
});
