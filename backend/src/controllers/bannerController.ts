import { Request, Response } from 'express';
import { BannerService } from '../services/bannerService';
import { sendSuccess, sendCreated, sendError } from '../utils/response';

export class BannerController {
  static async getActive(_req: Request, res: Response) {
    try { sendSuccess(res, await BannerService.getActive()); } catch (e: any) { sendError(res, e.message, e.statusCode||500); }
  }
  static async getAll(_req: Request, res: Response) {
    try { sendSuccess(res, await BannerService.getAll()); } catch (e: any) { sendError(res, e.message, e.statusCode||500); }
  }
  static async getById(req: Request, res: Response) {
    try { sendSuccess(res, await BannerService.getById(req.params.id)); } catch (e: any) { sendError(res, e.message, e.statusCode||500); }
  }
  static async create(req: Request, res: Response) {
    try {
      if (!req.file) return sendError(res, 'Banner image is required', 400);
      const imageUrl = `/uploads/banners/${req.file.filename}`;
      sendCreated(res, await BannerService.create(req.body, imageUrl));
    } catch (e: any) { sendError(res, e.message, e.statusCode||500); }
  }
  static async update(req: Request, res: Response) {
    try {
      if (req.file) await BannerService.updateImage(req.params.id, `/uploads/banners/${req.file.filename}`);
      sendSuccess(res, await BannerService.update(req.params.id, req.body), 'Banner updated');
    } catch (e: any) { sendError(res, e.message, e.statusCode||500); }
  }
  static async delete(req: Request, res: Response) {
    try { sendSuccess(res, await BannerService.delete(req.params.id), 'Banner deleted'); } catch (e: any) { sendError(res, e.message, e.statusCode||500); }
  }
}
