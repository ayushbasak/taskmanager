import { InternalServerErrorException, Logger } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { DeleteResult, EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity'

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    private logger = new Logger('TaskRepository');

    async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');
        console.log(user.id)
        query.where('task.userId = :userId', { userId: user.id });

        if(status){
            query.andWhere('task.status = :status', { status });
        }
        if(search){
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` });
        }
        try{
            const tasks = await query.getMany();
            return tasks;
        }
        catch(err){
            this.logger.error(`Failed to get tasks for user "${user.username}", Filters: ${JSON.stringify(filterDto)}`, err.stack);
            throw new InternalServerErrorException();
        }
    }
    
    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const task = new Task();
		task.title = createTaskDto.title;
		task.description = createTaskDto.description;
		task.status = TaskStatus.OPEN;
        task.user = user;

        try{
            await task.save();
            delete task.user
            delete task.userId;
            return task;
        }
        catch(err){
            this.logger.error(`Failed to create task for user "${user.username}", Data: ${JSON.stringify(createTaskDto)}`, err.stack);
            throw new InternalServerErrorException();
        }
    }

    async removeTask(id: number, user: User): Promise<DeleteResult> {
        const result = await this.delete({ id, userId: user.id });
        return result;
    }
}