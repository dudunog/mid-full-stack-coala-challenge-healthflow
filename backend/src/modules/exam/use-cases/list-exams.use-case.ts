import { Injectable } from '@nestjs/common';
import { Role, ExamStatus } from '@prisma/client';
import { ExamService } from 'src/modules/exam/exam.service';

@Injectable()
export class ListExamsUseCase {
  constructor(private readonly examService: ExamService) {}

  async execute(userRole: Role) {
    if (userRole === Role.ATTENDANT) {
      return this.examService.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }

    if (userRole === Role.DOCTOR) {
      return this.examService.findMany({
        where: { status: ExamStatus.DONE },
        orderBy: { createdAt: 'desc' },
      });
    }

    return [];
  }
}
