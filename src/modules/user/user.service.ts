import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService) { }

    public async getUsers(): Promise<User[]> {
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                lastname: true,
                username: true,
                createdAt: true,
                rol_id: true,
            }
        });
        return users as unknown as User[];
    }

    async getUserById(id: number): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                lastname: true,
                username: true,
                createdAt: true,
                rol_id: true,
            }
        });
        return user as unknown as User | null;
    }

    async insertUser(user: CreateUserDto): Promise<any> {
        const newUser = await this.prisma.user.create({
            data: {
                email: user.email,
                name: user.name,
                password: user.password,
                username: user.username,
                lastname: user.lastname,
                rol_id: 2
            },
            select: {
                id: true,
                email: true,
                name: true,
                lastname: true,
                username: true,
                createdAt: true,
                rol_id: true,
            }
        });
        return newUser;
    }

    async updateUser(id: number, userUpdate: UpdateUserDto): Promise<any> {
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: { ...userUpdate },
            select: {
                id: true,
                email: true,
                name: true,
                lastname: true,
                username: true,
                createdAt: true,
                rol_id: true,
            }
        });
        return updatedUser;
    }

    async deleteUser(id: number): Promise<any> {
        const deletedUser = await this.prisma.user.delete({ where: { id } });
        return deletedUser;
    }
}
