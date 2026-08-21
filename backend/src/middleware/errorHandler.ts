import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error('Error:', err.message || err);

  if (err.code === '23505') {
    sendError(res, 'A record with this value already exists', 409);
    return;
  }

  if (err.code === '23503') {
    sendError(res, 'Referenced record does not exist', 400);
    return;
  }

  if (err.type === 'entity.parse.failed') {
    sendError(res, 'Invalid JSON in request body', 400);
    return;
  }

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message || 'Internal Server Error';

  sendError(res, message, statusCode);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  sendError(res, `Route ${req.originalUrl} not found`, 404);
};
