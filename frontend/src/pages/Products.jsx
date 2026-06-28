import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { productAPI } from '../services/api';
import SEO from '../components/SEO';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Books', 'Furniture', 'Lifestyle', 'Accessories'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'New Arrival' },
  { value: 'rating', label: 'Highly Rated' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

import { SkeletonCard } from '../components/Skeletons';

// Framer Motion Variants for Staggered Grid
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } }
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
    <div className="min-h-screen pt-16 lg:pt-20 bg-surface-white" id="main-content">
      <SEO title="Collections" description="Browse our full catalog of premium electronics, fashion, furniture and more." />

      {/* ── Editorial Page Header ─────────────────────────────── */}
      <div className="bg-surface-white border-b border-border/40">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-16 pb-12 flex flex-col items-center text-center">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[10px] font-bold tracking-[0.25em] text-primary/40 uppercase mb-4"
          >
            Discover Collection
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-heading text-4xl lg:text-5xl font-bold text-primary mb-6"
          >
            {search ? `Results for "${search}"` : category !== 'All' ? category : 'All Products'}
          </motion.h1>
          
          <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-6">
            {/* Search Bar */}
            <motion.form 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onSubmit={handleSearchSubmit} 
              className="relative w-full group" 
              role="search"
            >
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary/60 transition-colors pointer-events-none">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z" />
                </svg>
              </div>
              <input
                type="search"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search premium catalogue..."
                className="input-base !rounded-full !py-4 !pl-14 !pr-32 !bg-surface-secondary shadow-inner-soft"
                aria-label="Search products"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {localSearch && (
                  <button
                    type="button"
                    onClick={() => { setLocalSearch(''); updateParam('search', ''); }}
                    className="p-2 text-primary/30 hover:text-primary/70 transition-colors rounded-full"
                    aria-label="Clear search"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                <button type="submit" className="btn-primary !rounded-full !py-2.5 !px-5 shadow-sm">
                  Search
                </button>
              </div>
            </motion.form>

            <AnimatePresence>
              {!loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-4 text-xs font-medium text-primary/50"
                >
                  <div className="h-px w-8 bg-border" />
                  <span>{total} items curated</span>
                  <div className="h-px w-8 bg-border" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
        {/* ── Toolbar (Filters Toggle & Sort) ─────────────────────── */}
        <div className="flex items-center justify-between lg:justify-end mb-8 border-b border-border/40 pb-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden flex items-center gap-2 text-sm font-semibold text-primary hover:text-brand transition-colors"
            aria-label={`Filters${activeFilterCount > 0 ? ` — ${activeFilterCount} active` : ''}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>

          <div className="relative group flex items-center">
            <span className="text-[11px] font-bold tracking-[0.1em] text-primary/40 uppercase mr-3 hidden sm:block">Sort By</span>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="appearance-none input-base !py-2.5 !pl-4 !pr-10 !bg-surface-white cursor-pointer shadow-sm"
                aria-label="Sort products"
              >
                {SORT_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary/40 group-hover:text-primary transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ── Active Filters ─────────────────────── */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap items-center gap-3 mb-10"
            >
              <span className="label-editorial text-primary/40">Active</span>
              {category !== 'All' && (
                <span className="flex items-center gap-2 px-4 py-1.5 bg-surface text-primary border border-border/60 text-[11px] font-bold rounded-full shadow-sm">
                  {category}
                  <button onClick={() => updateParam('category', '')} className="text-primary/40 hover:text-error transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </span>
              )}
              {(minPrice || maxPrice) && (
                <span className="flex items-center gap-2 px-4 py-1.5 bg-surface text-primary border border-border/60 text-[11px] font-bold rounded-full shadow-sm">
                  ₹{minPrice || '0'} – ₹{maxPrice || '∞'}
                  <button onClick={() => { setLocalMin(''); setLocalMax(''); const p = Object.fromEntries(searchParams.entries()); delete p.minPrice; delete p.maxPrice; setSearchParams(p); }} className="text-primary/40 hover:text-error transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-[11px] text-primary/40 hover:text-error transition-colors font-semibold ml-2 underline underline-offset-4"
              >
                Clear all
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-10 lg:gap-14">
          {/* ── Desktop Sidebar ─────────────────────── */}
          <aside className="hidden lg:block w-56 shrink-0 sticky top-28 h-fit">
            <h2 className="text-[10px] font-bold tracking-[0.25em] text-primary/40 uppercase mb-6">Collections</h2>
            <ul className="space-y-1 mb-10">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => updateParam('category', cat)}
                    className={`w-full text-left py-2 text-[14px] font-medium transition-all duration-300 flex items-center justify-between group ${
                      category === cat ? 'text-primary' : 'text-primary/50 hover:text-primary/80'
                    }`}
                  >
                    <span>{cat}</span>
                    {category === cat && (
                      <motion.div layoutId="activeCat" className="w-1.5 h-1.5 rounded-full bg-brand" />
                    )}
                  </button>
                </li>
              ))}
            </ul>

            <h2 className="text-[10px] font-bold tracking-[0.25em] text-primary/40 uppercase mb-6 pt-8 border-t border-border/40">Refine Price</h2>
            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 text-[13px] font-medium">₹</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={localMin}
                  onChange={(e) => setLocalMin(e.target.value)}
                  className="input-base !py-2.5 !pl-9 !pr-4 !bg-surface-secondary"
                  min="0"
                />
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 text-[13px] font-medium">₹</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={localMax}
                  onChange={(e) => setLocalMax(e.target.value)}
                  className="input-base !py-2.5 !pl-9 !pr-4 !bg-surface-secondary"
                  min="0"
                />
              </div>
              <button
                onClick={applyPriceFilter}
                className="btn-secondary w-full !py-3 !text-[11px] shadow-sm"
              >
                Apply Range
              </button>
            </div>
          </aside>

          {/* ── Product Grid ────────────────────────── */}
          <main className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
                {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-32 lg:py-48 text-center"
              >
                <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-primary/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z" />
                  </svg>
                </div>
                <h3 className="font-heading text-2xl font-bold text-primary mb-3">No curations found</h3>
                <p className="text-[14px] text-primary/50 mb-8 max-w-sm leading-relaxed font-medium">
                  We couldn't find any products matching your current filters. Try adjusting your search criteria.
                </p>
                <button onClick={clearFilters} className="btn-primary !rounded-full shadow-soft">
                  Reset Catalogue
                </button>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10"
              >
                <AnimatePresence mode="popLayout">
                  {products.map((product) => (
                    <motion.div key={product._id} variants={itemVariants} layout>
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </main>
        </div>
      </div>

      {/* ── Mobile Sidebar Drawer ─────────────────────── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-[85vw] max-w-sm bg-surface-white shadow-[0_0_40px_rgba(0,0,0,0.1)] overflow-y-auto"
            >
              <div className="flex items-center justify-between px-6 py-6 border-b border-border/40 sticky top-0 bg-surface-white/90 backdrop-blur-md z-10">
                <h2 className="font-heading text-lg font-bold text-primary">Filters</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 -mr-2 rounded-full text-primary/50 hover:text-primary hover:bg-surface-secondary transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <h3 className="text-[10px] font-bold tracking-[0.25em] text-primary/40 uppercase mb-6">Collections</h3>
                <ul className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <li key={cat}>
                      <button
                        onClick={() => { updateParam('category', cat); setSidebarOpen(false); }}
                        className={`w-full text-left py-3 px-4 rounded-xl text-[14px] font-medium transition-all flex items-center justify-between ${
                          category === cat ? 'bg-surface text-primary border border-border/60 shadow-sm' : 'text-primary/60 hover:bg-surface-secondary border border-transparent'
                        }`}
                      >
                        {cat}
                        {category === cat && <div className="w-1.5 h-1.5 rounded-full bg-brand" />}
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 pt-8 border-t border-border/40">
                  <h3 className="text-[10px] font-bold tracking-[0.25em] text-primary/40 uppercase mb-6">Price Range</h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 text-sm">₹</span>
                        <input type="number" placeholder="Min" value={localMin} onChange={(e) => setLocalMin(e.target.value)} className="w-full bg-surface-secondary rounded-xl py-3 pl-9 pr-3 text-[14px] font-medium text-primary outline-none focus:ring-2 focus:ring-primary/10" />
                      </div>
                      <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 text-sm">₹</span>
                        <input type="number" placeholder="Max" value={localMax} onChange={(e) => setLocalMax(e.target.value)} className="w-full bg-surface-secondary rounded-xl py-3 pl-9 pr-3 text-[14px] font-medium text-primary outline-none focus:ring-2 focus:ring-primary/10" />
                      </div>
                    </div>
                    <button onClick={() => { applyPriceFilter(); setSidebarOpen(false); }} className="w-full py-4 bg-primary text-surface-white text-[11px] font-bold tracking-[0.1em] uppercase rounded-xl hover:bg-brand transition-colors shadow-soft">
                      Apply Limits
                    </button>
                  </div>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={() => { clearFilters(); setSidebarOpen(false); }}
                    className="w-full mt-6 py-4 text-[12px] font-semibold text-primary/50 hover:text-error transition-colors"
                  >
                    Reset Everything
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
