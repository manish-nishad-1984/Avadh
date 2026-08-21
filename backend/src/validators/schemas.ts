import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
});

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
  description: z.string().optional(),
  display_order: z.coerce.number().int().min(0).default(0),
  is_active: z.coerce.boolean().default(true),
});

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200),
  category_id: z.string().uuid('Valid category is required'),
  sku: z.string().min(1, 'SKU is required').max(50),
  short_description: z.string().max(500).optional(),
  description: z.string().optional(),
  price: z.coerce.number().min(0).optional().nullable(),
  mrp: z.coerce.number().min(0).optional().nullable(),
  material: z.string().max(100).optional(),
  finish: z.string().max(100).optional(),
  color: z.string().max(100).optional(),
  stone_type: z.string().max(100).optional(),
  plating: z.string().max(100).optional(),
  size: z.string().max(100).optional(),
  weight: z.string().max(50).optional(),
  collection: z.string().max(100).optional(),
  occasion: z.string().max(100).optional(),
  stock_status: z.enum(['in_stock', 'out_of_stock', 'on_order']).default('in_stock'),
  is_active: z.coerce.boolean().default(true),
  is_visible: z.coerce.boolean().default(true),
  is_featured: z.coerce.boolean().default(false),
  display_order: z.coerce.number().int().min(0).default(0),
});

export const productStatusSchema = z.object({
  is_active: z.boolean().optional(),
  is_visible: z.boolean().optional(),
  is_featured: z.boolean().optional(),
});

export const bannerSchema = z.object({
  title: z.string().max(200).optional(),
  subtitle: z.string().max(300).optional(),
  button_text: z.string().max(100).optional(),
  button_url: z.string().max(500).optional(),
  display_order: z.coerce.number().int().min(0).default(0),
  is_active: z.coerce.boolean().default(true),
  start_date: z.string().optional().nullable(),
  end_date: z.string().optional().nullable(),
});

export const inquirySchema = z.object({
  customer_name: z.string().min(1, 'Name is required').max(100),
  mobile: z.string().min(10, 'Valid mobile number is required').max(20),
  whatsapp: z.string().max(20).optional(),
  email: z.string().email('Valid email required').optional().or(z.literal('')),
  company_name: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  message: z.string().optional(),
  inquiry_type: z.enum(['direct', 'cart']).default('cart'),
  items: z
    .array(
      z.object({
        product_id: z.string().uuid(),
        product_name: z.string(),
        sku: z.string(),
        quantity: z.coerce.number().int().min(1).default(1),
        price: z.coerce.number().min(0).optional().nullable(),
      })
    )
    .min(1, 'At least one product is required'),
});

export const inquiryStatusSchema = z.object({
  status: z.enum(['new', 'contacted', 'quoted', 'in_progress', 'completed', 'cancelled']),
});

export const inquiryNotesSchema = z.object({
  admin_notes: z.string(),
});

export const settingsSchema = z.object({
  settings: z.array(
    z.object({
      setting_key: z.string().min(1),
      setting_value: z.string().optional().nullable(),
    })
  ),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type BannerInput = z.infer<typeof bannerSchema>;
export type InquiryInput = z.infer<typeof inquirySchema>;
