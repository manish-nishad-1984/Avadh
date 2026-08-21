import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/services';
import { Product, Category } from '../../types';
import { Plus, Edit2, Trash2, Star, Search, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { Pagination } from '../../components/shared/Pagination';

export const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    sku: '',
    short_description: '',
    description: '',
    price: '',
    mrp: '',
    material: '',
    finish: '',
    color: '',
    stone_type: '',
    plating: '',
    size: '',
    weight: '',
    collection: '',
    occasion: '',
    stock_status: 'in_stock',
    is_active: true,
    is_visible: true,
    is_featured: false,
    display_order: 0,
  });

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        adminApi.getProducts({ page, limit: 10, search, category_id: selectedCategory }),
        adminApi.getCategories(),
      ]);

      if (pRes.success) {
        setProducts(pRes.data);
        if (pRes.meta) setTotalPages(pRes.meta.totalPages);
      }
      if (cRes.success) setCategories(cRes.data);
    } catch (e: any) {
      toast.error('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search, selectedCategory]);

  const handleOpenModal = (prod?: Product) => {
    if (prod) {
      setEditingProduct(prod);
      setFormData({
        name: prod.name,
        category_id: prod.category_id,
        sku: prod.sku,
        short_description: prod.short_description || '',
        description: prod.description || '',
        price: prod.price ? String(prod.price) : '',
        mrp: prod.mrp ? String(prod.mrp) : '',
        material: prod.material || '',
        finish: prod.finish || '',
        color: prod.color || '',
        stone_type: prod.stone_type || '',
        plating: prod.plating || '',
        size: prod.size || '',
        weight: prod.weight || '',
        collection: prod.collection || '',
        occasion: prod.occasion || '',
        stock_status: prod.stock_status,
        is_active: prod.is_active,
        is_visible: prod.is_visible,
        is_featured: prod.is_featured,
        display_order: prod.display_order,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        category_id: categories.length > 0 ? categories[0].id : '',
        sku: `AVD-${Math.floor(1000 + Math.random() * 9000)}`,
        short_description: '',
        description: '',
        price: '',
        mrp: '',
        material: '',
        finish: '',
        color: '',
        stone_type: '',
        plating: '',
        size: '',
        weight: '',
        collection: '',
        occasion: '',
        stock_status: 'in_stock',
        is_active: true,
        is_visible: true,
        is_featured: false,
        display_order: 0,
      });
    }
    setSelectedFiles(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
        mrp: formData.mrp ? parseFloat(formData.mrp) : null,
      };

      let prodId = editingProduct?.id;

      if (editingProduct) {
        const res = await adminApi.updateProduct(editingProduct.id, payload);
        if (res.success) toast.success('Product updated');
      } else {
        const res = await adminApi.createProduct(payload);
        if (res.success) {
          prodId = res.data.id;
          toast.success('Product created');
        }
      }

      if (selectedFiles && selectedFiles.length > 0 && prodId) {
        const uploadData = new FormData();
        for (let i = 0; i < selectedFiles.length; i++) {
          uploadData.append('images', selectedFiles[i]);
        }
        await adminApi.uploadProductImages(prodId, uploadData);
        toast.success('Images uploaded successfully');
      }

      setIsModalOpen(false);
      fetchData();
    } catch (e: any) {
      toast.error(e.message || 'Product save failed');
    }
  };

  const handleToggleStatus = async (prod: Product, key: 'is_active' | 'is_visible' | 'is_featured') => {
    try {
      const updatedValue = !prod[key];
      const res = await adminApi.updateProductStatus(prod.id, { [key]: updatedValue });
      if (res.success) {
        toast.success(`Updated ${key.replace('is_', '')}`);
        fetchData();
      }
    } catch (e: any) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to soft delete this product?')) return;
    try {
      const res = await adminApi.deleteProduct(id);
      if (res.success) {
        toast.success('Product deleted');
        fetchData();
      }
    } catch (e: any) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm gap-4">
        <div>
          <h1 className="font-serif font-bold text-xl text-slate-800">Product Management</h1>
          <p className="text-xs text-slate-500">Manage jewellery products, pricing, specs & visibility</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 gold-gradient text-white font-bold text-xs rounded-xl shadow-md hover:brightness-105"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setPage(1);
          }}
          className="text-xs p-2 border border-slate-300 rounded-lg bg-white font-semibold text-slate-700"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b border-slate-200">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">SKU / Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Active</th>
                <th className="p-4">Visible</th>
                <th className="p-4">Featured</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <img
                      src={
                        prod.primary_image ||
                        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=100'
                      }
                      alt={prod.name}
                      className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                    />
                  </td>
                  <td className="p-4">
                    <span className="font-mono font-bold text-amber-800 text-[11px] block">{prod.sku}</span>
                    <span className="font-bold text-slate-800 line-clamp-1">{prod.name}</span>
                  </td>
                  <td className="p-4 text-slate-600 font-semibold">{prod.category_name}</td>
                  <td className="p-4 font-bold text-maroon-900">
                    {prod.price ? `₹${prod.price}` : 'Inquiry'}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleStatus(prod, 'is_active')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        prod.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {prod.is_active ? 'Yes' : 'No'}
                    </button>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleStatus(prod, 'is_visible')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        prod.is_visible ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {prod.is_visible ? 'Visible' : 'Hidden'}
                    </button>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleStatus(prod, 'is_featured')}
                      className={`p-1.5 rounded-lg ${
                        prod.is_featured ? 'bg-amber-100 text-gold-700' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenModal(prod)}
                      className="p-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-gold-500 hover:text-white transition-colors"
                      title="Edit Product"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(prod.id)}
                      className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-4 border-t border-slate-100">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
          </div>
        </div>
      )}

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
              <h3 className="font-serif font-bold text-base">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">SKU / Product Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    required
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stock Status</label>
                  <select
                    value={formData.stock_status}
                    onChange={(e) => setFormData({ ...formData, stock_status: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="on_order">On Order</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Optional price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Optional MRP"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Material</label>
                  <input
                    type="text"
                    placeholder="e.g. Alloy"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Plating</label>
                  <input
                    type="text"
                    placeholder="e.g. Gold Plated"
                    value={formData.plating}
                    onChange={(e) => setFormData({ ...formData, plating: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Stone Type</label>
                  <input
                    type="text"
                    placeholder="e.g. Kundan / CZ"
                    value={formData.stone_type}
                    onChange={(e) => setFormData({ ...formData, stone_type: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">Color</label>
                  <input
                    type="text"
                    placeholder="e.g. Gold"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Description</label>
                <input
                  type="text"
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Upload Product Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setSelectedFiles(e.target.files)}
                  className="w-full text-slate-500 text-xs file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-900 cursor-pointer"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-6 py-2 gold-gradient text-white font-semibold rounded-lg shadow-md hover:brightness-105"
                >
                  <Save className="w-4 h-4" /> Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
