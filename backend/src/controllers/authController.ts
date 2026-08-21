import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { AuthRequest } from '../middleware/auth';
import { sendSuccess, sendError } from '../utils/response';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const result = await AuthService.login(req.body.email, req.body.password);
      sendSuccess(res, result, 'Login successful');
    } catch (e: any) {
      sendError(res, e.message, e.statusCode || 500);
    }
  }

  static async me(req: AuthRequest, res: Response) {
    try {
      const user = await AuthService.getMe(req.user!.id);
      sendSuccess(res, user);
    } catch (e: any) {
      sendError(res, e.message, e.statusCode || 500);
    }
  }

  static async logout(_req: Request, res: Response) {
    sendSuccess(res, null, 'Logged out successfully');
  }
}
