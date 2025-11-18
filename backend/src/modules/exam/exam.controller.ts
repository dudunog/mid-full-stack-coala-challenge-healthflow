import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/modules/user/decorators/current-user.decorator';
import type { CurrentUserPayload } from 'src/modules/user/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import { CreateExamUseCase } from './use-cases/create-exam.use-case';
import { CreateReportUseCase } from './use-cases/create-report.use-case';
import { CreateReportDto } from './dtos/create-report.dto';

@Controller('exams')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExamController {
  constructor(
    private readonly createExamUseCase: CreateExamUseCase,
    private readonly createReportUseCase: CreateReportUseCase,
  ) {}

  @Post('upload')
  @Roles(Role.ATTENDANT)
  async upload(@CurrentUser() user: CurrentUserPayload) {
    return this.createExamUseCase.execute(user.id);
  }

  @Post(':id/report')
  @Roles(Role.DOCTOR)
  async submitReport(
    @Param('id') examId: string,
    @Body() createReportDto: CreateReportDto,
  ) {
    return this.createReportUseCase.execute(examId, createReportDto);
  }
}
