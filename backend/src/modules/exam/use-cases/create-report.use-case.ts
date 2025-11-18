import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ExamStatus } from '@prisma/client';
import { ExamService } from 'src/modules/exam/exam.service';
import { CreateReportDto } from 'src/modules/exam/dtos/create-report.dto';

@Injectable()
export class CreateReportUseCase {
  constructor(private readonly examService: ExamService) {}

  async execute(examId: string, createReportDto: CreateReportDto) {
    const exam = await this.examService.findUnique({
      where: { id: examId },
    });

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    if (exam.status !== ExamStatus.DONE) {
      throw new BadRequestException(
        'A report can only be added to an exam with status DONE',
      );
    }

    const updatedExam = await this.examService.update({
      where: { id: examId },
      data: {
        report: createReportDto.report,
        status: ExamStatus.REPORTED,
      },
    });

    return updatedExam;
  }
}
