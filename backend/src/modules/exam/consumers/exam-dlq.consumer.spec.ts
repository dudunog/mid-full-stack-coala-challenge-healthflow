import { Test, TestingModule } from '@nestjs/testing';
import { ExamDLQConsumer } from './exam-dlq.consumer';
import { ExamService } from 'src/modules/exam/exam.service';
import { RabbitMQService } from 'src/modules/exam/services/rabbitmq.service';
import { ExamStatus } from '@prisma/client';

describe('ExamDLQConsumer', () => {
  let examDLQConsumer: ExamDLQConsumer;
  let examService: ExamService;
  let rabbitMQService: RabbitMQService;

  beforeEach(async () => {
    const mockExamService = {
      update: jest.fn(),
      findUnique: jest.fn(),
    };

    const mockRabbitMQService = {
      consume: jest.fn(),
      publish: jest.fn(),
      waitForConnection: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamDLQConsumer,
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

    examDLQConsumer = module.get<ExamDLQConsumer>(ExamDLQConsumer);
    examService = module.get<ExamService>(ExamService);
    rabbitMQService = module.get<RabbitMQService>(RabbitMQService);

    jest.clearAllMocks();
  });

  describe('onModuleInit', () => {
    it('should start consuming messages from DLQ', async () => {
      jest.spyOn(rabbitMQService, 'waitForConnection').mockResolvedValue();
      jest.spyOn(rabbitMQService, 'consume').mockResolvedValue();

      await examDLQConsumer.onModuleInit();

      expect(rabbitMQService.waitForConnection).toHaveBeenCalled();
      expect(rabbitMQService.consume).toHaveBeenCalledWith(
        'exam_processing_queue_dlq',
        expect.any(Function) as (message: unknown) => Promise<void>,
      );
    });
  });

  describe('processFailedExam', () => {
    const examId = 'exam-1';
    let consumeCallback: (message: {
      examId: string;
      retryCount?: number;
    }) => Promise<void>;

    beforeEach(() => {
      jest.spyOn(rabbitMQService, 'waitForConnection').mockResolvedValue();
      jest
        .spyOn(rabbitMQService, 'consume')
        .mockImplementation(
          async (
            _queueName: string,
            callback: (message: unknown) => Promise<void>,
          ) => {
            consumeCallback = callback as (message: {
              examId: string;
              retryCount?: number;
            }) => Promise<void>;
          },
        );
    });

    it('should retry exam processing when retry count is below max', async () => {
      const message = { examId, retryCount: 0 };
      const mockExam = {
        id: examId,
        status: ExamStatus.ERROR,
        processingResult: 'Previous error',
        report: null,
        attendantId: 'attendant-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(examService, 'findUnique').mockResolvedValue(mockExam);
      jest.spyOn(examService, 'update').mockResolvedValue({
        ...mockExam,
        status: ExamStatus.PENDING,
      });
      jest.spyOn(rabbitMQService, 'publish').mockResolvedValue();

      await examDLQConsumer.onModuleInit();
      await consumeCallback(message);

      expect(examService.findUnique).toHaveBeenCalledWith({
        where: { id: examId },
      });
      expect(examService.update).toHaveBeenCalledWith({
        where: { id: examId },
        data: { status: ExamStatus.PENDING },
      });
      expect(rabbitMQService.publish).toHaveBeenCalledWith(
        'exam_processing_queue',
        {
          examId,
          retryCount: 1,
        },
      );
    });

    it('should mark exam as permanently failed when max retries reached', async () => {
      const message = { examId, retryCount: 3 };
      const mockExam = {
        id: examId,
        status: ExamStatus.ERROR,
        processingResult: 'Previous error',
        report: null,
        attendantId: 'attendant-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(examService, 'findUnique').mockResolvedValue(mockExam);
      jest.spyOn(examService, 'update').mockResolvedValue({
        ...mockExam,
        status: ExamStatus.ERROR,
        processingResult:
          'Processing permanently failed after 3 retry attempts. Manual intervention required.',
      });

      await examDLQConsumer.onModuleInit();
      await consumeCallback(message);

      expect(examService.update).toHaveBeenCalledWith({
        where: { id: examId },
        data: {
          status: ExamStatus.ERROR,
          processingResult: expect.stringContaining(
            'Processing permanently failed after 3 retry attempts',
          ),
        },
      });
      expect(rabbitMQService.publish).not.toHaveBeenCalled();
    });

    it('should skip retry if exam is already successfully processed', async () => {
      const message = { examId, retryCount: 0 };
      const mockExam = {
        id: examId,
        status: ExamStatus.DONE,
        processingResult: 'Successfully processed',
        report: null,
        attendantId: 'attendant-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(examService, 'findUnique').mockResolvedValue(mockExam);
      jest.spyOn(examService, 'update').mockResolvedValue(mockExam);
      jest.spyOn(rabbitMQService, 'publish').mockResolvedValue();

      await examDLQConsumer.onModuleInit();
      await consumeCallback(message);

      expect(examService.findUnique).toHaveBeenCalledWith({
        where: { id: examId },
      });
      expect(examService.update).not.toHaveBeenCalled();
      expect(rabbitMQService.publish).not.toHaveBeenCalled();
    });

    it('should skip retry if exam is reported', async () => {
      const message = { examId, retryCount: 0 };
      const mockExam = {
        id: examId,
        status: ExamStatus.REPORTED,
        processingResult: 'Successfully processed',
        report: 'Medical report',
        attendantId: 'attendant-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(examService, 'findUnique').mockResolvedValue(mockExam);
      jest.spyOn(examService, 'update').mockResolvedValue(mockExam);
      jest.spyOn(rabbitMQService, 'publish').mockResolvedValue();

      await examDLQConsumer.onModuleInit();
      await consumeCallback(message);

      expect(examService.findUnique).toHaveBeenCalledWith({
        where: { id: examId },
      });
      expect(examService.update).not.toHaveBeenCalled();
      expect(rabbitMQService.publish).not.toHaveBeenCalled();
    });

    it('should handle case when exam is not found', async () => {
      const message = { examId, retryCount: 0 };

      jest.spyOn(examService, 'findUnique').mockResolvedValue(null);
      jest.spyOn(rabbitMQService, 'publish').mockResolvedValue();

      await examDLQConsumer.onModuleInit();
      await consumeCallback(message);

      expect(examService.findUnique).toHaveBeenCalledWith({
        where: { id: examId },
      });
      expect(examService.update).not.toHaveBeenCalled();
      expect(rabbitMQService.publish).not.toHaveBeenCalled();
    });

    it('should throw error when processing fails unexpectedly', async () => {
      const message = { examId, retryCount: 0 };
      const error = new Error('Database error');

      jest.spyOn(examService, 'findUnique').mockRejectedValue(error);

      await examDLQConsumer.onModuleInit();

      await expect(consumeCallback(message)).rejects.toThrow('Database error');
    });
  });
});
