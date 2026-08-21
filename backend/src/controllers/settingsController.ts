import { Request, Response } from 'express';
import { SettingsService } from '../services/settingsService';
import { sendSuccess, sendError } from '../utils/response';

export class SettingsController {
  static async getAll(_req: Request, res: Response) {
    try { sendSuccess(res, await SettingsService.getAll()); } catch (e: any) { sendError(res, e.message, e.statusCode||500); }
  }
  static async update(req: Request, res: Response) {
    try { sendSuccess(res, await SettingsService.update(req.body.settings), 'Settings updated'); } catch (e: any) { sendError(res, e.message, e.statusCode||500); }
  }
  static async uploadLogo(req: Request, res: Response) {
    try {
      if (!req.file) return sendError(res, 'Logo file is required', 400);
      const logoUrl = `/uploads/logos/${req.file.filename}`;
      await SettingsService.set('logo_url', logoUrl);
      sendSuccess(res, { logo_url: logoUrl }, 'Logo uploaded');
    } catch (e: any) { sendError(res, e.message, e.statusCode||500); }
  }
}
