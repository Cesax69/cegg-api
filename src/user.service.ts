import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User, Prisma, Task } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async user(
        userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    ): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: userWhereUniqueInput,
        });
    }

    async users(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.UserWhereUniqueInput;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }): Promise<User[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.user.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    public async getUser(): Promise<User[]> {
        const user = await this.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                lastname: true,
                username: true,
                password: false,
                createdAt: true,
            },
        });
        return user as User[];
    }

    public async getUserByUsername(username: string): Promise<User[]> {
        const user = await this.prisma.user.findMany({
            where: { username },
            select: {
                id: true,
                name: true,
                email: true,
                lastname: true,
                username: true,
                password: false,
                createdAt: true,
            },
        });
        return user as User[];
    }

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({
            data,
        });
    }


    async updateUser(params: {
        where: Prisma.UserWhereUniqueInput;
        data: Prisma.UserUpdateInput;
    }): Promise<User> {
        const { where, data } = params;
        const updatedUser = await this.prisma.user.update({
            data,
            where,
            select: {
                id: true,
                name: true,
                email: true,
                lastname: true,
                username: true,
                password: false,
                createdAt: true,
            },
        });
        return updatedUser as User;
    }

    public async getTaskByUser(id: number): Promise<Task[]> {
        const task = await this.prisma.task.findMany({
            where: {
                user_id: id,
            },
        });
        return task;
    }

    async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
        return this.prisma.user.delete({
            where,
        });
    }
}
