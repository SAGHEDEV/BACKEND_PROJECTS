import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  message: string;
  status: number;
  data: T | null;
}

export function sendResponse<T>(
  res: Response,
  status: number,
  message: string,
  data: T | null = null
): Response {
  const body: ApiResponse<T> = { message, status, data };
  return res.status(status).json(body);
}
