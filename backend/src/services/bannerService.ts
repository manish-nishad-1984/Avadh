import { query } from '../config/database';
import { BannerInput } from '../validators/schemas';
import fs from 'fs';
import path from 'path';

export class BannerService {
  static async getActive() {
    const result = await query(
      `SELECT * FROM banners WHERE is_active = true 
       AND (start_date IS NULL OR start_date <= CURRENT_DATE) 
       AND (end_date IS NULL OR end_date >= CURRENT_DATE)
       ORDER BY display_order ASC`
    );
    return result.rows;
  }

  static async getAll() {
    const result = await query('SELECT * FROM banners ORDER BY display_order ASC, created_at DESC');
    return result.rows;
  }

  static async getById(id: string) {
    const result = await query('SELECT * FROM banners WHERE id = $1', [id]);
    if (result.rows.length === 0) throw { statusCode: 404, message: 'Banner not found' };
    return result.rows[0];
  }

  static async create(data: BannerInput, imageUrl: string) {
    const result = await query(
      `INSERT INTO banners (title, subtitle, image_url, button_text, button_url, display_order, is_active, start_date, end_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [data.title || null, data.subtitle || null, imageUrl, data.button_text || null, data.button_url || null,
       data.display_order, data.is_active, data.start_date || null, data.end_date || null]
    );
    return result.rows[0];
  }

  static async update(id: string, data: BannerInput) {
    const result = await query(
      `UPDATE banners SET title=$1, subtitle=$2, button_text=$3, button_url=$4, 
       display_order=$5, is_active=$6, start_date=$7, end_date=$8 WHERE id=$9 RETURNING *`,
      [data.title || null, data.subtitle || null, data.button_text || null, data.button_url || null,
       data.display_order, data.is_active, data.start_date || null, data.end_date || null, id]
    );
    if (result.rows.length === 0) throw { statusCode: 404, message: 'Banner not found' };
    return result.rows[0];
  }

  static async updateImage(id: string, imageUrl: string) {
    const existing = await this.getById(id);
    if (existing.image_url) {
      const oldPath = path.join(process.cwd(), existing.image_url);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    const result = await query('UPDATE banners SET image_url = $1 WHERE id = $2 RETURNING *', [imageUrl, id]);
    return result.rows[0];
  }

  static async delete(id: string) {
    const existing = await this.getById(id);
    if (existing.image_url) {
      const filePath = path.join(process.cwd(), existing.image_url);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await query('DELETE FROM banners WHERE id = $1', [id]);
    return existing;
  }
}
