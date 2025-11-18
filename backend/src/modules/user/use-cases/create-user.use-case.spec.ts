import { Role } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { CreateUserDto } from 'src/modules/user/dtos/create-user.dto';
import { CreateUserUseCase } from './create-user.use-case';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

import * as bcrypt from 'bcrypt';

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  let userService: UserService;

  beforeEach(async () => {
    const mockUserService = {
      findUnique: jest.fn(),
      create: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    createUserUseCase = app.get<CreateUserUseCase>(CreateUserUseCase);
    userService = app.get<UserService>(UserService);
  });

  describe('execute', () => {
    const createUserDto: CreateUserDto = {
      email: 'test@test.com',
      name: 'Test User',
      password: 'password123',
      role: Role.ATTENDANT,
    };

    it('should create a user successfully', async () => {
      const hashedPassword = 'hashedPassword123';
      const createdUser = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        password: hashedPassword,
        role: Role.ATTENDANT,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(userService, 'findUnique').mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      jest.spyOn(userService, 'create').mockResolvedValue(createdUser);

      const result = await createUserUseCase.execute(createUserDto);

      expect(userService.findUnique).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(userService.create).toHaveBeenCalledWith({
        data: {
          email: createUserDto.email,
          name: createUserDto.name,
          password: hashedPassword,
          role: createUserDto.role,
        },
      });
      expect(result).toEqual({
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        role: Role.ATTENDANT,
        createdAt: createdUser.createdAt,
        updatedAt: createdUser.updatedAt,
      });
      expect(result).not.toHaveProperty('password');
    });

    it('should throw ConflictException when email already exists', async () => {
      const existingUser = {
        id: '1',
        email: 'test@test.com',
        name: 'Existing User',
        password: 'hashedPassword',
        role: Role.DOCTOR,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(userService, 'findUnique').mockResolvedValue(existingUser);

      await expect(createUserUseCase.execute(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(createUserUseCase.execute(createUserDto)).rejects.toThrow(
        'User with this email already exists',
      );

      expect(userService.findUnique).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(userService.create).not.toHaveBeenCalled();
    });
  });
});
