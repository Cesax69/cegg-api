import { Inject, Injectable } from '@nestjs/common';
import { CreateTaskDto } from '../auth/dto/create-task.dto';
import { UpdateTaskDto } from '../auth/dto/update.task.dto';

@Injectable()
export class TaskService {

    constructor(@Inject('PG_CONNECTION') private db: any) { }

    private tasks: any[] = [];

    async getTasks() {
        const query = 'SELECT * FROM tasks';
        const result = await this.db.query(query);
        return result.rows;
    }

    async getTaskById(id: number): Promise<any> {
        const query = 'SELECT * FROM tasks WHERE id = $1';
        const result = await this.db.query(query, [id]);
        return result.rows[0];
    }
    async insertTasks(task: CreateTaskDto): Promise<any> {
        const sql = `INSERT INTO tasks (name, description, priority, user_id) VALUES ('${task.name}', '${task.description}', '${task.priority}', ${task.user_id}) RETURNING id`;
        const result = await this.db.query(sql);
        const insertId = result.insertId;
        const row = await this.getTaskById(insertId);
        return row;
    }

    async updateTask(id: number, taskUpdate: UpdateTaskDto): Promise<any> {
        const task = await this.getTaskById(id);

        task.name = taskUpdate.name ? taskUpdate.name : task.name;
        task.description = taskUpdate.description ?? task.description;
        task.priority = taskUpdate.priority ?? task.priority;

        const query = `UPDATE tasks
       SET name = '${task.name}',
       description= '${task.description}',
       priority= ${task.prioryty}
       WHERE id = ${task.id}`;

        await this.db.query(query);

        return await this.getTaskById(id);


        //Conertir el objeto a un SET
        //{ name : 'abc', description : 'abc'}
        //name='', description''
        //const set = Object.entries(taskUpdate)
        //.map(([key, value]) => `${key} = '${value}'`)
        // .join(', ');
        //git commit -a -m "fix: CRUD a base de datos MYSQL (list, listById, insert)"
    }

    async deleteTask(id: number): Promise<boolean> {
        const query = `DELETE FROM tasks WHERE id = ${id}`;
        const [result] = await this.db.query(query);

        return result.affectedRows > 0;
    }
}