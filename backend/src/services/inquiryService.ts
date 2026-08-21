import { query, getClient } from '../config/database';
import { InquiryInput } from '../validators/schemas';
import { generateInquiryNumber, parsePagination } from '../utils/helpers';

export class InquiryService {
  static async create(data: InquiryInput) {
    const client = await getClient();
    try {
      await client.query('BEGIN');
      const inquiryNumber = generateInquiryNumber();
      const r = await client.query(
        `INSERT INTO inquiries (inquiry_number,customer_name,mobile,whatsapp,email,company_name,city,state,message,inquiry_type)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
        [inquiryNumber,data.customer_name,data.mobile,data.whatsapp||null,data.email||null,
         data.company_name||null,data.city||null,data.state||null,data.message||null,data.inquiry_type]
      );
      const inquiry = r.rows[0];
      for (const item of data.items) {
        await client.query(
          `INSERT INTO inquiry_items (inquiry_id,product_id,product_name_snapshot,sku_snapshot,quantity,price_snapshot) VALUES ($1,$2,$3,$4,$5,$6)`,
          [inquiry.id,item.product_id,item.product_name,item.sku,item.quantity,item.price||null]
        );
      }
      await client.query('COMMIT');
      return { ...inquiry, items: data.items };
    } catch (e) { await client.query('ROLLBACK'); throw e; } finally { client.release(); }
  }

  static async getAll(params: any) {
    const { page, limit, offset } = parsePagination(params);
    const conds: string[] = []; const vals: any[] = []; let idx = 1;
    if (params.status) { conds.push(`status=$${idx++}`); vals.push(params.status); }
    if (params.search) { conds.push(`(customer_name ILIKE $${idx} OR inquiry_number ILIKE $${idx} OR mobile ILIKE $${idx})`); vals.push(`%${params.search}%`); idx++; }
    if (params.from_date) { conds.push(`created_at >= $${idx++}`); vals.push(params.from_date); }
    if (params.to_date) { conds.push(`created_at <= $${idx++}`); vals.push(params.to_date+' 23:59:59'); }
    const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';
    const countR = await query(`SELECT COUNT(*) FROM inquiries ${where}`, vals);
    const total = parseInt(countR.rows[0].count);
    vals.push(limit, offset);
    const dataR = await query(
      `SELECT i.*,(SELECT COUNT(*) FROM inquiry_items WHERE inquiry_id=i.id) as item_count FROM inquiries i ${where} ORDER BY i.created_at DESC LIMIT $${idx++} OFFSET $${idx++}`, vals
    );
    return { inquiries: dataR.rows, meta: { page, limit, total, totalPages: Math.ceil(total/limit) } };
  }

  static async getById(id: string) {
    const r = await query('SELECT * FROM inquiries WHERE id=$1', [id]);
    if (!r.rows.length) throw { statusCode: 404, message: 'Inquiry not found' };
    const inquiry = r.rows[0];
    const items = await query(
      `SELECT ii.*,pi.image_url as product_image FROM inquiry_items ii LEFT JOIN product_images pi ON pi.product_id=ii.product_id AND pi.is_primary=true WHERE ii.inquiry_id=$1 ORDER BY ii.created_at`, [id]
    );
    inquiry.items = items.rows;
    return inquiry;
  }

  static async updateStatus(id: string, status: string) {
    const r = await query('UPDATE inquiries SET status=$1 WHERE id=$2 RETURNING *', [status, id]);
    if (!r.rows.length) throw { statusCode: 404, message: 'Inquiry not found' };
    return r.rows[0];
  }

  static async updateNotes(id: string, notes: string) {
    const r = await query('UPDATE inquiries SET admin_notes=$1 WHERE id=$2 RETURNING *', [notes, id]);
    if (!r.rows.length) throw { statusCode: 404, message: 'Inquiry not found' };
    return r.rows[0];
  }
}
