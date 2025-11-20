import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/modules/database/services/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  findUnique(params: {
    where: Prisma.UserWhereUniqueInput;
    include?: Prisma.UserInclude;
    select?: Prisma.UserSelect;
  }) {
    const { where, include, select } = params;

    if (include) {
      return this.prisma.user.findUnique({
        where,
        include,
      });
    }

    return this.prisma.user.findUnique({
      where,
      select,
    });
  }

  findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
    include?: Prisma.UserInclude;
  }) {
    const { skip, take, cursor, where, orderBy, include } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
    });
  }

  count(params: { where?: Prisma.UserWhereInput }) {
    const { where } = params;
    return this.prisma.user.count({
      where,
    });
  }

  async create(params: {
    data: Prisma.UserCreateInput;
    include?: Prisma.UserInclude;
  }) {
    const { data, include } = params;
    const newUser = await this.prisma.user.create({
      data,
      include,
    });

    return newUser;
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
    include?: Prisma.UserInclude;
    select?: Prisma.UserSelect;
  }) {
    const { where, data, include, select } = params;

    if (include) {
      return this.prisma.user.update({
        data,
        where,
        include,
      });
    }

    return this.prisma.user.update({
      data,
      where,
      select,
    });
  }

  async delete(params: { where: Prisma.UserWhereUniqueInput }) {
    const { where } = params;
    return this.prisma.user.delete({
      where,
    });
  }
}
