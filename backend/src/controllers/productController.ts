import { Request, Response } from 'express';
import { ProductService } from '../services/productService';
import { sendSuccess, sendCreated, sendError } from '../utils/response';

export class ProductController {
  static async getAll(req: Request, res: Response) {
    try {
      const result = await ProductService.getAll({ ...req.query, admin: false });
      sendSuccess(res, result.products, 'Success', 200, result.meta);
    } catch (e: any) { sendError(res, e.message, e.statusCode||500); }
  }
  static async getAllAdmin(req: Request, res: Response) {
    try {
      const result = await ProductService.getAll({ ...req.query, admin: true });
      sendSuccess(res, result.products, 'Success', 200, result.meta);
    } catch (e: any) { sendError(res, e.message, e.statusCode||500); }
  }
  static async getFeatured(_req: Request, res: Response) {
    try { sendSuccess(res, await ProductService.getFeatured()); } catch (e: any) { sendError(res, e.message, e.statusCode||500); }
  }
  static async getLatest(_req: Request, res: Response) {
    try { sendSuccess(res, await ProductService.getLatest()); } catch (e: any) { sendError(res, e.message, e.statusCode||500); }
  }
  static async getBySlug(req: Request, res: Response) {
    try { sendSuccess(res, await ProductService.getBySlug(req.params.slug)); } catch (e: any) { sendError(res, e.message, e.statusCode||500); }
  }
  static async getById(req: Request, res: Response) {
    try { sendSuccess(res, await ProductService.getById(req.params.id)); } catch (e: any) { sendError(res, e.message, e.statusCode||500); }
  }
  static async create(req: Request, res: Response) {
    try { sendCreated(res, await ProductService.create(req.body)); } catch (e: any) { sendError(res, e.message, e.statusCode||500); }
  }
  static async update(req: Request, res: Response) {
    try { sendSuccess(res, await ProductService.update(req.params.id, req.body), 'Product updated'); } catch (e: any) { sendError(res, e.message, e.statusCode||500); }
  }
  static async updateStatus(req: Request, res: Response) {
    try { sendSuccess(res, await ProductService.updateStatus(req.params.id, req.body), 'Status updated'); } catch (e: any) { sendError(res, e.message, e.statusCode||500); }
  }
  static async delete(req: Request, res: Response) {
    try { sendSuccess(res, await ProductService.softDelete(req.params.id), 'Product deleted'); } catch (e: any) { sendError(res, e.message, e.statusCode||500); }
  }
  static async uploadImages(req: Request, res: Response) {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files?.length) return sendError(res, 'At least one image required', 400);
      sendSuccess(res, await ProductService.addImages(req.params.id, files), 'Images uploaded');
    } catch (e: any) { sendError(res, e.message, e.statusCode||500); }
  }
  static async deleteImage(req: Request, res: Response) {
    try { sendSuccess(res, await ProductService.deleteImage(req.params.id, req.params.imageId), 'Image deleted'); } catch (e: any) { sendError(res, e.message, e.statusCode||500); }
  }
  static async setPrimaryImage(req: Request, res: Response) {
    try { sendSuccess(res, await ProductService.setPrimaryImage(req.params.id, req.params.imageId), 'Primary image set'); } catch (e: any) { sendError(res, e.message, e.statusCode||500); }
  }
}
