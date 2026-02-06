import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { AuthService } from './modules/auth/auth.service';
import { TaskModule } from './modules/task/task.module';

@Module({
  imports: [AuthModule, TaskModule],
  providers: [AuthService],
})
export class AppModule { }
