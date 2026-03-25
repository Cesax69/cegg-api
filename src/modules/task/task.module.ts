import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { pgProvider } from '../../common/providers/pg.providers';
import { PrismaService } from 'src/prisma.service';
import { AuthGuard } from '../auth/auth.guard';

@Module({
  controllers: [TaskController],
  providers: [TaskService, pgProvider[0], PrismaService, AuthGuard],
})
export class TaskModule { }