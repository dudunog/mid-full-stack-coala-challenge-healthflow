import { Test, TestingModule } from '@nestjs/testing';
import { CreateExamUseCase } from './create-exam.use-case';
import { ExamService } from 'src/modules/exam/exam.service';
import { RabbitMQService } from 'src/modules/exam/services/rabbitmq.service';
import { ExamStatus } from '@prisma/client';

describe('CreateExamUseCase', () => {
  let createExamUseCase: CreateExamUseCase;
  let examService: ExamService;
  let rabbitMQService: RabbitMQService;

  beforeEach(async () => {
    const mockExamService = {
      create: jest.fn(),
    };

    const mockRabbitMQService = {
      publish: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        CreateExamUseCase,
        {
          provide: ExamService,
          useValue: mockExamService,
        },
        {
          provide: RabbitMQService,
          useValue: mockRabbitMQService,
        },
      ],
    }).compile();

    createExamUseCase = app.get<CreateExamUseCase>(CreateExamUseCase);
    examService = app.get<ExamService>(ExamService);
    rabbitMQService = app.get<RabbitMQService>(RabbitMQService);

    jest.clearAllMocks();
  });

  describe('execute', () => {
    const attendantId = 'attendant-1';

    it('should create an exam', async () => {
      const createdExam = {
        id: 'exam-1',
        status: ExamStatus.PENDING,
        processingResult: null,
        report: null,
        attendantId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(examService, 'create').mockResolvedValue(createdExam);
      jest.spyOn(rabbitMQService, 'publish').mockResolvedValue();

      const result = await createExamUseCase.execute(attendantId);

      expect(examService.create).toHaveBeenCalledWith({
        data: {
          status: ExamStatus.PENDING,
          attendant: {
            connect: { id: attendantId },
          },
        },
      });
      expect(result).toEqual(createdExam);
      expect(result.status).toBe(ExamStatus.PENDING);
    });

    it('should publish exam ID to RabbitMQ after creating exam', async () => {
      const createdExam = {
        id: 'exam-1',
        status: ExamStatus.PENDING,
        processingResult: null,
        report: null,
        attendantId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(examService, 'create').mockResolvedValue(createdExam);
      jest.spyOn(rabbitMQService, 'publish').mockResolvedValue();

      await createExamUseCase.execute(attendantId);

      expect(rabbitMQService.publish).toHaveBeenCalledWith(
        'exam_processing_queue',
        { examId: createdExam.id },
      );
      expect(rabbitMQService.publish).toHaveBeenCalledTimes(1);
    });
  });
});
