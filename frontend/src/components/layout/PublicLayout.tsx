import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Phone, Mail, MapPin, Menu, X, ChevronDown, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import { publicApi } from '../../api/services';
import { Category } from '../../types';

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { totalItems } = useCart();
  const { settings } = useSettings();
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await publicApi.getCategories();
        if (res.success) setCategories(res.data);
      } catch (e) {
        console.error('Failed to load categories', e);
      }
    };
    fetchCats();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="public-theme min-h-screen flex flex-col bg-amber-50/20">
      {/* Top Banner Bar */}
      <div className="bg-maroon-950 text-amber-100 text-xs py-2 px-4 border-b border-amber-900/40">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 hover:text-gold-400 transition-colors">
              <Phone className="w-3.5 h-3.5 text-gold-400" />
              <a href={`tel:${settings.phone}`}>{settings.phone}</a>
            </span>
            <span className="hidden sm:flex items-center gap-1.5 hover:text-gold-400 transition-colors">
              <Mail className="w-3.5 h-3.5 text-gold-400" />
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </span>
          </div>
          <div className="flex items-center gap-4 font-serif text-[11px] tracking-wider uppercase">
            <span className="flex items-center gap-1 text-gold-400">
              <Sparkles className="w-3 h-3" /> Exclusive Imitation Jewellery Wholesale & Retail
            </span>
            <Link to="/admin/login" className="hover:text-gold-400 underline underline-offset-2">Admin Portal</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gold-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            {settings.logo_url ? (
              <img src={settings.logo_url} alt={settings.company_name} className="h-12 w-auto object-contain" />
            ) : (
              <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center text-white font-serif font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
                A
              </div>
            )}
            <div>
              <span className="font-serif font-bold text-xl sm:text-2xl text-maroon-950 tracking-wide block leading-tight">
                {settings.company_name || 'AVADH'}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-gold-700 font-semibold block">
                Imitation Jewellery
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Search by product name, SKU code, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 rounded-full text-sm bg-amber-50/50 border border-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-700 hover:text-maroon-900">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Action Icons & Mobile Menu Button */}
          <div className="flex items-center gap-3">
            <Link
              to="/cart"
              className="relative p-2 rounded-full text-maroon-950 hover:bg-amber-100/60 transition-colors"
              title="Inquiry Cart"
            >
              <ShoppingBag className="w-6 h-6 text-gold-700" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-maroon-700 text-white font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-maroon-950 hover:bg-amber-100/60 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="bg-maroon-950 text-amber-50 hidden md:block border-t border-gold-800/40">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-8 font-serif text-sm">
            <Link
              to="/"
              className={`py-3 hover:text-gold-400 transition-colors border-b-2 ${
                location.pathname === '/' ? 'border-gold-400 text-gold-400' : 'border-transparent'
              }`}
            >
              Home
            </Link>

            {/* Category Dropdown */}
            <div
              className="relative group py-3 cursor-pointer"
              onMouseEnter={() => setIsCategoryOpen(true)}
              onMouseLeave={() => setIsCategoryOpen(false)}
            >
              <span className="flex items-center gap-1 hover:text-gold-400 transition-colors">
                Categories <ChevronDown className="w-4 h-4" />
              </span>

              {isCategoryOpen && (
                <div className="absolute top-full left-0 w-64 bg-white text-slate-800 shadow-xl rounded-b-xl border border-gold-200 py-2 z-50 animate-fadeIn font-sans text-sm">
                  <Link
                    to="/categories"
                    className="block px-4 py-2 font-semibold text-maroon-950 hover:bg-amber-50 hover:text-gold-700 border-b border-amber-100"
                  >
                    All Categories
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      className="block px-4 py-2 hover:bg-amber-50 hover:text-gold-700 transition-colors"
                      onClick={() => setIsCategoryOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/categories"
              className={`py-3 hover:text-gold-400 transition-colors border-b-2 ${
                location.pathname === '/categories' ? 'border-gold-400 text-gold-400' : 'border-transparent'
              }`}
            >
              All Products
            </Link>
            <Link
              to="/cart"
              className={`py-3 hover:text-gold-400 transition-colors border-b-2 ${
                location.pathname === '/cart' ? 'border-gold-400 text-gold-400' : 'border-transparent'
              }`}
            >
              Inquiry Cart ({totalItems})
            </Link>
          </div>
        </nav>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gold-200 px-4 py-4 space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 rounded-lg text-sm bg-amber-50/50 border border-gold-300"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-700">
                <Search className="w-4 h-4" />
              </button>
            </form>

            <div className="flex flex-col space-y-2 font-serif text-sm">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-slate-100">
                Home
              </Link>
              <Link to="/categories" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-slate-100 font-semibold text-gold-800">
                All Categories
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="pl-4 py-1.5 text-slate-600 text-xs border-b border-slate-50 hover:text-gold-700"
                >
                  • {cat.name}
                </Link>
              ))}
              <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-slate-100 flex justify-between">
                <span>Inquiry Cart</span>
                <span className="bg-maroon-800 text-white text-xs px-2 py-0.5 rounded-full">{totalItems}</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-maroon-950 text-amber-100 border-t-4 border-gold-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-serif text-xl font-bold text-gold-400 mb-4">{settings.company_name || 'AVADH Imitation Jewellery'}</h3>
            <p className="text-xs text-amber-200/80 leading-relaxed mb-4">
              Premium manufacturer, wholesaler, and retailer of fine imitation jewellery, Kundan sets, Temple jewellery, and bridal accessories.
            </p>
            <p className="text-xs text-gold-400 font-semibold">{settings.footer_text}</p>
          </div>

          <div>
            <h4 className="font-serif font-bold text-amber-50 mb-4 border-b border-gold-800/60 pb-2 text-sm">Quick Links</h4>
            <ul className="space-y-2 text-xs text-amber-200/80">
              <li><Link to="/" className="hover:text-gold-400 transition-colors">Home</Link></li>
              <li><Link to="/categories" className="hover:text-gold-400 transition-colors">All Categories</Link></li>
              <li><Link to="/cart" className="hover:text-gold-400 transition-colors">Inquiry Basket</Link></li>
              <li><Link to="/admin/login" className="hover:text-gold-400 transition-colors">Admin Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-amber-50 mb-4 border-b border-gold-800/60 pb-2 text-sm">Top Categories</h4>
            <ul className="space-y-2 text-xs text-amber-200/80">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link to={`/category/${cat.slug}`} className="hover:text-gold-400 transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-amber-50 mb-4 border-b border-gold-800/60 pb-2 text-sm">Contact Us</h4>
            <ul className="space-y-3 text-xs text-amber-200/80">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <span>{settings.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <span>{settings.email}</span>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};
