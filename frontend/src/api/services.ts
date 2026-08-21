import api from './axios';
import { ApiResponse, Category, Product, Banner, Inquiry, WebsiteSettings, User } from '../types';

export const publicApi = {
  getCategories: (): Promise<ApiResponse<Category[]>> => api.get('/categories'),
  getCategoryBySlug: (slug: string): Promise<ApiResponse<Category>> => api.get(`/categories/${slug}`),
  
  getProducts: (params?: Record<string, any>): Promise<ApiResponse<Product[]>> => api.get('/products', { params }),
  getFeaturedProducts: (): Promise<ApiResponse<Product[]>> => api.get('/products/featured'),
  getLatestProducts: (): Promise<ApiResponse<Product[]>> => api.get('/products/latest'),
  getProductBySlug: (slug: string): Promise<ApiResponse<Product>> => api.get(`/products/${slug}`),
  
  getBanners: (): Promise<ApiResponse<Banner[]>> => api.get('/banners'),
  getSettings: (): Promise<ApiResponse<WebsiteSettings>> => api.get('/settings'),
  
  submitInquiry: (payload: any): Promise<ApiResponse<Inquiry>> => api.post('/inquiries', payload),
};

export const adminApi = {
  login: (credentials: { email: string; password: string }): Promise<ApiResponse<{ token: string; user: User }>> =>
    api.post('/auth/login', credentials),
  getMe: (): Promise<ApiResponse<User>> => api.get('/auth/me'),

  getDashboardStats: (): Promise<ApiResponse<any>> => api.get('/admin/dashboard'),

  // Categories
  getCategories: (): Promise<ApiResponse<Category[]>> => api.get('/admin/categories'),
  getCategory: (id: string): Promise<ApiResponse<Category>> => api.get(`/admin/categories/${id}`),
  createCategory: (data: Partial<Category>): Promise<ApiResponse<Category>> => api.post('/admin/categories', data),
  updateCategory: (id: string, data: Partial<Category>): Promise<ApiResponse<Category>> => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id: string): Promise<ApiResponse<void>> => api.delete(`/admin/categories/${id}`),
  uploadCategoryImage: (id: string, formData: FormData): Promise<ApiResponse<Category>> =>
    api.post(`/admin/categories/${id}/image`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),

  // Products
  getProducts: (params?: Record<string, any>): Promise<ApiResponse<Product[]>> => api.get('/admin/products', { params }),
  getProduct: (id: string): Promise<ApiResponse<Product>> => api.get(`/admin/products/${id}`),
  createProduct: (data: any): Promise<ApiResponse<Product>> => api.post('/admin/products', data),
  updateProduct: (id: string, data: any): Promise<ApiResponse<Product>> => api.put(`/admin/products/${id}`, data),
  updateProductStatus: (id: string, status: { is_active?: boolean; is_visible?: boolean; is_featured?: boolean }): Promise<ApiResponse<Product>> =>
    api.patch(`/admin/products/${id}/status`, status),
  deleteProduct: (id: string): Promise<ApiResponse<void>> => api.delete(`/admin/products/${id}`),
  uploadProductImages: (id: string, formData: FormData): Promise<ApiResponse<any>> =>
    api.post(`/admin/products/${id}/images`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteProductImage: (productId: string, imageId: string): Promise<ApiResponse<void>> =>
    api.delete(`/admin/products/${productId}/images/${imageId}`),
  setPrimaryProductImage: (productId: string, imageId: string): Promise<ApiResponse<void>> =>
    api.patch(`/admin/products/${productId}/images/${imageId}/primary`),

  // Banners
  getBanners: (): Promise<ApiResponse<Banner[]>> => api.get('/admin/banners'),
  getBanner: (id: string): Promise<ApiResponse<Banner>> => api.get(`/admin/banners/${id}`),
  createBanner: (formData: FormData): Promise<ApiResponse<Banner>> =>
    api.post('/admin/banners', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateBanner: (id: string, formData: FormData): Promise<ApiResponse<Banner>> =>
    api.put(`/admin/banners/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteBanner: (id: string): Promise<ApiResponse<void>> => api.delete(`/admin/banners/${id}`),

  // Inquiries
  getInquiries: (params?: Record<string, any>): Promise<ApiResponse<Inquiry[]>> => api.get('/admin/inquiries', { params }),
  getInquiry: (id: string): Promise<ApiResponse<Inquiry>> => api.get(`/admin/inquiries/${id}`),
  updateInquiryStatus: (id: string, status: string): Promise<ApiResponse<Inquiry>> =>
    api.patch(`/admin/inquiries/${id}/status`, { status }),
  updateInquiryNotes: (id: string, admin_notes: string): Promise<ApiResponse<Inquiry>> =>
    api.patch(`/admin/inquiries/${id}/notes`, { admin_notes }),

  // Settings
  getSettings: (): Promise<ApiResponse<WebsiteSettings>> => api.get('/admin/settings'),
  updateSettings: (settings: Array<{ setting_key: string; setting_value: string | null }>): Promise<ApiResponse<WebsiteSettings>> =>
    api.put('/admin/settings', { settings }),
  uploadLogo: (formData: FormData): Promise<ApiResponse<{ logo_url: string }>> =>
    api.post('/admin/settings/logo', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};
