import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SlidersHorizontal, X, ChevronDown, Grid, List, Search } from 'lucide-react';
import api from '../utils/api';
import ProductCard from '../components/products/ProductCard';
import { SkeletonCard, Pagination, Badge } from '../components/common';
import { formatPrice } from '../utils/helpers';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name A–Z' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchParams.get('search') || '');

  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const minRating = searchParams.get('minRating') || '';
  const inStock = searchParams.get('inStock') || '';

  const updateParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  const clearFilters = () => {
    setSearchParams({});
    setLocalSearch('');
  };

  const hasFilters = category || minPrice || maxPrice || minRating || inStock || search;

  const { data: catData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data.data.categories)
  });

  const { data, isLoading } = useQuery({
    queryKey: ['products', { page, search, category, sort, minPrice, maxPrice, minRating, inStock }],
    queryFn: () => {
      const params = new URLSearchParams({ page, limit: 12, sort });
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (minRating) params.set('minRating', minRating);
      if (inStock) params.set('inStock', inStock);
      return api.get(`/products?${params}`).then(r => r.data.data);
    },
    keepPreviousData: true,
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', localSearch);
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Search</p>
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
            placeholder="Search products..."
            className="input flex-1 text-sm"
            aria-label="Search products"
          />
          <button type="submit" className="btn btn-primary btn-icon"><Search size={16} /></button>
        </form>
      </div>

      {/* Category */}
      <div>
        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Category</p>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="radio" name="category" checked={!category} onChange={() => updateParam('category', '')}
              className="accent-primary-600" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-primary-600 transition-colors">All Categories</span>
          </label>
          {catData?.map(cat => (
            <label key={cat._id} className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-2">
                <input type="radio" name="category" checked={category === cat._id}
                  onChange={() => updateParam('category', cat._id)} className="accent-primary-600" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-primary-600 transition-colors">
                  {cat.icon} {cat.name}
                </span>
              </div>
              <span className="text-xs text-neutral-400">{cat.productCount}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Price Range</p>
        <div className="flex gap-2 items-center">
          <input type="number" placeholder="Min" value={minPrice} min={0}
            onChange={e => updateParam('minPrice', e.target.value)}
            className="input text-sm w-full" aria-label="Minimum price" />
          <span className="text-neutral-400">–</span>
          <input type="number" placeholder="Max" value={maxPrice} min={0}
            onChange={e => updateParam('maxPrice', e.target.value)}
            className="input text-sm w-full" aria-label="Maximum price" />
        </div>
      </div>

      {/* Rating */}
      <div>
        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Min Rating</p>
        <div className="space-y-1.5">
          {['', '4', '3', '2'].map(r => (
            <label key={r} className="flex items-center gap-2 cursor-pointer group">
              <input type="radio" name="rating" checked={minRating === r}
                onChange={() => updateParam('minRating', r)} className="accent-primary-600" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-primary-600 transition-colors flex items-center gap-1">
                {r ? <>{'⭐'.repeat(Number(r))} & up</> : 'Any Rating'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* In Stock */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer group">
          <input type="checkbox" checked={inStock === 'true'}
            onChange={e => updateParam('inStock', e.target.checked ? 'true' : '')}
            className="accent-primary-600 w-4 h-4 rounded" />
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-primary-600 transition-colors">
            In Stock Only
          </span>
        </label>
      </div>

      {hasFilters && (
        <button onClick={clearFilters} className="btn btn-danger btn-sm w-full">
          <X size={14} /> Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-8">
      <div className="container-xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold font-display mb-1">
            {search ? `Search: "${search}"` : category ? catData?.find(c => c._id === category)?.name || 'Products' : 'All Products'}
          </h1>
          <p className="text-neutral-500 text-sm">
            {data?.pagination?.total !== undefined ? `${data.pagination.total.toLocaleString()} products found` : 'Loading...'}
          </p>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="card p-5 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <SlidersHorizontal size={16} /> Filters
                </h2>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 font-medium">Clear all</button>
                )}
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-6 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-3">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden btn btn-secondary btn-sm"
              >
                <SlidersHorizontal size={15} /> Filters {hasFilters && <Badge variant="primary">{[category, minPrice, maxPrice, minRating, inStock].filter(Boolean).length}</Badge>}
              </button>

              {/* Active filter chips */}
              <div className="flex flex-wrap gap-2 flex-1">
                {search && <Badge variant="primary" className="gap-1">Search: {search} <button onClick={() => { setLocalSearch(''); updateParam('search', ''); }}><X size={12} /></button></Badge>}
                {category && <Badge variant="primary" className="gap-1">{catData?.find(c => c._id === category)?.name} <button onClick={() => updateParam('category', '')}><X size={12} /></button></Badge>}
                {minPrice && <Badge variant="neutral" className="gap-1">Min: ${minPrice} <button onClick={() => updateParam('minPrice', '')}><X size={12} /></button></Badge>}
                {maxPrice && <Badge variant="neutral" className="gap-1">Max: ${maxPrice} <button onClick={() => updateParam('maxPrice', '')}><X size={12} /></button></Badge>}
                {minRating && <Badge variant="warning" className="gap-1">{'⭐'.repeat(Number(minRating))}+ <button onClick={() => updateParam('minRating', '')}><X size={12} /></button></Badge>}
                {inStock === 'true' && <Badge variant="success" className="gap-1">In Stock <button onClick={() => updateParam('inStock', '')}><X size={12} /></button></Badge>}
              </div>

              {/* Sort */}
              <div className="relative ml-auto">
                <select
                  value={sort}
                  onChange={e => updateParam('sort', e.target.value)}
                  className="input py-1.5 pl-3 pr-8 text-sm w-auto appearance-none"
                  aria-label="Sort products"
                >
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              </div>
            </div>

            {/* Products grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {isLoading
                ? Array(12).fill(0).map((_, i) => <SkeletonCard key={i} />)
                : data?.products?.length > 0
                  ? data.products.map(p => <ProductCard key={p._id} product={p} />)
                  : (
                    <div className="col-span-full py-24 text-center">
                      <div className="text-5xl mb-4">🔍</div>
                      <h3 className="text-lg font-semibold mb-2">No products found</h3>
                      <p className="text-neutral-500 text-sm mb-6">Try adjusting your filters or search terms.</p>
                      <button onClick={clearFilters} className="btn btn-primary">Clear Filters</button>
                    </div>
                  )
              }
            </div>

            {/* Pagination */}
            {data?.pagination?.pages > 1 && (
              <div className="mt-10">
                <Pagination
                  page={data.pagination.page}
                  pages={data.pagination.pages}
                  onPageChange={(p) => {
                    const params = new URLSearchParams(searchParams);
                    params.set('page', p);
                    setSearchParams(params);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setFiltersOpen(false)} />
          <div className="relative ml-auto w-80 bg-white dark:bg-neutral-900 h-full overflow-y-auto shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between p-5 border-b border-neutral-200 dark:border-neutral-800">
              <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">Filters</h2>
              <button onClick={() => setFiltersOpen(false)} className="btn-ghost btn-icon"><X size={18} /></button>
            </div>
            <div className="p-5">
              <FilterPanel />
            </div>
            <div className="p-5 border-t border-neutral-200 dark:border-neutral-800">
              <button onClick={() => setFiltersOpen(false)} className="btn btn-primary w-full">
                Show {data?.pagination?.total || 0} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
