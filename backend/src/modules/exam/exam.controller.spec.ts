import { Test, TestingModule } from '@nestjs/testing';
import { Role, ExamStatus } from '@prisma/client';
import { ExamController } from './exam.controller';
import { CreateExamUseCase } from './use-cases/create-exam.use-case';
import { CreateReportUseCase } from './use-cases/create-report.use-case';
import { ListExamsUseCase } from './use-cases/list-exams.use-case';

describe('ExamController', () => {
  let examController: ExamController;
  let createExamUseCase: CreateExamUseCase;
  let createReportUseCase: CreateReportUseCase;
  let listExamsUseCase: ListExamsUseCase;

  beforeEach(async () => {
    const mockCreateExamUseCase = {
      execute: jest.fn(),
    };

    const mockCreateReportUseCase = {
      execute: jest.fn(),
    };

    const mockListExamsUseCase = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamController],
      providers: [
        {
          provide: CreateExamUseCase,
          useValue: mockCreateExamUseCase,
        },
        {
          provide: CreateReportUseCase,
          useValue: mockCreateReportUseCase,
        },
        {
          provide: ListExamsUseCase,
          useValue: mockListExamsUseCase,
        },
      ],
    }).compile();

    examController = module.get<ExamController>(ExamController);
    createExamUseCase = module.get<CreateExamUseCase>(CreateExamUseCase);
    createReportUseCase = module.get<CreateReportUseCase>(CreateReportUseCase);
    listExamsUseCase = module.get<ListExamsUseCase>(ListExamsUseCase);
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

  describe('submitReport', () => {
    it('should submit a report for an exam', async () => {
      const examId = 'exam-1';
      const createReportDto = {
        report: 'Exam report content',
      };
      const expectedResult = {
        id: examId,
        status: ExamStatus.REPORTED,
        processingResult: 'Processing completed',
        report: createReportDto.report,
        attendantId: 'attendant-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(createReportUseCase, 'execute')
        .mockResolvedValue(expectedResult);

      const result = await examController.submitReport(examId, createReportDto);

      expect(createReportUseCase.execute).toHaveBeenCalledWith(
        examId,
        createReportDto,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('list', () => {
    it('should list exams', async () => {
      const user = {
        id: '1',
        email: 'attendant@test.com',
        role: Role.ATTENDANT,
      };
      const expectedExams = [
        {
          id: 'exam-1',
          status: ExamStatus.DONE,
          processingResult: 'Processing completed',
          report: null,
          attendantId: 'attendant-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(listExamsUseCase, 'execute').mockResolvedValue(expectedExams);

      const result = await examController.list(user);

      expect(listExamsUseCase.execute).toHaveBeenCalledWith(user.role);
      expect(result).toEqual(expectedExams);
    });
  });
});
