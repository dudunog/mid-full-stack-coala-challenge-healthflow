import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ExamStatus } from '@prisma/client';
import { ExamService } from 'src/modules/exam/exam.service';
import { RabbitMQService } from 'src/modules/exam/services/rabbitmq.service';

type ExamProcessingMessage = {
  examId: string;
  retryCount?: number;
};

@Injectable()
export class ExamDLQConsumer implements OnModuleInit {
  private readonly logger = new Logger(ExamDLQConsumer.name);
  private readonly dlqName = 'exam_processing_queue_dlq';
  private readonly maxRetries = 3;

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
      this.dlqName,
      async (message: ExamProcessingMessage) => {
        await this.processFailedExam(message);
      },
    );
  }

  private async processFailedExam(
    message: ExamProcessingMessage,
  ): Promise<void> {
    const { examId, retryCount = 0 } = message;

    try {
      this.logger.warn(
        `Processing failed exam ${examId} from DLQ (attempt ${retryCount + 1}/${this.maxRetries})`,
      );

      if (retryCount >= this.maxRetries) {
        await this.markExamAsPermanentlyFailed(examId);
        return;
      }

      const exam = await this.examService.findUnique({ where: { id: examId } });

      if (!exam) {
        this.logger.error(`Exam ${examId} not found in database`);
        return;
      }

      if (
        exam.status === ExamStatus.DONE ||
        exam.status === ExamStatus.REPORTED
      ) {
        this.logger.log(
          `Exam ${examId} already processed successfully, skipping retry`,
        );
        return;
      }

      await this.retryExamProcessing(examId, retryCount);
    } catch (error) {
      this.logger.error(
        `Error processing failed exam ${examId} from DLQ`,
        error,
      );
      throw error;
    }
  }

  private async retryExamProcessing(
    examId: string,
    retryCount: number,
  ): Promise<void> {
    try {
      await this.examService.update({
        where: { id: examId },
        data: { status: ExamStatus.PENDING },
      });

      await this.rabbitMQService.publish('exam_processing_queue', {
        examId,
        retryCount: retryCount + 1,
      });

      this.logger.log(
        `Exam ${examId} re-queued for processing (retry ${retryCount + 1})`,
      );
    } catch (error) {
      this.logger.error(`Failed to retry exam ${examId}`, error);
      throw error;
    }
  }

  private async markExamAsPermanentlyFailed(examId: string): Promise<void> {
    const errorMessage = `Processing permanently failed after ${this.maxRetries} retry attempts.`;

    await this.examService.update({
      where: { id: examId },
      data: {
        status: ExamStatus.ERROR,
        processingResult: errorMessage,
      },
    });

    this.logger.error(
      `Exam ${examId} marked as permanently failed after ${this.maxRetries} retries`,
    );
  }
}
