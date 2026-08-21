import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicApi } from '../../api/services';
import { Product, Category } from '../../types';
import { ProductCard } from '../../components/shared/ProductCard';
import { Pagination } from '../../components/shared/Pagination';
import { Filter, SlidersHorizontal, PackageX } from 'lucide-react';

export const CategoryList: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sort, setSort] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await publicApi.getCategories();
        if (res.success) setCategories(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      setIsLoading(true);
      try {
        if (slug) {
          const catRes = await publicApi.getCategoryBySlug(slug);
          if (catRes.success) setCategory(catRes.data);
        } else {
          setCategory(null);
        }

        const prodRes = await publicApi.getProducts({
          category_slug: slug,
          page,
          limit: 12,
          sort,
        });

        if (prodRes.success) {
          setProducts(prodRes.data);
          if (prodRes.meta) {
            setTotalPages(prodRes.meta.totalPages);
            setTotalProducts(prodRes.meta.total);
          }
        }
      } catch (e) {
        console.error('Error fetching category/products:', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [slug, page, sort]);

  return (
    <div className="space-y-6">
      {/* Category Header */}
      <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-gold-700 tracking-wider">
            {slug ? 'Category Catalog' : 'All Products'}
          </span>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-maroon-950">
            {category ? category.name : 'Complete Jewellery Catalog'}
          </h1>
          {category?.description && (
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">{category.description}</p>
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200">
            <SlidersHorizontal className="w-4 h-4 text-gold-700" />
            <span>Sort:</span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="bg-transparent font-bold text-maroon-950 focus:outline-none cursor-pointer"
            >
              <option value="newest">Latest First</option>
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
              <option value="price_asc">Price (Low to High)</option>
              <option value="price_desc">Price (High to Low)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar Filter */}
        <div className="md:col-span-1 bg-white p-4 rounded-2xl border border-amber-200 shadow-sm h-fit space-y-4">
          <h3 className="font-serif font-bold text-sm text-maroon-950 border-b border-amber-100 pb-2 flex items-center gap-2">
            <Filter className="w-4 h-4 text-gold-700" /> Filter Categories
          </h3>

          <div className="space-y-1 font-serif text-xs">
            <Link
              to="/categories"
              className={`block px-3 py-2 rounded-lg transition-colors ${
                !slug ? 'bg-gold-500 text-white font-bold' : 'text-slate-700 hover:bg-amber-50'
              }`}
            >
              All Categories
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className={`block px-3 py-2 rounded-lg transition-colors ${
                  slug === cat.slug
                    ? 'bg-gold-500 text-white font-bold'
                    : 'text-slate-700 hover:bg-amber-50 hover:text-gold-700'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="md:col-span-3">
          {isLoading ? (
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-amber-200 space-y-3">
              <PackageX className="w-12 h-12 text-amber-400 mx-auto" />
              <h3 className="font-serif font-bold text-lg text-slate-800">No products found</h3>
              <p className="text-xs text-slate-500">There are currently no products available in this category.</p>
              <Link
                to="/categories"
                className="inline-block mt-2 px-4 py-2 gold-gradient text-white font-semibold text-xs rounded-lg shadow-sm"
              >
                View All Categories
              </Link>
            </div>
          ) : (
            <>
              <div className="text-xs text-slate-500 mb-4 font-semibold">
                Showing {products.length} of {totalProducts} items
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
