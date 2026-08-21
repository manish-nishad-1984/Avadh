import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminApi } from '../../api/services';
import { Inquiry, InquiryStatus } from '../../types';
import { ArrowLeft, User, MessageSquare, Save, Package } from 'lucide-react';
import toast from 'react-hot-toast';

export const InquiryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [status, setStatus] = useState<InquiryStatus>('new');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchInquiry = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await adminApi.getInquiry(id);
      if (res.success) {
        setInquiry(res.data);
        setStatus(res.data.status);
        setNotes(res.data.admin_notes || '');
      }
    } catch (e) {
      toast.error('Failed to fetch inquiry details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiry();
  }, [id]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!id) return;
    try {
      const res = await adminApi.updateInquiryStatus(id, newStatus);
      if (res.success) {
        setStatus(newStatus as InquiryStatus);
        toast.success(`Status changed to ${newStatus}`);
      }
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  const handleSaveNotes = async () => {
    if (!id) return;
    setIsSaving(true);
    try {
      const res = await adminApi.updateInquiryNotes(id, notes);
      if (res.success) {
        toast.success('Admin notes saved');
      }
    } catch (e) {
      toast.error('Failed to save notes');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!inquiry) {
    return <p className="text-center py-12 text-slate-500">Inquiry not found.</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm gap-4">
        <div>
          <Link to="/admin/inquiries" className="text-xs font-semibold text-gold-700 hover:text-maroon-900 flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Inquiries List
          </Link>
          <h1 className="font-serif font-bold text-2xl text-slate-900 flex items-center gap-3">
            Inquiry #{inquiry.inquiry_number}
            <span className="text-xs font-sans font-normal bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full uppercase font-bold">
              {inquiry.inquiry_type}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Submitted on {new Date(inquiry.created_at).toLocaleString()}</p>
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-600">Status:</span>
          <select
            value={status}
            onChange={(e) => handleUpdateStatus(e.target.value)}
            className="text-xs font-bold p-1.5 rounded-lg border border-slate-300 bg-white uppercase text-slate-800"
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="quoted">Quoted</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-gold-600" /> Customer Information
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block">Full Name</span>
              <span className="font-bold text-slate-800 text-sm">{inquiry.customer_name}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400 font-semibold block">Mobile</span>
                <a href={`tel:${inquiry.mobile}`} className="font-mono font-bold text-maroon-900 hover:underline">
                  {inquiry.mobile}
                </a>
              </div>
              {inquiry.whatsapp && (
                <div>
                  <span className="text-slate-400 font-semibold block">WhatsApp</span>
                  <a
                    href={`https://wa.me/${inquiry.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono font-bold text-emerald-700 hover:underline"
                  >
                    {inquiry.whatsapp}
                  </a>
                </div>
              )}
            </div>

            {inquiry.email && (
              <div>
                <span className="text-slate-400 font-semibold block">Email</span>
                <span className="text-slate-800">{inquiry.email}</span>
              </div>
            )}

            {inquiry.company_name && (
              <div>
                <span className="text-slate-400 font-semibold block">Company / Business</span>
                <span className="font-semibold text-slate-800">{inquiry.company_name}</span>
              </div>
            )}

            {(inquiry.city || inquiry.state) && (
              <div>
                <span className="text-slate-400 font-semibold block">Location</span>
                <span className="text-slate-800">{[inquiry.city, inquiry.state].filter(Boolean).join(', ')}</span>
              </div>
            )}

            {inquiry.message && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 font-semibold block mb-1">Customer Message</span>
                <p className="bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/60 text-slate-700 leading-relaxed italic">
                  "{inquiry.message}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Inquired Products Snapshot */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Package className="w-4 h-4 text-gold-600" /> Requested Products ({inquiry.items?.length || 0})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-3">Product Name</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Qty</th>
                    <th className="p-3">Est. Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inquiry.items?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-800">{item.product_name}</td>
                      <td className="p-3 font-mono font-bold text-amber-800">{item.sku}</td>
                      <td className="p-3 font-extrabold text-maroon-900">{item.quantity}</td>
                      <td className="p-3 font-semibold text-slate-700">
                        {item.price ? `₹${item.price}` : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Admin Internal Notes */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-serif font-bold text-base text-slate-800 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gold-600" /> Internal Admin Notes
            </h3>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal follow-up notes, quotation pricing sent, customer remarks..."
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSaveNotes}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-5 py-2 gold-gradient text-white font-bold text-xs rounded-xl shadow-md hover:brightness-105"
              >
                <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Internal Notes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
