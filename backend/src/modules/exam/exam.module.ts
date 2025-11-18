import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { CreateExamUseCase } from './use-cases/create-exam.use-case';
import { RabbitMQService } from './services/rabbitmq.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, ConfigModule],
  controllers: [ExamController],
  providers: [ExamService, CreateExamUseCase, RabbitMQService],
  exports: [ExamService],
})
export class ExamModule {}
