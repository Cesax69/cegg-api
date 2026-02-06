import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { AuthService } from './modules/auth/auth.service';

@Module({
  imports: [AuthModule],
  providers: [AuthService],
})
export class AppModule {}
