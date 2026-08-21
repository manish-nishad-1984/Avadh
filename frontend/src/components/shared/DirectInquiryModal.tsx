import React, { useState } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { Product } from '../../types';
import { publicApi } from '../../api/services';
import toast from 'react-hot-toast';

interface DirectInquiryModalProps {
  product: Product;
  onClose: () => void;
}

export const DirectInquiryModal: React.FC<DirectInquiryModalProps> = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    customer_name: '',
    mobile: '',
    whatsapp: '',
    email: '',
    company_name: '',
    city: '',
    state: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.mobile) {
      toast.error('Name and Mobile number are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        inquiry_type: 'direct',
        items: [
          {
            product_id: product.id,
            product_name: product.name,
            sku: product.sku,
            quantity: Number(quantity),
            price: product.price || 0,
          },
        ],
      };

      const res = await publicApi.submitInquiry(payload);
      if (res.success) {
        setSubmittedInquiry(res.data);
        toast.success('Inquiry submitted successfully!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit inquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gold-300 relative">
        {/* Header */}
        <div className="bg-maroon-950 text-amber-50 px-6 py-4 flex items-center justify-between border-b border-gold-600">
          <div>
            <h3 className="font-serif font-bold text-lg text-gold-400">Send Product Inquiry</h3>
            <p className="text-xs text-amber-200/80">Direct wholesale & retail inquiry</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-maroon-900 rounded-full text-amber-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {submittedInquiry ? (
            <div className="text-center py-6 space-y-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
              <h4 className="font-serif font-bold text-xl text-slate-800">Inquiry Submitted!</h4>
              <p className="text-xs text-slate-600">
                Your inquiry number is: <span className="font-mono font-bold text-maroon-900 text-sm bg-amber-100 px-2 py-0.5 rounded">{submittedInquiry.inquiry_number}</span>
              </p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Thank you for your interest in <strong>{product.name}</strong>. Our sales team will get back to you shortly.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 gold-gradient text-white rounded-lg text-sm font-semibold shadow-md"
              >
                Close & Continue Browsing
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product summary card */}
              <div className="flex gap-3 bg-amber-50/60 p-3 rounded-xl border border-amber-200/80">
                <img
                  src={product.primary_image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=200'}
                  alt={product.name}
                  className="w-14 h-14 object-cover rounded-lg border border-amber-200"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif font-bold text-slate-900 text-xs truncate">{product.name}</h4>
                  <p className="text-[11px] font-mono text-amber-800">SKU: {product.sku}</p>
                  <p className="text-[11px] font-semibold text-maroon-900">
                    {product.price ? `₹${product.price}` : 'Price on inquiry'}
                  </p>
                </div>
                <div className="w-20">
                  <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full text-xs p-1.5 border border-amber-300 rounded-lg text-center font-bold"
                  />
                </div>
              </div>

              {/* Form fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">WhatsApp Number</label>
                  <input
                    type="tel"
                    placeholder="WhatsApp number"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="email@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company / Business Name</label>
                  <input
                    type="text"
                    placeholder="Optional business name"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">State</label>
                    <input
                      type="text"
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 text-xs">Message / Special Requirements</label>
                <textarea
                  rows={2}
                  placeholder="Specify customization, expected quantity, or queries..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2 gold-gradient text-white font-semibold text-xs rounded-lg shadow-md hover:brightness-105 transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
