import { Request, Response } from 'express';
import { CategoryService } from '../services/categoryService';
import { sendSuccess, sendCreated, sendError } from '../utils/response';

export class CategoryController {
  static async getAll(_req: Request, res: Response) {
    try { sendSuccess(res, await CategoryService.getAll()); } catch (e: any) { sendError(res, e.message, e.statusCode||500); }
  }
  static async getAllAdmin(_req: Request, res: Response) {
    try { sendSuccess(res, await CategoryService.getAll(true)); } catch (e: any) { sendError(res, e.message, e.statusCode||500); }
  }
  static async getBySlug(req: Request, res: Response) {
    try { sendSuccess(res, await CategoryService.getBySlug(req.params.slug)); } catch (e: any) { sendError(res, e.message, e.statusCode||500); }
  }
  static async getById(req: Request, res: Response) {
    try { sendSuccess(res, await CategoryService.getById(req.params.id)); } catch (e: any) { sendError(res, e.message, e.statusCode||500); }
  }
  static async create(req: Request, res: Response) {
    try { sendCreated(res, await CategoryService.create(req.body)); } catch (e: any) { sendError(res, e.message, e.statusCode||500); }
  }
  static async update(req: Request, res: Response) {
    try { sendSuccess(res, await CategoryService.update(req.params.id, req.body), 'Category updated'); } catch (e: any) { sendError(res, e.message, e.statusCode||500); }
  }
  static async delete(req: Request, res: Response) {
    try { sendSuccess(res, await CategoryService.delete(req.params.id), 'Category deleted'); } catch (e: any) { sendError(res, e.message, e.statusCode||500); }
  }
  static async uploadImage(req: Request, res: Response) {
    try {
      if (!req.file) return sendError(res, 'Image file is required', 400);
      const imageUrl = `/uploads/categories/${req.file.filename}`;
      sendSuccess(res, await CategoryService.updateImage(req.params.id, imageUrl), 'Image uploaded');
    } catch (e: any) { sendError(res, e.message, e.statusCode||500); }
  }
}
