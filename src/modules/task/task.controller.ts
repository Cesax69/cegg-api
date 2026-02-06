import { Controller, Delete, Get, Param, Post, Put, Body } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('api/task')
export class TaskController {
    constructor(private taskSvc: TaskService) { }

    @Get()
    public getTask(): string {
        return this.taskSvc.getTask();
    }

    @Get(":id")
    public getTaskById(@Param("id") id):string {
        return this.taskSvc.getTaskById(parseInt(id));
    }

    @Post()
    public insertTask(@Body() task: any) {
        return this.taskSvc.insert(task);
    }

    @Put("/:id")
    public updateTask(@Param("id") id: string, @Body() task: any) {
        return this.taskSvc.update(parseInt(id), task);
    }

    @Delete("/:id")
    public deleteTask(@Param("id") id: string) {
        return this.taskSvc.delete(parseInt(id));
    }
}
