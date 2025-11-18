import { Test, TestingModule } from '@nestjs/testing';
import { ExamController } from './exam.controller';
import { CreateExamUseCase } from './use-cases/create-exam.use-case';
import { Role, ExamStatus } from '@prisma/client';

describe('ExamController', () => {
  let examController: ExamController;
  let createExamUseCase: CreateExamUseCase;

  beforeEach(async () => {
    const mockCreateExamUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamController],
      providers: [
        {
          provide: CreateExamUseCase,
          useValue: mockCreateExamUseCase,
        },
      ],
    }).compile();

    examController = module.get<ExamController>(ExamController);
    createExamUseCase = module.get<CreateExamUseCase>(CreateExamUseCase);
  });

  describe('upload', () => {
    it('should create an exam', async () => {
      const user = {
        id: '1',
        email: 'attendant@test.com',
        role: Role.ATTENDANT,
      };
      const expectedResult = {
        id: 'exam-1',
        status: ExamStatus.PENDING,
        processingResult: null,
        report: null,
        attendantId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(createExamUseCase, 'execute')
        .mockResolvedValue(expectedResult);

      const result = await examController.upload(user);

      expect(createExamUseCase.execute).toHaveBeenCalledWith(user.id);
      expect(result).toEqual(expectedResult);
    });
  });
});
