import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { sendResponse } from '../utils/response';

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) {
    sendResponse(res, 401, 'Missing or invalid Authorization header');
    return;
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch {
    sendResponse(res, 401, 'Invalid or expired token');
  }
}
