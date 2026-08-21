import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';
import { publicApi } from '../../api/services';
import { Product, Category, Banner } from '../../types';
import { ProductCard } from '../../components/shared/ProductCard';

export const Home: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [bRes, cRes, fRes, lRes] = await Promise.all([
          publicApi.getBanners(),
          publicApi.getCategories(),
          publicApi.getFeaturedProducts(),
          publicApi.getLatestProducts(),
        ]);
        if (bRes.success) setBanners(bRes.data);
        if (cRes.success) setCategories(cRes.data);
        if (fRes.success) setFeaturedProducts(fRes.data);
        if (lRes.success) setLatestProducts(lRes.data);
      } catch (e) {
        console.error('Error loading home data:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadHomeData();
  }, []);

  // Banner auto-slide
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBannerIdx((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const defaultBanner = {
    title: 'Exquisite Kundan & Antique Jewellery Collection',
    subtitle: 'Handcrafted Perfection for Every Special Occasion & Bridal Grandeur',
    image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1600',
    button_text: 'Explore Catalog',
    button_url: '/categories',
  };

  const currentBanner = banners.length > 0 ? banners[activeBannerIdx] : defaultBanner;

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-serif text-amber-900 font-semibold text-sm">Loading AVADH Collection...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Banner Carousel */}
      <section className="relative rounded-2xl overflow-hidden shadow-2xl border border-gold-300 min-h-[380px] sm:min-h-[460px] flex items-center">
        <div className="absolute inset-0 bg-slate-900/40 z-10"></div>
        <img
          src={currentBanner.image_url}
          alt={currentBanner.title || 'Hero Banner'}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 scale-105"
        />

        <div className="relative z-20 max-w-2xl px-6 sm:px-12 py-10 text-white space-y-4">
          <span className="inline-flex items-center gap-1.5 bg-gold-500/90 backdrop-blur-md text-white font-bold text-xs uppercase px-3 py-1 rounded-full tracking-wider shadow-md">
            <Sparkles className="w-3.5 h-3.5" /> AVADH Signature Collection
          </span>
          <h1 className="font-serif font-extrabold text-3xl sm:text-5xl text-white leading-tight shadow-sm drop-shadow-md">
            {currentBanner.title || defaultBanner.title}
          </h1>
          <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed font-light drop-shadow">
            {currentBanner.subtitle || defaultBanner.subtitle}
          </p>

          <div className="pt-2 flex items-center gap-4">
            <Link
              to={currentBanner.button_url || '/categories'}
              className="inline-flex items-center gap-2 gold-gradient hover:brightness-110 text-white font-bold px-6 py-3 rounded-xl shadow-xl transition-all"
            >
              {currentBanner.button_text || 'View Products'} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Carousel Indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveBannerIdx(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === activeBannerIdx ? 'bg-gold-400 w-8' : 'bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Feature Highlights */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Award, title: 'Premium Finish', desc: 'Crafted with fine plating & stones' },
          { icon: ShieldCheck, title: 'Direct Factory Pricing', desc: 'Best wholesale & bulk rates' },
          { icon: Truck, title: 'Safe Dispatch', desc: 'Secure packaging & shipping' },
          { icon: RefreshCw, title: 'Custom Orders', desc: 'Inquiry based custom quantities' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white p-4 rounded-xl border border-amber-200/70 shadow-sm flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-100/60 text-gold-700">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-xs text-maroon-950">{item.title}</h4>
                <p className="text-[11px] text-slate-500">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Featured Categories */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-amber-200 pb-3">
          <div>
            <span className="text-xs uppercase font-bold text-gold-700 tracking-widest block">Explore By Category</span>
            <h2 className="font-serif font-bold text-2xl text-maroon-950">Curated Categories</h2>
          </div>
          <Link to="/categories" className="text-xs font-bold text-gold-700 hover:text-maroon-900 flex items-center gap-1">
            All Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group bg-white rounded-xl p-3 border border-amber-200/60 text-center card-hover-effect flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-amber-100/50 p-2 mb-2 flex items-center justify-center group-hover:bg-gold-500 transition-colors overflow-hidden border border-amber-300">
                {cat.image_url ? (
                  <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <Sparkles className="w-7 h-7 text-gold-700 group-hover:text-white transition-colors" />
                )}
              </div>
              <h3 className="font-serif font-bold text-xs text-slate-800 group-hover:text-gold-700 transition-colors line-clamp-1">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex justify-between items-end border-b border-amber-200 pb-3">
            <div>
              <span className="text-xs uppercase font-bold text-gold-700 tracking-widest block">Top Choices</span>
              <h2 className="font-serif font-bold text-2xl text-maroon-950">Featured Jewellery</h2>
            </div>
            <Link to="/categories" className="text-xs font-bold text-gold-700 hover:text-maroon-900 flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Arrivals */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-amber-200 pb-3">
          <div>
            <span className="text-xs uppercase font-bold text-gold-700 tracking-widest block">Fresh Designs</span>
            <h2 className="font-serif font-bold text-2xl text-maroon-950">Latest Products</h2>
          </div>
          <Link to="/categories" className="text-xs font-bold text-gold-700 hover:text-maroon-900 flex items-center gap-1">
            Browse All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {latestProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Call To Action Section */}
      <section className="maroon-gradient text-amber-50 rounded-2xl p-8 sm:p-12 text-center border-2 border-gold-500 shadow-xl space-y-4">
        <h2 className="font-serif font-extrabold text-2xl sm:text-4xl text-gold-300">
          Looking for Wholesale Bulk Inquiries?
        </h2>
        <p className="text-xs sm:text-sm text-amber-100/90 max-w-xl mx-auto leading-relaxed">
          Add desired items to your inquiry cart or send direct product inquiries to get instant factory quotation and pricing catalog.
        </p>
        <div className="pt-2 flex justify-center gap-4">
          <Link
            to="/categories"
            className="gold-gradient hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider px-8 py-3 rounded-xl shadow-lg transition-all"
          >
            Browse Complete Catalog
          </Link>
        </div>
      </section>
    </div>
  );
};
