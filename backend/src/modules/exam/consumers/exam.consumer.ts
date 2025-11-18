import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ExamStatus } from '@prisma/client';
import { ExamService } from 'src/modules/exam/exam.service';
import { RabbitMQService } from 'src/modules/exam/services/rabbitmq.service';

type ExamProcessingMessage = {
  examId: string;
};

@Injectable()
export class ExamConsumer implements OnModuleInit {
  private readonly logger = new Logger(ExamConsumer.name);
  private readonly queueName = 'exam_processing_queue';

  constructor(
    private readonly examService: ExamService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.rabbitMQService.waitForConnection();
    await this.startConsuming();
  }

  private async startConsuming(): Promise<void> {
    await this.rabbitMQService.consume(
      this.queueName,
      async (message: ExamProcessingMessage) => {
        await this.processExam(message);
      },
    );
  }

  private async processExam(message: ExamProcessingMessage): Promise<void> {
    const { examId } = message;

    try {
      this.logger.log(`Processing exam ${examId}`);

      await this.examService.update({
        where: { id: examId },
        data: { status: ExamStatus.PROCESSING },
      });

      const processingDuration = this.getRandomDuration();
      this.logger.debug(
        `Exam ${examId} will be processed in ${processingDuration}ms`,
      );

      await new Promise((resolve) => setTimeout(resolve, processingDuration));

      const isSuccess = Math.random() > 0.5;

      if (isSuccess) {
        await this.handleSuccess(examId);
      } else {
        await this.handleError(examId);
      }
    } catch (error) {
      this.logger.error(`Error processing exam ${examId}`, error);
      throw error;
    }
  }

  private async handleSuccess(examId: string): Promise<void> {
    const processingResult = `Exam processed successfully at ${new Date().toISOString()}`;

    await this.examService.update({
      where: { id: examId },
      data: {
        status: ExamStatus.DONE,
        processingResult,
      },
    });

    this.logger.log(`Exam ${examId} processed successfully`);
  }

  private async handleError(examId: string): Promise<void> {
    const errorMessage = `Processing failed: Error occurred during exam processing at ${new Date().toISOString()}`;

    await this.examService.update({
      where: { id: examId },
      data: {
        status: ExamStatus.ERROR,
        processingResult: errorMessage,
      },
    });

    this.logger.warn(`Exam ${examId} processing failed`);
  }

  private getRandomDuration(): number {
    const minDuration = 1000;
    const maxDuration = 5000;
    return (
      Math.floor(Math.random() * (maxDuration - minDuration + 1)) + minDuration
    );
  }
}
