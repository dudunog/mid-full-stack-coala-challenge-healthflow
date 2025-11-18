import { Role, ExamStatus } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { ExamService } from 'src/modules/exam/exam.service';
import { ListExamsUseCase } from './list-exams.use-case';

describe('ListExamsUseCase', () => {
  let listExamsUseCase: ListExamsUseCase;
  let examService: ExamService;

  beforeEach(async () => {
    const mockExamService = {
      findMany: jest.fn(),
    };

    const app: TestingModule = await Test.createTestingModule({
      providers: [
        ListExamsUseCase,
        {
          provide: ExamService,
          useValue: mockExamService,
        },
      ],
    }).compile();

    listExamsUseCase = app.get<ListExamsUseCase>(ListExamsUseCase);
    examService = app.get<ExamService>(ExamService);

    jest.clearAllMocks();
  });

  describe('execute', () => {
    const mockExams = [
      {
        id: 'exam-1',
        status: ExamStatus.DONE,
        processingResult: 'Processing completed',
        report: null,
        attendantId: 'attendant-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'exam-2',
        status: ExamStatus.PENDING,
        processingResult: null,
        report: null,
        attendantId: 'attendant-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    it('should return all exams for ATTENDANT role', async () => {
      jest.spyOn(examService, 'findMany').mockResolvedValue(mockExams);

      const result = await listExamsUseCase.execute(Role.ATTENDANT);

      expect(examService.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockExams);
    });

    it('should return only DONE exams for DOCTOR role', async () => {
      const doneExams = [mockExams[0]];
      jest.spyOn(examService, 'findMany').mockResolvedValue(doneExams);

      const result = await listExamsUseCase.execute(Role.DOCTOR);

      expect(examService.findMany).toHaveBeenCalledWith({
        where: { status: ExamStatus.DONE },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(doneExams);
    });

    it('should return empty array for unknown role', async () => {
      const result = await listExamsUseCase.execute('UNKNOWN' as Role);

      expect(examService.findMany).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});
