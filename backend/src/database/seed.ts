import bcrypt from 'bcryptjs';
import { pool } from '../config/database';

async function seed() {
  try {
    console.log('🌱 Seeding database...');

    // Seed admin user
    const passwordHash = await bcrypt.hash('admin123', 12);
    await pool.query(
      `INSERT INTO users (name, email, password_hash, role) VALUES ($1,$2,$3,$4) ON CONFLICT (email) DO NOTHING`,
      ['Admin', 'admin@avadh.com', passwordHash, 'admin']
    );
    console.log('✅ Admin user seeded (admin@avadh.com / admin123)');

    // Seed categories
    const categories = [
      { name: 'Necklace', slug: 'necklace', description: 'Elegant necklaces for every occasion', order: 1 },
      { name: 'Earrings', slug: 'earrings', description: 'Beautiful earrings collection', order: 2 },
      { name: 'Bangles', slug: 'bangles', description: 'Traditional and modern bangles', order: 3 },
      { name: 'Bracelets', slug: 'bracelets', description: 'Stylish bracelets for all', order: 4 },
      { name: 'Rings', slug: 'rings', description: 'Designer rings collection', order: 5 },
      { name: 'Bridal Jewellery', slug: 'bridal-jewellery', description: 'Complete bridal jewellery sets', order: 6 },
      { name: 'Jewellery Sets', slug: 'jewellery-sets', description: 'Complete matching jewellery sets', order: 7 },
    ];

    const catIds: Record<string, string> = {};
    for (const cat of categories) {
      const r = await pool.query(
        `INSERT INTO categories (name, slug, description, display_order) VALUES ($1,$2,$3,$4) ON CONFLICT (slug) DO UPDATE SET name=$1 RETURNING id`,
        [cat.name, cat.slug, cat.description, cat.order]
      );
      catIds[cat.slug] = r.rows[0].id;
    }
    console.log('✅ Categories seeded');

    // Seed products
    const products = [
      { name: 'Royal Bridal Necklace Set', sku: 'AVD-0001', cat: 'bridal-jewellery', price: 2499, mrp: 3999, material: 'Alloy', plating: 'Gold Plated', color: 'Gold', featured: true, desc: 'A stunning royal bridal necklace set with intricate kundan work and pearl accents.' },
      { name: 'Gold Plated Temple Necklace', sku: 'AVD-0002', cat: 'necklace', price: 1299, mrp: 1999, material: 'Brass', plating: 'Gold Plated', color: 'Gold', featured: true, desc: 'Traditional temple design necklace with antique gold plating.' },
      { name: 'CZ Diamond Earrings', sku: 'AVD-0003', cat: 'earrings', price: 799, mrp: 1299, material: 'Alloy', plating: 'Rhodium', color: 'Silver', stone_type: 'CZ Diamond', featured: true, desc: 'Sparkling cubic zirconia diamond earrings with rhodium plating.' },
      { name: 'Designer Bridal Bangles', sku: 'AVD-0004', cat: 'bangles', price: 1599, mrp: 2499, material: 'Lac', plating: 'Gold Plated', color: 'Red & Gold', featured: true, desc: 'Handcrafted bridal bangles with stone work and gold plating.' },
      { name: 'Antique Finish Necklace', sku: 'AVD-0005', cat: 'necklace', price: 999, mrp: 1599, material: 'Copper', plating: 'Antique Gold', color: 'Antique Gold', featured: false, desc: 'Vintage inspired antique finish necklace with oxidized look.' },
      { name: 'Pearl Jewellery Set', sku: 'AVD-0006', cat: 'jewellery-sets', price: 1899, mrp: 2999, material: 'Alloy', plating: 'Gold Plated', color: 'White & Gold', stone_type: 'Pearl', featured: true, desc: 'Elegant pearl jewellery set including necklace and earrings.' },
      { name: 'Kundan Choker Necklace', sku: 'AVD-0007', cat: 'necklace', price: 1499, mrp: 2299, material: 'Alloy', plating: 'Gold Plated', color: 'Multi', stone_type: 'Kundan', featured: true, desc: 'Beautiful kundan choker with meenakari work on the back.' },
      { name: 'Rose Gold Bracelet', sku: 'AVD-0008', cat: 'bracelets', price: 599, mrp: 999, material: 'Stainless Steel', plating: 'Rose Gold', color: 'Rose Gold', featured: false, desc: 'Minimalist rose gold bracelet for daily wear.' },
      { name: 'Oxidized Silver Jhumka', sku: 'AVD-0009', cat: 'earrings', price: 399, mrp: 699, material: 'Alloy', plating: 'Oxidized Silver', color: 'Silver', featured: false, desc: 'Traditional oxidized silver jhumka earrings with mirror work.' },
      { name: 'Diamond Cut Ring', sku: 'AVD-0010', cat: 'rings', price: 499, mrp: 799, material: 'Alloy', plating: 'Gold Plated', color: 'Gold', stone_type: 'CZ', featured: false, desc: 'Elegant diamond cut adjustable ring with CZ stones.' },
      { name: 'Meenakari Bangle Set', sku: 'AVD-0011', cat: 'bangles', price: 899, mrp: 1499, material: 'Brass', plating: 'Gold Plated', color: 'Multi', featured: false, desc: 'Colorful meenakari bangles set of 6 pieces.' },
      { name: 'Bridal Complete Set', sku: 'AVD-0012', cat: 'bridal-jewellery', price: 4999, mrp: 7999, material: 'Alloy', plating: 'Gold Plated', color: 'Gold & Red', stone_type: 'Kundan', featured: true, desc: 'Complete bridal set with necklace, earrings, maang tikka, and bangles.' },
      { name: 'Statement Cocktail Ring', sku: 'AVD-0013', cat: 'rings', price: 699, mrp: 1099, material: 'Alloy', plating: 'Rose Gold', color: 'Rose Gold', stone_type: 'Crystal', featured: false, desc: 'Bold statement cocktail ring with crystal cluster.' },
      { name: 'Temple Earrings Gold', sku: 'AVD-0014', cat: 'earrings', price: 599, mrp: 999, material: 'Brass', plating: 'Gold Plated', color: 'Gold', featured: false, desc: 'Traditional temple design gold plated earrings.' },
      { name: 'Layered Chain Necklace', sku: 'AVD-0015', cat: 'necklace', price: 849, mrp: 1299, material: 'Alloy', plating: 'Gold Plated', color: 'Gold', featured: true, desc: 'Trendy multi-layer chain necklace with pendant accents.' },
    ];

    for (const p of products) {
      await pool.query(
        `INSERT INTO products (name, slug, sku, category_id, short_description, description, price, mrp, material, plating, color, stone_type, is_featured, stock_status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'in_stock') ON CONFLICT (sku) DO NOTHING`,
        [p.name, p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-'), p.sku, catIds[p.cat],
         p.desc.substring(0, 100), p.desc, p.price, p.mrp, p.material, p.plating, p.color, p.stone_type || null, p.featured]
      );
    }
    console.log('✅ 15 sample products seeded');

    // Seed website settings
    const settings = [
      ['company_name', 'AVADH Imitation Jewellery'],
      ['phone', '+91 98765 43210'],
      ['whatsapp', '+91 98765 43210'],
      ['email', 'info@avadhjewellery.com'],
      ['address', 'Rajkot, Gujarat, India'],
      ['facebook_url', ''],
      ['instagram_url', ''],
      ['youtube_url', ''],
      ['footer_text', '© 2026 AVADH Imitation Jewellery. All Rights Reserved.'],
      ['gst_number', ''],
    ];
    for (const [key, val] of settings) {
      await pool.query(
        `INSERT INTO website_settings (setting_key, setting_value) VALUES ($1,$2) ON CONFLICT (setting_key) DO NOTHING`,
        [key, val]
      );
    }
    console.log('✅ Website settings seeded');
    console.log('\n🎉 Database seeding completed!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await pool.end();
  }
}

seed();
