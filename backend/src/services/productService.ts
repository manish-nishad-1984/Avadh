import { query, getClient } from '../config/database';
import { generateSlug, parsePagination } from '../utils/helpers';
import { ProductInput } from '../validators/schemas';
import fs from 'fs';
import path from 'path';

export class ProductService {
  static async getAll(params: any) {
    const { page, limit, offset } = parsePagination(params);
    const conditions: string[] = ['p.deleted_at IS NULL'];
    const values: any[] = [];
    let paramIdx = 1;

    // Public filters
    if (params.active_only !== false) {
      if (!params.admin) {
        conditions.push(`p.is_active = true`);
        conditions.push(`p.is_visible = true`);
      }
    }

    if (params.category_id) {
      conditions.push(`p.category_id = $${paramIdx++}`);
      values.push(params.category_id);
    }

    if (params.category_slug) {
      conditions.push(`c.slug = $${paramIdx++}`);
      values.push(params.category_slug);
    }

    if (params.search) {
      conditions.push(`(p.name ILIKE $${paramIdx} OR p.sku ILIKE $${paramIdx} OR c.name ILIKE $${paramIdx})`);
      values.push(`%${params.search}%`);
      paramIdx++;
    }

    if (params.is_featured !== undefined) {
      conditions.push(`p.is_featured = $${paramIdx++}`);
      values.push(params.is_featured);
    }

    if (params.is_active !== undefined && params.admin) {
      conditions.push(`p.is_active = $${paramIdx++}`);
      values.push(params.is_active);
    }

    if (params.is_visible !== undefined && params.admin) {
      conditions.push(`p.is_visible = $${paramIdx++}`);
      values.push(params.is_visible);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Sorting
    let orderBy = 'p.display_order ASC, p.created_at DESC';
    if (params.sort === 'name_asc') orderBy = 'p.name ASC';
    else if (params.sort === 'name_desc') orderBy = 'p.name DESC';
    else if (params.sort === 'newest') orderBy = 'p.created_at DESC';
    else if (params.sort === 'oldest') orderBy = 'p.created_at ASC';
    else if (params.sort === 'price_asc') orderBy = 'p.price ASC NULLS LAST';
    else if (params.sort === 'price_desc') orderBy = 'p.price DESC NULLS LAST';

    // Count
    const countSql = `SELECT COUNT(*) FROM products p LEFT JOIN categories c ON p.category_id = c.id ${where}`;
    const countResult = await query(countSql, values);
    const total = parseInt(countResult.rows[0].count);

    // Data
    const dataSql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${where}
      ORDER BY ${orderBy}
      LIMIT $${paramIdx++} OFFSET $${paramIdx++}
    `;
    values.push(limit, offset);
    const dataResult = await query(dataSql, values);

    return {
      products: dataResult.rows,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  static async getFeatured(limit = 8) {
    const result = await query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as primary_image
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.is_active = true AND p.is_visible = true AND p.is_featured = true AND p.deleted_at IS NULL
       ORDER BY p.display_order ASC, p.created_at DESC LIMIT $1`,
      [limit]
    );
    return result.rows;
  }

  static async getLatest(limit = 8) {
    const result = await query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as primary_image
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.is_active = true AND p.is_visible = true AND p.deleted_at IS NULL
       ORDER BY p.created_at DESC LIMIT $1`,
      [limit]
    );
    return result.rows;
  }

  static async getBySlug(slug: string) {
    const result = await query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.slug = $1 AND p.deleted_at IS NULL`,
      [slug]
    );
    if (result.rows.length === 0) throw { statusCode: 404, message: 'Product not found' };

    const product = result.rows[0];
    const images = await query(
      'SELECT * FROM product_images WHERE product_id = $1 ORDER BY is_primary DESC, display_order ASC',
      [product.id]
    );
    product.images = images.rows;

    // Related products
    const related = await query(
      `SELECT p.*, c.name as category_name,
        (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as primary_image
       FROM products p LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.category_id = $1 AND p.id != $2 AND p.is_active = true AND p.is_visible = true AND p.deleted_at IS NULL
       ORDER BY RANDOM() LIMIT 4`,
      [product.category_id, product.id]
    );
    product.related_products = related.rows;

    return product;
  }

  static async getById(id: string) {
    const result = await query(
      `SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = $1 AND p.deleted_at IS NULL`,
      [id]
    );
    if (result.rows.length === 0) throw { statusCode: 404, message: 'Product not found' };
    const product = result.rows[0];
    const images = await query('SELECT * FROM product_images WHERE product_id = $1 ORDER BY is_primary DESC, display_order ASC', [id]);
    product.images = images.rows;
    return product;
  }

  static async create(data: ProductInput) {
    const slug = generateSlug(data.name);
    const result = await query(
      `INSERT INTO products (name, slug, sku, category_id, short_description, description, price, mrp,
        material, finish, color, stone_type, plating, size, weight, collection, occasion,
        stock_status, is_active, is_visible, is_featured, display_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
       RETURNING *`,
      [
        data.name, slug, data.sku, data.category_id, data.short_description || null, data.description || null,
        data.price || null, data.mrp || null, data.material || null, data.finish || null,
        data.color || null, data.stone_type || null, data.plating || null, data.size || null,
        data.weight || null, data.collection || null, data.occasion || null,
        data.stock_status, data.is_active, data.is_visible, data.is_featured, data.display_order,
      ]
    );
    return result.rows[0];
  }

  static async update(id: string, data: ProductInput) {
    const slug = generateSlug(data.name);
    const result = await query(
      `UPDATE products SET name=$1, slug=$2, sku=$3, category_id=$4, short_description=$5, description=$6,
        price=$7, mrp=$8, material=$9, finish=$10, color=$11, stone_type=$12, plating=$13, size=$14,
        weight=$15, collection=$16, occasion=$17, stock_status=$18, is_active=$19, is_visible=$20,
        is_featured=$21, display_order=$22
       WHERE id=$23 AND deleted_at IS NULL RETURNING *`,
      [
        data.name, slug, data.sku, data.category_id, data.short_description || null, data.description || null,
        data.price || null, data.mrp || null, data.material || null, data.finish || null,
        data.color || null, data.stone_type || null, data.plating || null, data.size || null,
        data.weight || null, data.collection || null, data.occasion || null,
        data.stock_status, data.is_active, data.is_visible, data.is_featured, data.display_order, id,
      ]
    );
    if (result.rows.length === 0) throw { statusCode: 404, message: 'Product not found' };
    return result.rows[0];
  }

  static async updateStatus(id: string, status: { is_active?: boolean; is_visible?: boolean; is_featured?: boolean }) {
    const sets: string[] = [];
    const values: any[] = [];
    let idx = 1;
    if (status.is_active !== undefined) { sets.push(`is_active=$${idx++}`); values.push(status.is_active); }
    if (status.is_visible !== undefined) { sets.push(`is_visible=$${idx++}`); values.push(status.is_visible); }
    if (status.is_featured !== undefined) { sets.push(`is_featured=$${idx++}`); values.push(status.is_featured); }
    if (sets.length === 0) throw { statusCode: 400, message: 'No status field provided' };
    values.push(id);
    const result = await query(`UPDATE products SET ${sets.join(', ')} WHERE id=$${idx} AND deleted_at IS NULL RETURNING *`, values);
    if (result.rows.length === 0) throw { statusCode: 404, message: 'Product not found' };
    return result.rows[0];
  }

  static async softDelete(id: string) {
    const result = await query(`UPDATE products SET deleted_at = NOW(), is_active = false WHERE id = $1 AND deleted_at IS NULL RETURNING *`, [id]);
    if (result.rows.length === 0) throw { statusCode: 404, message: 'Product not found' };
    return result.rows[0];
  }

  static async addImages(productId: string, files: Express.Multer.File[]) {
    await this.getById(productId); // verify exists
    const existingImages = await query('SELECT COUNT(*) FROM product_images WHERE product_id = $1', [productId]);
    const hasPrimary = parseInt(existingImages.rows[0].count) === 0;

    const results = [];
    for (let i = 0; i < files.length; i++) {
      const imageUrl = `/uploads/products/${files[i].filename}`;
      const isPrimary = hasPrimary && i === 0;
      const result = await query(
        'INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES ($1,$2,$3,$4) RETURNING *',
        [productId, imageUrl, isPrimary, i]
      );
      results.push(result.rows[0]);
    }
    return results;
  }

  static async deleteImage(productId: string, imageId: string) {
    const result = await query('DELETE FROM product_images WHERE id = $1 AND product_id = $2 RETURNING *', [imageId, productId]);
    if (result.rows.length === 0) throw { statusCode: 404, message: 'Image not found' };
    // Delete file
    const filePath = path.join(process.cwd(), result.rows[0].image_url);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    // If deleted image was primary, set next one as primary
    if (result.rows[0].is_primary) {
      await query(
        `UPDATE product_images SET is_primary = true WHERE product_id = $1 AND id = (
          SELECT id FROM product_images WHERE product_id = $1 ORDER BY display_order LIMIT 1
        )`,
        [productId]
      );
    }
    return result.rows[0];
  }

  static async setPrimaryImage(productId: string, imageId: string) {
    await query('UPDATE product_images SET is_primary = false WHERE product_id = $1', [productId]);
    const result = await query('UPDATE product_images SET is_primary = true WHERE id = $1 AND product_id = $2 RETURNING *', [imageId, productId]);
    if (result.rows.length === 0) throw { statusCode: 404, message: 'Image not found' };
    return result.rows[0];
  }
}
