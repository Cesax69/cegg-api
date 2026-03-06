import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from '../auth/dto/create-task.dto';
import { UpdateTaskDto } from '../auth/dto/update.task.dto';
import { Task } from '../auth/entities/task.entity';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

@Controller('api/task')
@ApiTags('Tareas')
export class TaskController {
  constructor(private readonly taskSvc: TaskService) { }

  @Get()
  public async getTask(): Promise<Task[]> {
    return await this.taskSvc.getTasks();
  }

  @Get(':id')
  public async getTaskById(@Param("id", ParseIntPipe) id: number): Promise<Task> {
    const result = await this.taskSvc.getTaskById(id);
    console.log("resultado",result);
  
    if(result == undefined){
        //throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
        throw new HttpException(`Tarea con ID ${id} no encontrada`, HttpStatus.NOT_FOUND);   
    }
    return result;
  }

  @Post()
  @ApiProperty({ description: "Insertar una nueva tarea" })
  public insertTask(@Body() task: CreateTaskDto): Promise<Task> {
    const result = this.taskSvc.insertTasks(task);

    if (result == undefined)
        throw new HttpException("Tarea no registrada", HttpStatus.INTERNAL_SERVER_ERROR); 

    return result;
  }

  @Put(":id")
  public updateTask(@Param("id", ParseIntPipe) id: number,@Body() task: UpdateTaskDto): Promise<Task> {
    return this.taskSvc.updateTask(id, task);
  }

  @Delete(':id')
  public async deleteTask(@Param("id", ParseIntPipe) id: number): Promise<boolean> {
    try {
        await this.taskSvc.deleteTask(id);
    }catch(error){
      throw new HttpException("Task not found", HttpStatus.NOT_FOUND);
    }
    return true;
  }
}