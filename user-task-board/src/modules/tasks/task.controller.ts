import { NextFunction, Request, Response } from 'express';
import { sendResponse } from '../../utils/response';
import { taskService } from './task.service';

const idOf = (req: Request): string => String(req.params.id);

type Handler = (req: Request, res: Response) => Promise<void>;

// Wraps a handler so thrown errors reach the error middleware.
const handle =
  (fn: Handler) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await fn(req, res);
    } catch (err) {
      next(err);
    }
  };

export class TaskController {
  create = handle(async (req, res) => {
    const task = await taskService.create(req.user!.id, req.body || {});
    sendResponse(res, 201, 'Task created successfully', task);
  });

  list = handle(async (req, res) => {
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const tasks = await taskService.list(req.user!.id, status);
    sendResponse(res, 200, 'Tasks retrieved successfully', tasks);
  });

  get = handle(async (req, res) => {
    const task = await taskService.get(req.user!.id, idOf(req));
    sendResponse(res, 200, 'Task retrieved successfully', task);
  });

  update = handle(async (req, res) => {
    const task = await taskService.update(req.user!.id, idOf(req), req.body || {});
    sendResponse(res, 200, 'Task updated successfully', task);
  });

  updateStatus = handle(async (req, res) => {
    const task = await taskService.updateStatus(req.user!.id, idOf(req), req.body?.status);
    sendResponse(res, 200, 'Task status updated successfully', task);
  });

  remove = handle(async (req, res) => {
    await taskService.remove(req.user!.id, idOf(req));
    sendResponse(res, 200, 'Task deleted successfully');
  });
}

export const taskController = new TaskController();
