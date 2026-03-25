import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from '../auth/dto/create-task.dto';
import { UpdateTaskDto } from '../auth/dto/update.task.dto';
import { PrismaService } from 'src/prisma.service';
import { Task } from '../auth/entities/task.entity';

@Injectable()
export class TaskService {

    constructor(
        @Inject('PG_CONNECTION') private db: any,
        private prisma: PrismaService) { }

    private tasks: any[] = [];

    public async getTasks(user_id: number): Promise<Task[]> {
        const tasks = await this.prisma.task.findMany({ 
            where: { 
                user_id: user_id 
            } 
        });
        return tasks;
    }
    

    async getTaskById(id: number, user_id): Promise<Task | null> {
        const task = await this.prisma.task.findUnique({
             where: { 
                id, user_id } });
        return task;
    }
    async insertTasks(task: CreateTaskDto): Promise<any> {
        const newTask = await this.prisma.task.create({
            data: {
                name: task.name!,
                description: task.description,
                priority: task.priority,
                user_id: task.user_id,
            },
        });
        return newTask;
    }

    async updateTask(id: number, user_id: number, taskUpdate: UpdateTaskDto): Promise<any> {
        const updatedTask = await this.prisma.task.update({
            where: { id, user_id },
            data: { ...taskUpdate },
        });
        return updatedTask;
    }

    async deleteTask(id: number, user_id: number): Promise<any> {
        const deletedTask = await this.prisma.task.delete({ 
            where: { 
                id, 
                user_id 
            } 
        });
        return deletedTask;
    }
}