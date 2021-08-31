import { DeleteResult, EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity'

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    async getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');
        console.log(status)
        if(status){
            query.andWhere('task.status = :status', { status });
        }
        if(search){
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` });
        }
        const tasks = await query.getMany();
        return tasks;
    }
    
    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const task = new Task();
		task.title = createTaskDto.title;
		task.description = createTaskDto.description;
		task.status = TaskStatus.OPEN;

		task.save();
		return task;
    }

    async removeTask(id: number): Promise<DeleteResult> {
        const result = await this.delete(id);
        return result;
    }
}