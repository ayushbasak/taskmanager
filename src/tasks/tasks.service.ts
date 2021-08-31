import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import * as uuid from 'uuid'
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
@Injectable()
export class TasksService {
  private tasks: Task[] = [];
  
	getAllTasks(): Task[] {
    	return this.tasks;
  	}

	getTasksWithFilter(filterDto: GetTaskFilterDto): Task[] {
		const { status, search } = filterDto;
		console.log(filterDto)
		let tasks = this.getAllTasks();

		if (status) {
			tasks = tasks.filter(task => task.status === status);
		}
		
		if (search) {
			tasks = tasks.filter(task => 
				task.title.includes(search) ||
				task.description.includes(search)
			);
		}

		return tasks;
	}
	getTaskById(id: string): Task {
		const task = this.tasks.find(task => task.id === id);
		if(!task){
			throw new NotFoundException(`Task id ${id} not found`);
		}

		return task;
	}

	createTask(createTaskDto: CreateTaskDto): Task {
		
		const { title, description } = createTaskDto;
		
		const task: Task = {
			id: uuid.v4(),
			title,
			description,
			status: TaskStatus.OPEN,
		}

		this.tasks.push(task);
		return task;
	};

	deleteTask(id: string): void {
		const found_task = this.getTaskById(id);	
		this.tasks = this.tasks.filter(task => task.id !== 	found_task.id);
	}

	updateTaskStatus(id: string, status: TaskStatus): Task {
		const task = this.getTaskById(id);
		task.status = status;
		return task;
	}
}
