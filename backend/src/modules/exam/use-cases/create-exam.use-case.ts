import { Injectable } from '@nestjs/common';
import { ExamStatus } from '@prisma/client';
import { ExamService } from 'src/modules/exam/exam.service';
import { RabbitMQService } from 'src/modules/exam/services/rabbitmq.service';

@Injectable()
export class CreateExamUseCase {
  private readonly queueName = 'exam_processing_queue';
  private readonly dlqName = 'exam_processing_queue_dlq';

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

    await this.rabbitMQService.publish(
      this.queueName,
      { examId: exam.id },
      {
        dlqName: this.dlqName,
      },
    );

    return exam;
  }
}
