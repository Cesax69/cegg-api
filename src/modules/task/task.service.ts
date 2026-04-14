import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from '../auth/dto/create-task.dto';
import { UpdateTaskDto } from '../auth/dto/update.task.dto';
import { PrismaService } from 'src/prisma.service';
import { Task } from '../auth/entities/task.entity';

@Injectable()
export class TaskService {

    constructor(private prisma: PrismaService) { }

    public async getTasks(user_id: number): Promise<Task[]> {
        const tasks = await this.prisma.task.findMany({ 
            where: { 
                user_id: user_id 
            } 
        });
        return tasks;
    }

    public async getAllTasks(): Promise<Task[]> {
        const tasks = await this.prisma.task.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        lastname: true,
                        email: true
                    }
                }
            }
        });
        return tasks;
    }

    async getTaskById(id: number, user_id: number): Promise<Task | null> {
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

    async updateTask(id: number, user_id: number, taskUpdate: UpdateTaskDto, userRol: number = 2): Promise<any> {
        if (userRol !== 1) {
            const existingTask = await this.prisma.task.findUnique({ where: { id } });
            if (!existingTask || existingTask.user_id !== user_id) {
                throw new Error("No tienes acceso a esta tarea");
            }
        }

        const updatedTask = await this.prisma.task.update({
            where: { id },
            data: { ...taskUpdate },
        });
        return updatedTask;
    }

    async deleteTask(id: number, user_id: number, userRol: number = 2): Promise<any> {
        if (userRol !== 1) {
            const existingTask = await this.prisma.task.findUnique({ where: { id } });
            if (!existingTask || existingTask.user_id !== user_id) {
                throw new Error("No tienes acceso a esta tarea");
            }
        }

        const deletedTask = await this.prisma.task.delete({ 
            where: { id }
        });
        return deletedTask;
    }
}