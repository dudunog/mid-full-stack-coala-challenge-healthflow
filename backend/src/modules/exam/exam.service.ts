import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/modules/database/services/prisma/prisma.service';

@Injectable()
export class ExamService {
  constructor(private prisma: PrismaService) {}

  findUnique(params: {
    where: Prisma.MedicalExamWhereUniqueInput;
    include?: Prisma.MedicalExamInclude;
    select?: Prisma.MedicalExamSelect;
  }) {
    const { where, include, select } = params;

    if (include) {
      return this.prisma.medicalExam.findUnique({
        where,
        include,
      });
    }

    return this.prisma.medicalExam.findUnique({
      where,
      select,
    });
  }

  findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.MedicalExamWhereUniqueInput;
    where?: Prisma.MedicalExamWhereInput;
    orderBy?: Prisma.MedicalExamOrderByWithRelationInput;
    include?: Prisma.MedicalExamInclude;
  }) {
    const { skip, take, cursor, where, orderBy, include } = params;
    return this.prisma.medicalExam.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
    });
  }

  count(params: { where?: Prisma.MedicalExamWhereInput }) {
    const { where } = params;
    return this.prisma.medicalExam.count({
      where,
    });
  }

  async create(params: {
    data: Prisma.MedicalExamCreateInput;
    include?: Prisma.MedicalExamInclude;
  }) {
    const { data, include } = params;
    const newExam = await this.prisma.medicalExam.create({
      data,
      include,
    });

    return newExam;
  }

  async update(params: {
    where: Prisma.MedicalExamWhereUniqueInput;
    data: Prisma.MedicalExamUpdateInput;
    include?: Prisma.MedicalExamInclude;
    select?: Prisma.MedicalExamSelect;
  }) {
    const { where, data, include, select } = params;

    if (include) {
      return this.prisma.medicalExam.update({
        data,
        where,
        include,
      });
    }

    return this.prisma.medicalExam.update({
      data,
      where,
      select,
    });
  }

  async delete(params: { where: Prisma.MedicalExamWhereUniqueInput }) {
    const { where } = params;
    return this.prisma.medicalExam.delete({
      where,
    });
  }
}
