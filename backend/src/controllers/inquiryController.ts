import { Request, Response } from 'express';
import { InquiryService } from '../services/inquiryService';
import { sendSuccess, sendCreated, sendError } from '../utils/response';

export class InquiryController {
  static async create(req: Request, res: Response) {
    try { sendCreated(res, await InquiryService.create(req.body), 'Inquiry submitted successfully'); } catch (e: any) { sendError(res, e.message, e.statusCode||500); }
  }
  static async getAll(req: Request, res: Response) {
    try {
      const result = await InquiryService.getAll(req.query);
      sendSuccess(res, result.inquiries, 'Success', 200, result.meta);
    } catch (e: any) { sendError(res, e.message, e.statusCode||500); }
  }
  static async getById(req: Request, res: Response) {
    try { sendSuccess(res, await InquiryService.getById(req.params.id)); } catch (e: any) { sendError(res, e.message, e.statusCode||500); }
  }
  static async updateStatus(req: Request, res: Response) {
    try { sendSuccess(res, await InquiryService.updateStatus(req.params.id, req.body.status), 'Status updated'); } catch (e: any) { sendError(res, e.message, e.statusCode||500); }
  }
  static async updateNotes(req: Request, res: Response) {
    try { sendSuccess(res, await InquiryService.updateNotes(req.params.id, req.body.admin_notes), 'Notes updated'); } catch (e: any) { sendError(res, e.message, e.statusCode||500); }
  }
}
