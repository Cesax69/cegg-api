import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskService {

    public getTask() {
        return 'Lista de tareas';
    }

    public getTaskById(id: number) {
        return `Tarea ${id}`;
    }

    public insert(task: any): string {
        return task;
    }

    public update(id: number, task: any) {
        return task;
    }

    public delete(id: number) {
        return `Tarea ${id} eliminada`;
    }
}
