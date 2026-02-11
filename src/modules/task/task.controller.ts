import { Controller, Delete, Get, Param, Post, Put, Body, ParseIntPipe } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from '../auth/dto/create-task.dto';

@Controller('api/task')
export class TaskController {
    constructor(private taskSvc: TaskService) { }

    @Get()
    public getTask(): any[] {
        return this.taskSvc.getTask();
    }

    @Get(":id")
    public getTaskById(@Param("id", ParseIntPipe) id: number, @Body() task: any) {
        console.log(typeof id);
        return this.taskSvc.getTaskById(id);
    }

    @Post()
    public insertTask(@Body() task: CreateTaskDto): string {
        return this.taskSvc.insert(task);
    }

    @Put("/:id")
    public updateTask(@Param("id", ParseIntPipe) id: number, @Body() task: any) {
        return this.taskSvc.update(id, task);
    }

    @Delete("/:id")
    public deleteTask(@Param("id") id: string) {
        return this.taskSvc.delete(parseInt(id));
    }
}
