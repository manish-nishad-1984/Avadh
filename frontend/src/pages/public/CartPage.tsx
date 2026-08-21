import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { InquiryModal } from '../../components/shared/InquiryModal';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, Send } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, totalItems } = useCart();
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-amber-200 shadow-sm max-w-lg mx-auto my-12 space-y-4">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-gold-700">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif font-bold text-2xl text-maroon-950">Your Inquiry Basket is Empty</h2>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          Browse our exquisite imitation jewellery collection and add items to your basket to request a wholesale or retail quote.
        </p>
        <Link
          to="/categories"
          className="inline-flex items-center gap-2 px-6 py-3 gold-gradient text-white font-bold text-xs rounded-xl shadow-md hover:brightness-105"
        >
          Explore Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-amber-200 pb-3">
        <div>
          <span className="text-xs uppercase font-bold text-gold-700 tracking-wider">Inquiry Basket</span>
          <h1 className="font-serif font-bold text-2xl text-maroon-950">
            Selected Products ({totalItems} items)
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Basket
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex gap-4 items-center">
                <img
                  src={
                    item.product.primary_image ||
                    (item.product.images && item.product.images.length > 0
                      ? item.product.images[0].image_url
                      : 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=200')
                  }
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-lg border border-amber-200 shrink-0"
                />
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-800 uppercase">
                    SKU: {item.product.sku}
                  </span>
                  <Link to={`/product/${item.product.slug}`} className="block">
                    <h3 className="font-serif font-bold text-sm text-slate-900 hover:text-gold-700">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-xs font-semibold text-maroon-900 mt-0.5">
                    {item.product.price ? `₹${item.product.price}` : 'Price on Inquiry'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-amber-100">
                {/* Quantity Controls */}
                <div className="flex items-center border border-amber-300 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-slate-700 font-bold text-xs"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-slate-800">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-slate-700 font-bold text-xs"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="pt-2">
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 text-xs font-bold text-gold-700 hover:text-maroon-900"
            >
              <ArrowLeft className="w-4 h-4" /> Continue Browsing Products
            </Link>
          </div>
        </div>

        {/* Inquiry Summary Box */}
        <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-md h-fit space-y-4">
          <h3 className="font-serif font-bold text-lg text-maroon-950 border-b border-amber-100 pb-3">
            Inquiry Submission
          </h3>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Total Product Varieties:</span>
              <span className="font-bold text-slate-900">{cart.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Units Requested:</span>
              <span className="font-bold text-slate-900">{totalItems}</span>
            </div>
          </div>

          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
            <p className="font-bold">✨ Wholesale Notice:</p>
            <p className="leading-relaxed">
              Submitting this inquiry does not require immediate online payment. Our executive will prepare an official quotation with best bulk discounts.
            </p>
          </div>

          <button
            onClick={() => setIsInquiryModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-3.5 gold-gradient text-white font-bold text-xs rounded-xl shadow-lg hover:brightness-105 transition-all"
          >
            <Send className="w-4 h-4" /> Send Basket Inquiry Now
          </button>
        </div>
      </div>

      {/* Inquiry Form Modal */}
      {isInquiryModalOpen && <InquiryModal onClose={() => setIsInquiryModalOpen(false)} />}
    </div>
  );
};
