import { NextFunction, Request, Response } from 'express';
import { sendResponse } from '../../utils/response';
import { authService } from './auth.service';

export class AuthController {
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await authService.register(req.body || {});
      sendResponse(res, 201, 'Account created successfully', data);
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await authService.login(req.body || {});
      sendResponse(res, 200, 'Login successful', data);
    } catch (err) {
      next(err);
    }
  };
}

export const authController = new AuthController();
