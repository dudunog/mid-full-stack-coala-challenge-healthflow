import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { CreateExamUseCase } from './use-cases/create-exam.use-case';
import { RabbitMQService } from './services/rabbitmq.service';
import { ExamConsumer } from './consumers/exam.consumer';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, ConfigModule],
  controllers: [ExamController],
  providers: [ExamService, CreateExamUseCase, RabbitMQService, ExamConsumer],
  exports: [ExamService],
})
export class ExamModule {}
