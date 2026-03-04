import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { AuthService } from './modules/auth/auth.service';
import { TaskModule } from './modules/task/task.module';
import { PrismaService } from './prisma.service';
import { UsersService } from './user.service';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, TaskModule],
  providers: [AuthService, PrismaService, UsersService],
})
export class AppModule { }
