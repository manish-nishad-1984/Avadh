import { query } from '../config/database';

export class DashboardService {
  static async getStats() {
    const [cats, prods, active, hidden, featured, newInq, pendInq, compInq] = await Promise.all([
      query('SELECT COUNT(*) FROM categories WHERE is_active=true'),
      query('SELECT COUNT(*) FROM products WHERE deleted_at IS NULL'),
      query('SELECT COUNT(*) FROM products WHERE is_active=true AND deleted_at IS NULL'),
      query('SELECT COUNT(*) FROM products WHERE is_visible=false AND deleted_at IS NULL'),
      query('SELECT COUNT(*) FROM products WHERE is_featured=true AND deleted_at IS NULL'),
      query("SELECT COUNT(*) FROM inquiries WHERE status='new'"),
      query("SELECT COUNT(*) FROM inquiries WHERE status IN ('contacted','quoted','in_progress')"),
      query("SELECT COUNT(*) FROM inquiries WHERE status='completed'"),
    ]);
    return {
      total_categories: parseInt(cats.rows[0].count),
      total_products: parseInt(prods.rows[0].count),
      active_products: parseInt(active.rows[0].count),
      hidden_products: parseInt(hidden.rows[0].count),
      featured_products: parseInt(featured.rows[0].count),
      new_inquiries: parseInt(newInq.rows[0].count),
      pending_inquiries: parseInt(pendInq.rows[0].count),
      completed_inquiries: parseInt(compInq.rows[0].count),
    };
  }

  static async getRecentInquiries(limit = 5) {
    const r = await query(
      `SELECT i.*,(SELECT COUNT(*) FROM inquiry_items WHERE inquiry_id=i.id) as item_count
       FROM inquiries i ORDER BY i.created_at DESC LIMIT $1`, [limit]
    );
    return r.rows;
  }

  static async getInquiryStats() {
    const r = await query('SELECT status, COUNT(*) as count FROM inquiries GROUP BY status');
    return r.rows;
  }

  static async getPopularProducts(limit = 5) {
    const r = await query(
      `SELECT ii.product_name_snapshot as name, ii.sku_snapshot as sku, COUNT(*) as inquiry_count
       FROM inquiry_items ii GROUP BY ii.product_name_snapshot, ii.sku_snapshot
       ORDER BY inquiry_count DESC LIMIT $1`, [limit]
    );
    return r.rows;
  }
}
