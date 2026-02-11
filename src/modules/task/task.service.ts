import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from '../auth/dto/create-task.dto';

@Injectable()
export class TaskService {

    private tasks: any[] = [];

    public getTask(): any[] {
        return this.tasks;
    }

    public getTaskById(id: number): string {
        var task = this.tasks.find(x => x.id == id);
        return task;
    }

    public insert(task: CreateTaskDto): any {
        var id = this.tasks.length +1;
        var insertedTask= this.tasks.push({
            ...task,
            id
        });

        return this.tasks[insertedTask-1];
    }

    public update(id: number, task: any) {
        const tasksupdate = this.tasks.map(t => {
            if(t.id == id){
                
                if(task.name) t.name = task.name; 
                if(task.description) t.description = task.description; 
                if(task.priority) t.priority = task.priority; 
             return t;
            }
            return t;
        });
        return tasksupdate;
    }

    public delete(id: number): string {
        const array = this.tasks.filter(x => x.id != id);
        this.tasks = array;
        return "Tarea eliminada";
    }
}
