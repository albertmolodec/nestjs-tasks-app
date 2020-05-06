import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockUser = { username: 'Test user', id: 12 };

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
});

describe('TasksService', () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TaskRepository,
          useFactory: mockTaskRepository,
        },
      ],
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('should get all tasks from the repository', async () => {
      taskRepository.getTasks.mockResolvedValue('someValue');
      expect(taskRepository.getTasks).not.toHaveBeenCalled();

      const filters: GetTasksFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'some search query',
      };

      const result = await tasksService.getTasks(filters, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('getTask', () => {
    it('should get task by its id by calling taskRepository.findOne() and successfully retrieve and return the task', async () => {
      const mockTask = {
        title: 'Test task',
        description: 'Test description',
      };
      taskRepository.findOne.mockResolvedValue(mockTask);

      const result = await tasksService.getTask(1, mockUser);
      expect(result).toEqual(mockTask);

      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: mockUser.id },
      });
    });

    it('should throw an error if task is not found', () => {
      taskRepository.findOne.mockResolvedValue(null);

      expect(tasksService.getTask(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createTask', () => {
    it('should create a new task and return a result', async () => {
      taskRepository.createTask.mockResolvedValue('someTask');

      expect(taskRepository.createTask).not.toHaveBeenCalled();

      const createTaskDto = {
        title: 'Test task',
        description: 'Test description',
      };
      const result = await tasksService.createTask(createTaskDto, mockUser);
      expect(taskRepository.createTask).toHaveBeenCalledWith(
        createTaskDto,
        mockUser,
      );

      expect(result).toEqual('someTask');
    });

    describe('deleteTask', () => {
      it('should delete task by its id', async () => {
        taskRepository.delete.mockResolvedValue({ affected: 1 });
        expect(taskRepository.delete).not.toHaveBeenCalled();
        await tasksService.deleteTask(1, mockUser);
        expect(taskRepository.delete).toHaveBeenCalledWith({
          id: 1,
          userId: mockUser.id,
        });
      });

      it('should throw an error as task could not be found', () => {
        taskRepository.delete.mockResolvedValue({ affected: 0 });

        expect(tasksService.deleteTask(1, mockUser)).rejects.toThrowError(
          NotFoundException,
        );
      });
    });

    describe('updateTaskStatus', () => {
      it('should update task status by its id', async () => {
        const save = jest.fn().mockResolvedValue(true);
        tasksService.getTask = jest.fn().mockResolvedValue({
          status: TaskStatus.OPEN,
          save,
        });

        expect(tasksService.getTask).not.toHaveBeenCalled();
        const result = await tasksService.updateTaskStatus(
          1,
          TaskStatus.IN_PROGRESS,
          mockUser,
        );
        expect(tasksService.getTask).toHaveBeenCalled();
        expect(save).toHaveBeenCalled();

        expect(result.status).toEqual(TaskStatus.IN_PROGRESS);
      });

      it('should throw an error as task could not be found', () => {
        expect(
          tasksService.updateTaskStatus(1, TaskStatus.OPEN, mockUser),
        ).rejects.toThrowError(NotFoundException);
      });
    });
  });
});
