import { Role } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUseCase } from './login.use-case';
import { UserService } from 'src/modules/user/user.service';
import { LoginDto } from 'src/modules/auth/dtos/login.dto';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const mockUserService = {
      findUnique: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    loginUseCase = app.get<LoginUseCase>(LoginUseCase);
    userService = app.get<UserService>(UserService);
    jwtService = app.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  describe('execute', () => {
    const loginDto: LoginDto = {
      email: 'test@test.com',
      password: 'password123',
    };

    it('should login successfully with valid credentials', async () => {
      const user = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        password: 'hashedPassword123',
        role: Role.ATTENDANT,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const token = 'mockJwtToken';

      jest.spyOn(userService, 'findUnique').mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = await loginUseCase.execute(loginDto);

      expect(userService.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        user.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: user.id,
        email: user.email,
        role: user.role,
      });
      expect(result).toEqual({
        access_token: token,
      });
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      jest.spyOn(userService, 'findUnique').mockResolvedValue(null);

      await expect(loginUseCase.execute(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(loginUseCase.execute(loginDto)).rejects.toThrow(
        'Invalid credentials',
      );

      expect(userService.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const user = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        password: 'hashedPassword123',
        role: Role.ATTENDANT,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(userService, 'findUnique').mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(loginUseCase.execute(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(loginUseCase.execute(loginDto)).rejects.toThrow(
        'Invalid credentials',
      );

      expect(userService.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        user.password,
      );
      expect(jwtService.sign).not.toHaveBeenCalled();
    });
  });
});
