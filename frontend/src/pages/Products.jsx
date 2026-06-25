import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { SkeletonCard } from '../components/Loader';
import { productAPI } from '../services/api';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Books', 'Furniture', 'Lifestyle', 'Accessories'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
];

const categoryIcons = {
  All: '◈', Electronics: '⚡', Fashion: '👜', Books: '📖',
  Furniture: '🪑', Lifestyle: '🌿', Accessories: '💎',
};

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const category = searchParams.get('category') || 'All';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);
  const [localSearch, setLocalSearch] = useState(search);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { sort, limit: 24 };
      if (category !== 'All') params.category = category;
      if (search) params.search = search;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      const { data } = await productAPI.getAll(params);
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [category, search, sort, minPrice, maxPrice]);

  useEffect(() => {
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchProducts]);

  const updateParam = (key, value) => {
    const params = Object.fromEntries(searchParams.entries());
    if (value && value !== 'All') params[key] = value;
    else delete params[key];
    setSearchParams(params);
  };

  const applyPriceFilter = () => {
    const params = Object.fromEntries(searchParams.entries());
    if (localMin) params.minPrice = localMin; else delete params.minPrice;
    if (localMax) params.maxPrice = localMax; else delete params.maxPrice;
    setSearchParams(params);
  };

  const clearFilters = () => {
    setLocalMin(''); setLocalMax(''); setLocalSearch('');
    setSearchParams({});
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', localSearch);
  };

  const hasActiveFilters = category !== 'All' || search || minPrice || maxPrice;
  const activeFilterCount = [category !== 'All', search, minPrice, maxPrice].filter(Boolean).length;

  return (
    <div className="min-h-screen pt-16 lg:pt-20" id="main-content">
      {/* ── Page Header ─────────────────────────────── */}
      <div className="bg-white border-b border-grey">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-10 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="section-subheading mb-2">Curated For You</p>
              <h1 className="section-heading">
                {search ? `"${search}"` : category !== 'All' ? category : 'All Products'}
              </h1>
              <AnimatePresence>
                {!loading && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-grey-dark mt-1.5"
                  >
                    {total} {total === 1 ? 'product' : 'products'} found
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-3">
              {/* Sort */}
              <select
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="input-field text-sm py-2.5 max-w-[190px] cursor-pointer"
                id="products-sort"
                aria-label="Sort products"
              >
                {SORT_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              {/* Mobile filter toggle */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden relative flex items-center gap-2 px-4 py-2.5 border border-grey rounded-xl text-sm font-medium text-charcoal hover:border-blue hover:text-blue transition-all"
                id="mobile-filter-btn"
                aria-label={`Filters${activeFilterCount > 0 ? ` — ${activeFilterCount} active` : ''}`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
                Filters
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="mt-5 flex gap-2 max-w-xl" role="search">
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-grey-dark pointer-events-none" aria-hidden="true">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z" />
                </svg>
              </div>
              <input
                type="search"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search for products, brands..."
                className="input-field pl-11 pr-10"
                id="products-search"
                aria-label="Search products"
              />
              {/* Clear search */}
              {localSearch && (
                <button
                  type="button"
                  onClick={() => { setLocalSearch(''); updateParam('search', ''); }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-grey-dark hover:text-blue transition-colors"
                  aria-label="Clear search"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button type="submit" className="btn-primary" aria-label="Submit search">Search</button>
          </form>

          {/* Active filter chips */}
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap items-center gap-2 mt-4"
              >
                <span className="text-xs text-grey-dark font-medium">Active filters:</span>
                {category !== 'All' && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-blue text-white text-xs font-semibold rounded-full">
                    {category}
                    <button onClick={() => updateParam('category', '')} className="hover:text-white/60 transition-colors" aria-label={`Remove ${category} filter`}>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </span>
                )}
                {search && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-blue/10 text-blue text-xs font-semibold rounded-full">
                    "{search}"
                    <button onClick={() => { setLocalSearch(''); updateParam('search', ''); }} className="hover:text-blue/60 transition-colors" aria-label="Remove search filter">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-xs text-grey-dark hover:text-red-500 transition-colors underline underline-offset-2 font-medium"
                >
                  Clear all
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <div className="flex gap-8">
          {/* ── Desktop Sidebar ─────────────────────── */}
          <aside className="hidden lg:block w-60 shrink-0 sticky top-28 h-fit" aria-label="Product filters">
            <div className="bg-white rounded-2xl border border-grey p-6 shadow-soft">
              <h2 className="text-xs font-bold tracking-[0.18em] text-grey-dark uppercase mb-5">Categories</h2>
              <ul className="space-y-0.5" role="list">
                {CATEGORIES.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => updateParam('category', cat)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2.5 ${
                        category === cat
                          ? 'bg-blue text-white shadow-sm'
                          : 'text-charcoal/60 hover:text-blue hover:bg-blue/5'
                      }`}
                      id={`cat-filter-${cat.toLowerCase()}`}
                      aria-pressed={category === cat}
                    >
                      <span className="text-base leading-none" aria-hidden="true">{categoryIcons[cat]}</span>
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Price Range */}
              <div className="mt-7 pt-6 border-t border-grey">
                <h2 className="text-xs font-bold tracking-[0.18em] text-grey-dark uppercase mb-5">Price Range</h2>
                <div className="space-y-3">
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-grey-dark text-sm font-medium">₹</span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={localMin}
                      onChange={(e) => setLocalMin(e.target.value)}
                      className="input-field pl-8 text-sm py-2.5"
                      id="price-min"
                      aria-label="Minimum price in rupees"
                      min="0"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-grey-dark text-sm font-medium">₹</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={localMax}
                      onChange={(e) => setLocalMax(e.target.value)}
                      className="input-field pl-8 text-sm py-2.5"
                      id="price-max"
                      aria-label="Maximum price in rupees"
                      min="0"
                    />
                  </div>
                  <button
                    onClick={applyPriceFilter}
                    className="w-full btn-outline text-xs py-2.5"
                    id="apply-price-filter"
                  >
                    Apply Filter
                  </button>
                  {(localMin || localMax) && (
                    <button
                      onClick={() => { setLocalMin(''); setLocalMax(''); const p = Object.fromEntries(searchParams.entries()); delete p.minPrice; delete p.maxPrice; setSearchParams(p); }}
                      className="w-full text-xs text-grey-dark hover:text-red-500 transition-colors text-center"
                    >
                      Reset price
                    </button>
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* ── Product Grid ────────────────────────── */}
          <main className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : products.length === 0 ? (
              /* Empty State */
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="relative w-24 h-24 mx-auto mb-8"
                >
                  <div className="w-24 h-24 bg-surface rounded-full border-2 border-dashed border-grey flex items-center justify-center">
                    <svg className="w-10 h-10 text-grey" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z" />
                    </svg>
                  </div>
                  {/* Decorative dots */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue/30 rounded-full" aria-hidden="true" />
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-charcoal/10 rounded-full" aria-hidden="true" />
                </motion.div>
                <h3 className="font-display text-2xl font-semibold text-charcoal mb-2">No products found</h3>
                <p className="text-sm text-grey-dark mb-8 max-w-xs leading-relaxed">
                  Try adjusting your filters or search terms. We update our catalogue regularly!
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={clearFilters} className="btn-primary">Clear All Filters</button>
                  <button onClick={() => { setLocalSearch(''); updateParam('search', ''); }} className="btn-outline">Try Different Search</button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                layout
              >
                <AnimatePresence mode="popLayout">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-80 bg-white shadow-card-hover overflow-y-auto"
              aria-label="Mobile product filters"
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-grey sticky top-0 bg-white z-10">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-charcoal">Filters</h2>
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 bg-blue text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg text-grey-dark hover:text-charcoal hover:bg-surface transition-all"
                  aria-label="Close filters"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <h3 className="text-xs font-bold tracking-[0.18em] text-grey-dark uppercase mb-4">Categories</h3>
                <ul className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <li key={cat}>
                      <button
                        onClick={() => { updateParam('category', cat); setSidebarOpen(false); }}
                        className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2.5 ${
                          category === cat ? 'bg-blue text-white' : 'text-charcoal/60 hover:text-blue hover:bg-blue/5'
                        }`}
                        aria-pressed={category === cat}
                      >
                        <span className="text-base" aria-hidden="true">{categoryIcons[cat]}</span>
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-6 border-t border-grey">
                  <h3 className="text-xs font-bold tracking-[0.18em] text-grey-dark uppercase mb-4">Price Range</h3>
                  <div className="space-y-3">
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-grey-dark text-sm">₹</span>
                      <input type="number" placeholder="Min" value={localMin} onChange={(e) => setLocalMin(e.target.value)} className="input-field pl-8" aria-label="Minimum price" />
                    </div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-grey-dark text-sm">₹</span>
                      <input type="number" placeholder="Max" value={localMax} onChange={(e) => setLocalMax(e.target.value)} className="input-field pl-8" aria-label="Maximum price" />
                    </div>
                    <button
                      onClick={() => { applyPriceFilter(); setSidebarOpen(false); }}
                      className="w-full btn-primary"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={() => { clearFilters(); setSidebarOpen(false); }}
                    className="w-full mt-4 text-sm text-grey-dark hover:text-red-500 transition-colors text-center underline underline-offset-2"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;
