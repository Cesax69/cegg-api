import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { AuthService } from './modules/auth/auth.service';
import { TaskModule } from './modules/task/task.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, TaskModule],
  providers: [AuthService],
})
export class AppModule { }
