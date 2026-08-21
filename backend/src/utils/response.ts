// ============================================
// Response Helpers
// ============================================

import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
  meta?: ApiResponse['meta']
): void => {
  const response: ApiResponse<T> = { success: true, message, data };
  if (meta) response.meta = meta;
  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message = 'Internal Server Error',
  statusCode = 500,
  data: any = null
): void => {
  res.status(statusCode).json({ success: false, message, data });
};

export const sendCreated = <T>(res: Response, data: T, message = 'Created successfully'): void => {
  sendSuccess(res, data, message, 201);
};

export const sendNotFound = (res: Response, message = 'Resource not found'): void => {
  sendError(res, message, 404);
};

export const sendBadRequest = (res: Response, message = 'Bad request', data: any = null): void => {
  sendError(res, message, 400, data);
};

export const sendUnauthorized = (res: Response, message = 'Unauthorized'): void => {
  sendError(res, message, 401);
};

export const sendForbidden = (res: Response, message = 'Forbidden'): void => {
  sendError(res, message, 403);
};
