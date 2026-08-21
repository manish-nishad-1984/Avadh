import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicApi } from '../../api/services';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { ProductCard } from '../../components/shared/ProductCard';
import { DirectInquiryModal } from '../../components/shared/DirectInquiryModal';
import { ShoppingBag, Send, ShieldCheck, Truck, Sparkles, ChevronRight } from 'lucide-react';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      setIsLoading(true);
      try {
        const res = await publicApi.getProductBySlug(slug);
        if (res.success) {
          setProduct(res.data);
          const primImg = res.data.primary_image || (res.data.images && res.data.images.length > 0 ? res.data.images[0].image_url : '');
          setActiveImage(primImg);
        }
      } catch (e) {
        console.error('Failed to load product detail:', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const fallbackImage = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800';

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="font-serif font-bold text-2xl text-slate-800">Product Not Found</h2>
        <Link to="/categories" className="inline-block px-4 py-2 gold-gradient text-white text-xs font-bold rounded-lg">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const specs = [
    { label: 'Category', value: product.category_name },
    { label: 'SKU / Code', value: product.sku },
    { label: 'Material', value: product.material },
    { label: 'Plating', value: product.plating },
    { label: 'Color', value: product.color },
    { label: 'Stone Type', value: product.stone_type },
    { label: 'Finish', value: product.finish },
    { label: 'Size', value: product.size },
    { label: 'Weight', value: product.weight },
    { label: 'Collection', value: product.collection },
    { label: 'Occasion', value: product.occasion },
    { label: 'Stock Status', value: product.stock_status === 'in_stock' ? 'In Stock' : 'On Order' },
  ].filter((s) => s.value);

  return (
    <div className="space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-serif">
        <Link to="/" className="hover:text-gold-700">Home</Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <Link to="/categories" className="hover:text-gold-700">Catalog</Link>
        {product.category_slug && (
          <>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <Link to={`/category/${product.category_slug}`} className="hover:text-gold-700">
              {product.category_name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="font-semibold text-slate-900 truncate">{product.name}</span>
      </nav>

      {/* Main Product Display */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-amber-200 shadow-md grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-amber-50/40 rounded-xl overflow-hidden border border-amber-200 relative group">
            <img
              src={activeImage || fallbackImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-zoom-in"
              onError={(e) => {
                (e.target as HTMLImageElement).src = fallbackImage;
              }}
            />
            {product.is_featured && (
              <span className="absolute top-3 left-3 bg-gold-500 text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Featured Collection
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(img.image_url)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                    activeImage === img.image_url ? 'border-gold-500 scale-95 shadow-md' : 'border-amber-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.image_url} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details & Actions */}
        <div className="space-y-6 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                {product.category_name}
              </span>
              <span className="font-mono text-slate-500 font-semibold">SKU: {product.sku}</span>
            </div>

            <h1 className="font-serif font-extrabold text-2xl sm:text-3xl text-maroon-950 leading-tight">
              {product.name}
            </h1>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 pt-2">
              {product.price ? (
                <>
                  <span className="font-serif font-extrabold text-3xl text-maroon-900">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.mrp && product.mrp > product.price && (
                    <span className="text-sm text-slate-400 line-through">
                      MRP ₹{product.mrp.toLocaleString()}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-base font-bold text-gold-700 italic">Price Available on Inquiry</span>
              )}
            </div>

            {product.short_description && (
              <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-amber-100">
                {product.short_description}
              </p>
            )}

            {/* Quantity Selector & Action Buttons */}
            <div className="pt-4 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-amber-300 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-slate-700 font-bold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 text-center text-xs font-bold py-1 focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-slate-700 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => addToCart(product, quantity)}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-amber-50 text-maroon-950 border-2 border-gold-400 hover:bg-gold-500 hover:text-white rounded-xl font-bold text-xs transition-colors shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" /> Add To Inquiry Cart
                </button>
                <button
                  onClick={() => setIsInquiryModalOpen(true)}
                  className="flex items-center justify-center gap-2 py-3 px-4 gold-gradient text-white rounded-xl font-bold text-xs shadow-lg hover:brightness-105 transition-all"
                >
                  <Send className="w-4 h-4" /> Direct Product Inquiry
                </button>
              </div>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-amber-100 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <ShieldCheck className="w-4 h-4 text-gold-600 shrink-0" />
              <span>Certified Quality Finish</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Truck className="w-4 h-4 text-gold-600 shrink-0" />
              <span>Pan-India Safe Dispatch</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications & Description Tabs */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-amber-200 shadow-sm space-y-6">
        <h3 className="font-serif font-bold text-xl text-maroon-950 border-b border-amber-100 pb-3">
          Jewellery Specifications & Description
        </h3>

        {product.description && (
          <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line space-y-2">
            <p>{product.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-amber-100">
          {specs.map((spec, i) => (
            <div key={i} className="bg-amber-50/50 p-3 rounded-xl border border-amber-200/60 flex justify-between text-xs">
              <span className="font-semibold text-slate-500">{spec.label}</span>
              <span className="font-bold text-maroon-950">{spec.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Related Products */}
      {product.related_products && product.related_products.length > 0 && (
        <div className="space-y-6">
          <h2 className="font-serif font-bold text-2xl text-maroon-950 border-b border-amber-200 pb-3">
            Similar Jewellery You May Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {product.related_products.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}

      {/* Direct Inquiry Modal */}
      {isInquiryModalOpen && (
        <DirectInquiryModal
          product={product}
          onClose={() => setIsInquiryModalOpen(false)}
        />
      )}
    </div>
  );
};
