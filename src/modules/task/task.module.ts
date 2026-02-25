import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { pgProvider } from '../../common/providers/pg.providers';

@Module({
  controllers: [TaskController],
  providers: [TaskService, pgProvider[0]],
})
export class TaskModule {}