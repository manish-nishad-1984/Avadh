import { query } from '../config/database';
import { generateSlug } from '../utils/helpers';
import { CategoryInput } from '../validators/schemas';
import fs from 'fs';
import path from 'path';

export class CategoryService {
  static async getAll(includeInactive = false) {
    const sql = includeInactive
      ? 'SELECT * FROM categories ORDER BY display_order ASC, name ASC'
      : 'SELECT * FROM categories WHERE is_active = true ORDER BY display_order ASC, name ASC';
    const result = await query(sql);
    return result.rows;
  }

  static async getBySlug(slug: string) {
    const result = await query('SELECT * FROM categories WHERE slug = $1 AND is_active = true', [slug]);
    if (result.rows.length === 0) throw { statusCode: 404, message: 'Category not found' };
    return result.rows[0];
  }

  static async getById(id: string) {
    const result = await query('SELECT * FROM categories WHERE id = $1', [id]);
    if (result.rows.length === 0) throw { statusCode: 404, message: 'Category not found' };
    return result.rows[0];
  }

  static async create(data: CategoryInput) {
    const slug = generateSlug(data.name);
    const result = await query(
      `INSERT INTO categories (name, slug, description, display_order, is_active) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [data.name, slug, data.description || null, data.display_order, data.is_active]
    );
    return result.rows[0];
  }

  static async update(id: string, data: CategoryInput) {
    const slug = generateSlug(data.name);
    const result = await query(
      `UPDATE categories SET name=$1, slug=$2, description=$3, display_order=$4, is_active=$5
       WHERE id=$6 RETURNING *`,
      [data.name, slug, data.description || null, data.display_order, data.is_active, id]
    );
    if (result.rows.length === 0) throw { statusCode: 404, message: 'Category not found' };
    return result.rows[0];
  }

  static async delete(id: string) {
    const products = await query('SELECT COUNT(*) FROM products WHERE category_id = $1 AND deleted_at IS NULL', [id]);
    if (parseInt(products.rows[0].count) > 0) {
      throw { statusCode: 400, message: 'Cannot delete category with products. Deactivate it instead.' };
    }
    const result = await query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) throw { statusCode: 404, message: 'Category not found' };
    return result.rows[0];
  }

  static async updateImage(id: string, imageUrl: string) {
    const existing = await this.getById(id);
    // Delete old image file if exists
    if (existing.image_url) {
      const oldPath = path.join(process.cwd(), existing.image_url);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    const result = await query('UPDATE categories SET image_url = $1 WHERE id = $2 RETURNING *', [imageUrl, id]);
    return result.rows[0];
  }
}
