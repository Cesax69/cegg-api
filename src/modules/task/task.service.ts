import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskService {
    findAll(): string {
        return 'Lista de tareas';
    }
}
