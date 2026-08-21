import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { publicApi } from '../../api/services';
import { Product } from '../../types';
import { ProductCard } from '../../components/shared/ProductCard';
import { Pagination } from '../../components/shared/Pagination';
import { Search, PackageX } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const performSearch = async () => {
      setIsLoading(true);
      try {
        const res = await publicApi.getProducts({
          search: queryParam,
          page,
          limit: 12,
        });

        if (res.success) {
          setProducts(res.data);
          if (res.meta) {
            setTotalPages(res.meta.totalPages);
            setTotalResults(res.meta.total);
          }
        }
      } catch (e) {
        console.error('Search failed:', e);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [queryParam, page]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm flex items-center gap-3">
        <div className="p-3 bg-amber-100/60 rounded-xl text-gold-700">
          <Search className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs uppercase font-bold text-gold-700 tracking-wider">Search Results</span>
          <h1 className="font-serif font-bold text-xl sm:text-2xl text-maroon-950">
            Results for "{queryParam}"
          </h1>
          <p className="text-xs text-slate-500">Found {totalResults} matching products</p>
        </div>
      </div>

      {isLoading ? (
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-amber-200 space-y-3">
          <PackageX className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="font-serif font-bold text-lg text-slate-800">No matching jewellery found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try checking spelling or searching for generic terms like "Necklace", "Earrings", "Kundan", etc.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
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
  );
};
