import { Injectable, NotFoundException } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;

    let tasks = this.getAllTasks();

    if (status) tasks = tasks.filter(task => task.status === status);
    if (search) tasks = tasks.filter(task => task.title.includes(search) || task.description.includes(search));

    return tasks;
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find(task => task.id === id);

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: nanoid(16),
      title,
      description,
      status: TaskStatus.OPEN,
    }
    this.tasks.push(task);

    return task;
  }

  deleteTaskById(id: string): void {
    const task = this.getTaskById(id);

    this.tasks = this.tasks.filter(task => task.id !== task.id);
  }

  updateTaskStatus(id: string, status: TaskStatus) {
    const task: Task = this.getTaskById(id);

    task.status = status;

    return task;
  }
}
