import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma.service';
import { UtilService } from 'src/common/services/util.service';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [UserController],
    providers: [UserService, PrismaService, UtilService],
})
export class UserModule { }
