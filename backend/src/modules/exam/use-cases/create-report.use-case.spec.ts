import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateReportUseCase } from './create-report.use-case';
import { ExamService } from 'src/modules/exam/exam.service';
import { CreateReportDto } from 'src/modules/exam/dtos/create-report.dto';
import { ExamStatus } from '@prisma/client';

describe('CreateReportUseCase', () => {
  let createReportUseCase: CreateReportUseCase;
  let examService: ExamService;

  beforeEach(async () => {
    const mockExamService = {
      findUnique: jest.fn(),
      update: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        CreateReportUseCase,
        {
          provide: ExamService,
          useValue: mockExamService,
        },
      ],
    }).compile();

    createReportUseCase = app.get<CreateReportUseCase>(CreateReportUseCase);
    examService = app.get<ExamService>(ExamService);

    jest.clearAllMocks();
  });

  describe('execute', () => {
    const examId = 'exam-1';
    const createReportDto: CreateReportDto = {
      report: 'Exam report content',
    };

    it('should throw NotFoundException when exam not found', async () => {
      jest.spyOn(examService, 'findUnique').mockResolvedValue(null);

      await expect(
        createReportUseCase.execute(examId, createReportDto),
      ).rejects.toThrow(NotFoundException);
      expect(examService.findUnique).toHaveBeenCalledWith({
        where: { id: examId },
      });
      expect(examService.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when exam is not processed', async () => {
      const exam = {
        id: examId,
        status: ExamStatus.PENDING,
        processingResult: null,
        report: null,
        attendantId: 'attendant-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(examService, 'findUnique').mockResolvedValue(exam);

      await expect(
        createReportUseCase.execute(examId, createReportDto),
      ).rejects.toThrow(BadRequestException);
      expect(examService.findUnique).toHaveBeenCalledWith({
        where: { id: examId },
      });
      expect(examService.update).not.toHaveBeenCalled();
    });

    it('should create report successfully', async () => {
      const exam = {
        id: examId,
        status: ExamStatus.DONE,
        processingResult: 'Processing completed',
        report: null,
        attendantId: 'attendant-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedExam = {
        ...exam,
        report: createReportDto.report,
        status: ExamStatus.REPORTED,
      };

      jest.spyOn(examService, 'findUnique').mockResolvedValue(exam);
      jest.spyOn(examService, 'update').mockResolvedValue(updatedExam);

      const result = await createReportUseCase.execute(examId, createReportDto);

      expect(examService.findUnique).toHaveBeenCalledWith({
        where: { id: examId },
      });
      expect(examService.update).toHaveBeenCalledWith({
        where: { id: examId },
        data: {
          report: createReportDto.report,
          status: ExamStatus.REPORTED,
        },
      });
      expect(result).toEqual(updatedExam);
      expect(result.status).toBe(ExamStatus.REPORTED);
      expect(result.report).toBe(createReportDto.report);
    });
  });
});
