import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipes';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query(ValidationPipe) filterDto: GetTaskFilterDto,
    @Req() req
  ){
    return this.tasksService.getTasks(filterDto, req.user);
  }

  @Get('/:id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, req.user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
      @Body() createTaskDto: CreateTaskDto,
      @Req() req
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, req.user);
  }

  @Delete('/:id')
  deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @Req() req
  ): Promise<void> {
    return this.tasksService.deleteTask(id, req.user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
      @Param('id') id: number,
      @Body('status', TaskStatusValidationPipe) status: TaskStatus,
      @Req() req
    ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, req.user, status);
  }
}
