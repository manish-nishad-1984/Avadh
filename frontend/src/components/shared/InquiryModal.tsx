import React, { useState } from 'react';
import { X, Send, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { publicApi } from '../../api/services';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface InquiryModalProps {
  onClose: () => void;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({ onClose }) => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.mobile) {
      toast.error('Customer Name and Mobile number are required');
      return;
    }

    if (cart.length === 0) {
      toast.error('Your inquiry cart is empty');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        inquiry_type: 'cart',
        items: cart.map((item) => ({
          product_id: item.product.id,
          product_name: item.product.name,
          sku: item.product.sku,
          quantity: item.quantity,
          price: item.product.price || 0,
        })),
      };

      const res = await publicApi.submitInquiry(payload);
      if (res.success) {
        toast.success('Inquiry submitted successfully!');
        clearCart();
        onClose();
        navigate('/inquiry/confirm', { state: { inquiry: res.data } });
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit inquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-gold-300 relative">
        {/* Header */}
        <div className="bg-maroon-950 text-amber-50 px-6 py-4 flex items-center justify-between border-b border-gold-600">
          <div>
            <h3 className="font-serif font-bold text-lg text-gold-400 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gold-400" /> Submit Cart Inquiry
            </h3>
            <p className="text-xs text-amber-200/80">
              Submitting inquiry for {cart.length} item(s)
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-maroon-900 rounded-full text-amber-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto space-y-4">
          <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200 text-xs space-y-1">
            <p className="font-semibold text-amber-900">Inquiry Summary:</p>
            <div className="max-h-24 overflow-y-auto space-y-1 pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between items-center text-slate-700">
                  <span className="truncate max-w-[280px]">
                    • {item.product.name} ({item.product.sku})
                  </span>
                  <span className="font-mono font-semibold text-maroon-900">Qty: {item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Customer Name *</label>
              <input
                type="text"
                required
                placeholder="Full Name"
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
                placeholder="10-digit Mobile"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">WhatsApp Number</label>
              <input
                type="tel"
                placeholder="WhatsApp Number"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-gold-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company / Firm Name</label>
              <input
                type="text"
                placeholder="Optional Business Name"
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
            <label className="block font-semibold text-slate-700 mb-1 text-xs">Message / Delivery Notes</label>
            <textarea
              rows={2}
              placeholder="Add any specific requirements or message..."
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
      </div>
    </div>
  );
};
