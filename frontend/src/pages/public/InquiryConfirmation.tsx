import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Home } from 'lucide-react';

export const InquiryConfirmation: React.FC = () => {
  const location = useLocation();
  const inquiry = location.state?.inquiry;

  if (!inquiry) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-xl mx-auto my-12 bg-white rounded-2xl p-8 sm:p-10 border border-gold-300 shadow-2xl text-center space-y-6">
      <div className="w-20 h-20 gold-gradient text-white rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs uppercase font-bold text-gold-700 tracking-widest block">Success!</span>
        <h1 className="font-serif font-extrabold text-2xl sm:text-3xl text-maroon-950">
          Inquiry Submitted Successfully
        </h1>
        <p className="text-xs text-slate-600">
          Thank you, <strong className="text-slate-800">{inquiry.customer_name}</strong>! Your product inquiry has been received.
        </p>
      </div>

      {/* Details summary */}
      <div className="bg-amber-50/80 p-4 rounded-xl border border-amber-200/80 text-xs text-left space-y-2 font-sans">
        <div className="flex justify-between border-b border-amber-200/60 pb-1.5">
          <span className="text-slate-500 font-semibold">Inquiry Number:</span>
          <span className="font-mono font-bold text-maroon-900 text-sm bg-white px-2 py-0.5 rounded border border-amber-300">
            {inquiry.inquiry_number}
          </span>
        </div>
        <div className="flex justify-between border-b border-amber-200/60 pb-1.5">
          <span className="text-slate-500 font-semibold">Contact Mobile:</span>
          <span className="font-semibold text-slate-800">{inquiry.mobile}</span>
        </div>
        <div className="flex justify-between border-b border-amber-200/60 pb-1.5">
          <span className="text-slate-500 font-semibold">Inquiry Date:</span>
          <span className="font-semibold text-slate-800">{new Date(inquiry.created_at).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 font-semibold">Product Items:</span>
          <span className="font-semibold text-maroon-900">{inquiry.items?.length || 1} Item(s)</span>
        </div>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        Our sales representative will review your inquiry and contact you via phone or WhatsApp shortly.
      </p>

      <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-amber-50 text-maroon-950 border border-gold-300 font-bold text-xs rounded-xl hover:bg-gold-500 hover:text-white transition-colors"
        >
          <Home className="w-4 h-4" /> Back to Home
        </Link>
        <Link
          to="/categories"
          className="flex items-center justify-center gap-2 px-6 py-2.5 gold-gradient text-white font-bold text-xs rounded-xl shadow-md hover:brightness-105 transition-all"
        >
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
