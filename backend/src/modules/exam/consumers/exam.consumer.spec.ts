import { Test, TestingModule } from '@nestjs/testing';
import { ExamConsumer } from './exam.consumer';
import { ExamService } from '../exam.service';
import { RabbitMQService } from '../services/rabbitmq.service';
import { ExamStatus } from '@prisma/client';

describe('ExamConsumer', () => {
  let examConsumer: ExamConsumer;
  let examService: ExamService;
  let rabbitMQService: RabbitMQService;

  beforeEach(async () => {
    const mockExamService = {
      update: jest.fn(),
    };

    const mockRabbitMQService = {
      consume: jest.fn(),
      waitForConnection: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamConsumer,
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

    examConsumer = module.get<ExamConsumer>(ExamConsumer);
    examService = module.get<ExamService>(ExamService);
    rabbitMQService = module.get<RabbitMQService>(RabbitMQService);

    jest.clearAllMocks();
  });

  describe('onModuleInit', () => {
    it('should start consuming messages', async () => {
      jest.spyOn(rabbitMQService, 'waitForConnection').mockResolvedValue();
      jest.spyOn(rabbitMQService, 'consume').mockResolvedValue();

      await examConsumer.onModuleInit();

      expect(rabbitMQService.waitForConnection).toHaveBeenCalled();
      expect(rabbitMQService.consume).toHaveBeenCalledWith(
        'exam_processing_queue',
        expect.any(Function) as (message: unknown) => Promise<void>,
      );
    });
  });

  describe('processExam', () => {
    const examId = 'exam-1';
    const message = { examId };
    let consumeCallback: (message: { examId: string }) => Promise<void>;

    beforeEach(() => {
      jest.useFakeTimers();
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
            }) => Promise<void>;
          },
        );
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should process exam successfully', async () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.7);
      jest
        .spyOn(examService, 'update')
        .mockResolvedValueOnce({
          id: examId,
          status: ExamStatus.PROCESSING,
          processingResult: null,
          report: null,
          attendantId: 'attendant-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .mockResolvedValueOnce({
          id: examId,
          status: ExamStatus.DONE,
          processingResult: 'Exam processed successfully',
          report: null,
          attendantId: 'attendant-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        });

      await examConsumer.onModuleInit();

      const processPromise = consumeCallback(message);
      await Promise.resolve();

      expect(examService.update).toHaveBeenCalledTimes(1);
      expect(examService.update).toHaveBeenNthCalledWith(1, {
        where: { id: examId },
        data: { status: ExamStatus.PROCESSING },
      });

      jest.advanceTimersByTime(1000);
      await Promise.resolve();

      expect(examService.update).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(5000);
      await processPromise;

      expect(examService.update).toHaveBeenCalledTimes(2);
      expect(examService.update).toHaveBeenNthCalledWith(2, {
        where: { id: examId },
        data: {
          status: ExamStatus.DONE,
          processingResult: expect.stringContaining(
            'Exam processed successfully',
          ),
        },
      });
    });

    it('should process exam with error', async () => {
      jest.spyOn(Math, 'random').mockReturnValue(0.3);
      jest
        .spyOn(examService, 'update')
        .mockResolvedValueOnce({
          id: examId,
          status: ExamStatus.PROCESSING,
          processingResult: null,
          report: null,
          attendantId: 'attendant-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .mockResolvedValueOnce({
          id: examId,
          status: ExamStatus.ERROR,
          processingResult: 'Processing failed',
          report: null,
          attendantId: 'attendant-1',
          createdAt: new Date(),
          updatedAt: new Date(),
        });

      await examConsumer.onModuleInit();

      const processPromise = consumeCallback(message);
      await Promise.resolve();
      jest.advanceTimersByTime(5000);
      await processPromise;

      expect(examService.update).toHaveBeenCalledTimes(2);
      expect(examService.update).toHaveBeenNthCalledWith(1, {
        where: { id: examId },
        data: { status: ExamStatus.PROCESSING },
      });
      expect(examService.update).toHaveBeenNthCalledWith(2, {
        where: { id: examId },
        data: {
          status: ExamStatus.ERROR,
          processingResult: expect.stringContaining('Processing failed'),
        },
      });
    });
  });
});
