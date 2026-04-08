import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {

    constructor(
        private prisma: PrismaService,
    ) { }

    async getUserByUsername(username: string): Promise<User | null> {
        const result = await this.prisma.user.findFirst({
            where: { username },
            select: {
                id: true,
                name: true,
                lastname: true,
                username: false,
                password: true,
                createdAt: true,
                rol_id: true,
            }
        })
        return result as User | null;
    }

    public async getUserById(id: number): Promise<User | null> {
        return await this.prisma.user.findFirst({
            where: { id }
        })
    }

    public async updateHash(user_id: number, hash: string | null): Promise<User> {
        return await this.prisma.user.update({
            where: { id: user_id },
            data: { hash }
        })
    }

    async saveRefreshToken(user_id: number, refreshToken: string): Promise<void> {
        await this.prisma.user.update({
            where: { id: user_id },
            data: { refreshToken: refreshToken },
        });
    }
}
