import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ExamModule } from './modules/exam/exam.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, AuthModule, ExamModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
