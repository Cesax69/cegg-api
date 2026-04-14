import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put, UseGuards, Req } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from '../auth/dto/create-task.dto';
import { UpdateTaskDto } from '../auth/dto/update.task.dto';
import { Task } from '../auth/entities/task.entity';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('api/task')
@UseGuards(AuthGuard)
@ApiTags('Tareas')
export class TaskController {
  constructor(private readonly taskSvc: TaskService) { }

  @Get()
  public async getTask(@Req() request: any): Promise<Task[]> {
    return await this.taskSvc.getTasks(request.user.id);
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(1) 
  public async getAllTasks(): Promise<Task[]> {
    return await this.taskSvc.getAllTasks();
  }

  @Get(':id')
  public async getTaskById(@Param("id", ParseIntPipe) id: number, @Req() request: any): Promise<Task> {
    const result = await this.taskSvc.getTaskById(id, request.user.id);
  
    if(result == undefined){
        throw new HttpException(`Tarea con ID ${id} no encontrada`, HttpStatus.NOT_FOUND);   
    }
    return result;
  }

  @Post()
  @ApiProperty({ description: "Insertar una nueva tarea para sí mismo" })
  public async insertTask(@Body() task: CreateTaskDto, @Req() request: any): Promise<Task> {
    const user = request['user'];
    task.user_id = user.id; // Forzado, un usuario normal no puede asignar a otros
    const result = await this.taskSvc.insertTasks(task);

    if (result == undefined)
        throw new HttpException("Tarea no registrada", HttpStatus.INTERNAL_SERVER_ERROR); 

    return result;
  }

  @Post('assign')
  @UseGuards(RolesGuard)
  @Roles(1) 
  @ApiProperty({ description: "Asignar tarea a un usuario específico (Solo Admin)" })
  public async assignTaskToUser(@Body() task: CreateTaskDto): Promise<Task> {
    if (!task.user_id) {
        throw new HttpException("user_id es requerido para asignar tareas", HttpStatus.BAD_REQUEST);
    }
    const result = await this.taskSvc.insertTasks(task);

    if (result == undefined)
        throw new HttpException("Tarea no asignada", HttpStatus.INTERNAL_SERVER_ERROR); 

    return result;
  }

  @Put(":id")
  public updateTask(@Param("id", ParseIntPipe) id: number, @Body() task: UpdateTaskDto, @Req() request: any): Promise<Task> {
    return this.taskSvc.updateTask(id, request.user.id, task, request.user.rol_id);
  }

  @Delete(':id')
  public async deleteTask(@Param("id", ParseIntPipe) id: number, @Req() request: any): Promise<boolean> {
    try {
      await this.taskSvc.deleteTask(id, request.user.id, request.user.rol_id);
    } catch (error) {
      throw new HttpException("Task not found", HttpStatus.NOT_FOUND);
    }
    return true;
  }
}