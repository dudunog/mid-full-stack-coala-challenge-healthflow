import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { LoginUseCase } from './use-cases/login.use-case';

describe('AuthController', () => {
  let authController: AuthController;
  let loginUseCase: LoginUseCase;

  beforeEach(async () => {
    const mockLoginUseCase = {
      execute: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: LoginUseCase,
          useValue: mockLoginUseCase,
        },
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
    loginUseCase = app.get<LoginUseCase>(LoginUseCase);
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const loginDto = {
        email: 'test@test.com',
        password: 'password123',
      };

      const expectedResult = {
        access_token: 'mockJwtToken',
      };

      jest.spyOn(loginUseCase, 'execute').mockResolvedValue(expectedResult);

      const result = await authController.login(loginDto);

      expect(loginUseCase.execute).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResult);
    });
  });
});
