import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { CreateExamUseCase } from './use-cases/create-exam.use-case';
import { CreateReportUseCase } from './use-cases/create-report.use-case';
import { ListExamsUseCase } from './use-cases/list-exams.use-case';
import { RabbitMQService } from './services/rabbitmq.service';
import { ExamConsumer } from './consumers/exam.consumer';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, ConfigModule],
  controllers: [ExamController],
  providers: [
    ExamService,
    CreateExamUseCase,
    CreateReportUseCase,
    ListExamsUseCase,
    RabbitMQService,
    ExamConsumer,
  ],
  exports: [ExamService],
})
export class ExamModule {}
