import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { UserController } from './user.controller';
import { CreateUserUseCase } from './use-cases/create-user.use-case';

describe('UserController', () => {
  let userController: UserController;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(async () => {
    const mockCreateUserUseCase = {
      execute: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: CreateUserUseCase,
          useValue: mockCreateUserUseCase,
        },
      ],
    }).compile();

    userController = app.get<UserController>(UserController);
    createUserUseCase = app.get<CreateUserUseCase>(CreateUserUseCase);
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto = {
        email: 'test@test.com',
        name: 'Test User',
        password: 'password123',
        role: Role.ATTENDANT,
      };

      const expectedResult = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        role: Role.ATTENDANT,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(createUserUseCase, 'execute')
        .mockResolvedValue(expectedResult);

      const result = await userController.create(createUserDto);

      expect(createUserUseCase.execute).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(expectedResult);
    });
  });
});
