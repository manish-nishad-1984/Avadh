import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboardService';
import { sendSuccess, sendError } from '../utils/response';

export class DashboardController {
  static async getStats(_req: Request, res: Response) {
    try {
      const [stats, recent, inquiryStats, popular] = await Promise.all([
        DashboardService.getStats(),
        DashboardService.getRecentInquiries(),
        DashboardService.getInquiryStats(),
        DashboardService.getPopularProducts(),
      ]);
      sendSuccess(res, { stats, recent_inquiries: recent, inquiry_stats: inquiryStats, popular_products: popular });
    } catch (e: any) { sendError(res, e.message, e.statusCode||500); }
  }
}
