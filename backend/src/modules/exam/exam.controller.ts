import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/modules/user/decorators/current-user.decorator';
import type { CurrentUserPayload } from 'src/modules/user/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import { CreateExamUseCase } from './use-cases/create-exam.use-case';

@Controller('exams')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExamController {
  constructor(private readonly createExamUseCase: CreateExamUseCase) {}

  @Post('upload')
  @Roles(Role.ATTENDANT)
  async upload(@CurrentUser() user: CurrentUserPayload) {
    return this.createExamUseCase.execute(user.id);
  }
}
