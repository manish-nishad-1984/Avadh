import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/services';
import { Banner } from '../../types';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export const BannerManagement: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    button_text: '',
    button_url: '',
    display_order: 0,
    is_active: true,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getBanners();
      if (res.success) setBanners(res.data);
    } catch (e) {
      toast.error('Failed to fetch banners');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleOpenModal = (b?: Banner) => {
    if (b) {
      setEditingBanner(b);
      setFormData({
        title: b.title || '',
        subtitle: b.subtitle || '',
        button_text: b.button_text || '',
        button_url: b.button_url || '',
        display_order: b.display_order,
        is_active: b.is_active,
      });
    } else {
      setEditingBanner(null);
      setFormData({ title: '', subtitle: '', button_text: 'Explore Catalog', button_url: '/categories', display_order: banners.length + 1, is_active: true });
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingBanner && !selectedFile) {
      toast.error('Banner image file is required for new banners');
      return;
    }

    try {
      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('subtitle', formData.subtitle);
      uploadData.append('button_text', formData.button_text);
      uploadData.append('button_url', formData.button_url);
      uploadData.append('display_order', String(formData.display_order));
      uploadData.append('is_active', String(formData.is_active));
      if (selectedFile) uploadData.append('image', selectedFile);

      if (editingBanner) {
        await adminApi.updateBanner(editingBanner.id, uploadData);
        toast.success('Banner updated');
      } else {
        await adminApi.createBanner(uploadData);
        toast.success('Banner created');
      }

      setIsModalOpen(false);
      fetchBanners();
    } catch (e: any) {
      toast.error(e.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      await adminApi.deleteBanner(id);
      toast.success('Banner deleted');
      fetchBanners();
    } catch (e) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="font-serif font-bold text-xl text-slate-800">Banner Management</h1>
          <p className="text-xs text-slate-500">Manage homepage hero carousel sliders</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 gold-gradient text-white font-bold text-xs rounded-xl shadow-md hover:brightness-105"
        >
          <Plus className="w-4 h-4" /> Add New Banner
        </button>
      </div>

      {isLoading ? (
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
              <div className="relative aspect-[16/9] bg-slate-900">
                <img src={b.image_url} alt={b.title || 'Banner'} className="w-full h-full object-cover" />
                <span className={`absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  b.is_active ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-white'
                }`}>
                  {b.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-sm text-slate-900 line-clamp-1">{b.title || 'Untitled Banner'}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{b.subtitle}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="font-semibold text-amber-800">Order: #{b.display_order}</span>
                  <div className="space-x-1">
                    <button
                      onClick={() => handleOpenModal(b)}
                      className="p-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-gold-500 hover:text-white transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Banner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-serif font-bold text-base">
                {editingBanner ? 'Edit Banner' : 'Add New Banner'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Banner Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                  placeholder="e.g. Royal Kundan Collection"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                  placeholder="e.g. Handcrafted Perfection for Special Occasions"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={formData.button_text}
                    onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Button URL</label>
                  <input
                    type="text"
                    value={formData.button_url}
                    onChange={(e) => setFormData({ ...formData, button_url: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.is_active ? 'active' : 'inactive'}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'active' })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Banner Image *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full text-slate-500 text-xs file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-900 cursor-pointer"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
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
                  <Save className="w-4 h-4" /> Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
