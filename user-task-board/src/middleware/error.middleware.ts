import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { sendResponse } from '../utils/response';

export function notFound(_req: Request, res: Response): void {
  sendResponse(res, 404, 'Route not found');
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    sendResponse(res, err.status, err.message);
    return;
  }
  console.error(err);
  sendResponse(res, 500, 'Internal server error');
}
