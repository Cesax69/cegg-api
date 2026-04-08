import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService) { }

    public async getUsers(): Promise<User[]> {
        const users = await this.prisma.user.findMany();
        return users;
    }

    async getUserById(id: number): Promise<User | null> {
        const user = await this.prisma.user.findUnique({ where: { id } });
        return user;
    }

    async insertUser(user: CreateUserDto): Promise<any> {
        const newUser = await this.prisma.user.create({
            data: {
                email: user.email,
                name: user.name,
                password: user.password,
                username: user.username,
                lastname: user.lastname,
                rol_id: 2 // Por defecto: Usuario normal
            },
        });
        return newUser;
    }

    async updateUser(id: number, userUpdate: UpdateUserDto): Promise<any> {
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: { ...userUpdate },
        });
        return updatedUser;
    }

    async deleteUser(id: number): Promise<any> {
        const deletedUser = await this.prisma.user.delete({ where: { id } });
        return deletedUser;
    }
}
