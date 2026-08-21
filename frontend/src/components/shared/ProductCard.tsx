import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Send, Eye, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { DirectInquiryModal } from './DirectInquiryModal';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

  const primaryImage = product.primary_image || (product.images && product.images.length > 0 ? product.images[0].image_url : null);
  const fallbackImage = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600';

  return (
    <>
      <div className="group bg-white rounded-xl border border-amber-200/60 overflow-hidden card-hover-effect flex flex-col h-full relative">
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {product.is_featured && (
            <span className="bg-gold-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Featured
            </span>
          )}
          {product.stock_status === 'out_of_stock' && (
            <span className="bg-slate-700 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shadow-sm">
              Out of Stock
            </span>
          )}
        </div>

        {/* Image Container with Hover Quick Actions */}
        <div className="relative aspect-square bg-amber-50/40 overflow-hidden cursor-pointer">
          <Link to={`/product/${product.slug}`}>
            <img
              src={primaryImage || fallbackImage}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src = fallbackImage;
              }}
            />
          </Link>

          {/* Quick Hover Action overlay */}
          <div className="absolute inset-0 bg-maroon-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
            <Link
              to={`/product/${product.slug}`}
              className="p-2.5 bg-white/90 text-maroon-950 rounded-full hover:bg-gold-500 hover:text-white transition-colors shadow-lg"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setIsInquiryModalOpen(true)}
              className="p-2.5 bg-maroon-900 text-white rounded-full hover:bg-maroon-800 transition-colors shadow-lg"
              title="Direct Inquiry"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center text-[11px] text-amber-800 font-semibold mb-1 uppercase tracking-wider">
              <span>{product.category_name || 'Jewellery'}</span>
              <span className="bg-amber-100/80 px-1.5 py-0.5 rounded font-mono text-[10px] text-amber-900">
                {product.sku}
              </span>
            </div>

            <Link to={`/product/${product.slug}`} className="block">
              <h3 className="font-serif font-bold text-slate-900 text-sm hover:text-gold-700 transition-colors line-clamp-2 mb-1">
                {product.name}
              </h3>
            </Link>

            {product.short_description && (
              <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                {product.short_description}
              </p>
            )}
          </div>

          {/* Pricing & Actions */}
          <div className="pt-3 border-t border-amber-100 flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              {product.price ? (
                <div className="flex items-baseline gap-2">
                  <span className="font-serif font-bold text-maroon-900 text-base">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.mrp && product.mrp > product.price && (
                    <span className="text-xs text-slate-400 line-through">
                      ₹{product.mrp.toLocaleString()}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-xs font-semibold text-gold-700 italic">Price on Inquiry</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                onClick={() => addToCart(product, 1)}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-amber-50 text-maroon-900 border border-gold-300 hover:bg-gold-500 hover:text-white rounded-lg text-xs font-semibold transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" /> + Cart
              </button>
              <button
                onClick={() => setIsInquiryModalOpen(true)}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 gold-gradient text-white rounded-lg text-xs font-semibold hover:brightness-105 transition-all shadow-sm"
              >
                <Send className="w-3.5 h-3.5" /> Inquire
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Inquiry Modal */}
      {isInquiryModalOpen && (
        <DirectInquiryModal
          product={product}
          onClose={() => setIsInquiryModalOpen(false)}
        />
      )}
    </>
  );
};
