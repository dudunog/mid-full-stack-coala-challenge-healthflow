import { Injectable } from '@nestjs/common';
import { ExamStatus } from '@prisma/client';
import { ExamService } from 'src/modules/exam/exam.service';
import { RabbitMQService } from 'src/modules/exam/services/rabbitmq.service';

@Injectable()
export class CreateExamUseCase {
  constructor(
    private readonly examService: ExamService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async execute(attendantId: string) {
    const exam = await this.examService.create({
      data: {
        status: ExamStatus.PENDING,
        attendant: {
          connect: { id: attendantId },
        },
      },
    });

    await this.rabbitMQService.publishExamId(exam.id);

    return exam;
  }
}
