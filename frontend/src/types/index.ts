export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  category_name?: string;
  category_slug?: string;
  name: string;
  slug: string;
  sku: string;
  short_description?: string;
  description?: string;
  price?: number;
  mrp?: number;
  material?: string;
  finish?: string;
  color?: string;
  stone_type?: string;
  plating?: string;
  size?: string;
  weight?: string;
  collection?: string;
  occasion?: string;
  stock_status: 'in_stock' | 'out_of_stock' | 'on_order';
  is_active: boolean;
  is_visible: boolean;
  is_featured: boolean;
  display_order: number;
  primary_image?: string;
  images?: ProductImage[];
  related_products?: Product[];
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface Banner {
  id: string;
  title?: string;
  subtitle?: string;
  image_url: string;
  button_text?: string;
  button_url?: string;
  display_order: number;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface InquiryItem {
  id?: string;
  product_id: string;
  product_name: string;
  sku: string;
  quantity: number;
  price?: number;
  product_image?: string;
}

export type InquiryStatus = 'new' | 'contacted' | 'quoted' | 'in_progress' | 'completed' | 'cancelled';
export type InquiryType = 'direct' | 'cart';

export interface Inquiry {
  id: string;
  inquiry_number: string;
  customer_name: string;
  mobile: string;
  whatsapp?: string;
  email?: string;
  company_name?: string;
  city?: string;
  state?: string;
  message?: string;
  status: InquiryStatus;
  inquiry_type: InquiryType;
  admin_notes?: string;
  item_count?: number;
  items?: InquiryItem[];
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WebsiteSettings {
  company_name?: string;
  logo_url?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  footer_text?: string;
  gst_number?: string;
  [key: string]: string | undefined;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
