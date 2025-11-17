import { Module } from '@nestjs/common';
import { PrismaService } from 'src/modules/database/services/prisma/prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
