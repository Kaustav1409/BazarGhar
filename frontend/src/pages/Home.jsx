import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import TrustBadges from '../components/TrustBadges';
import { SkeletonCard } from '../components/Loader';
import { productAPI } from '../services/api';

const CATEGORIES = ['Electronics', 'Fashion', 'Books', 'Furniture', 'Lifestyle', 'Accessories'];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

/* Testimonials data */
const TESTIMONIALS = [
  {
    text: "The quality of the products I received exceeded my expectations. BazarGhar is now my go-to for all premium purchases. The delivery was incredibly fast!",
    name: "Priya Sharma",
    role: "Interior Designer, Mumbai",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    rating: 5,
  },
  {
    text: "I was looking for authentic electronics and found them here at great prices. The user experience of the website is absolutely world-class. Will definitely shop again.",
    name: "Rahul Verma",
    role: "Tech Enthusiast, Bangalore",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    rating: 5,
  },
  {
    text: "Customer service is top-notch. I had an issue with a size, and they processed my return within a day. Truly a premium shopping experience unlike any other.",
    name: "Aisha Khan",
    role: "Fashion Blogger, Delhi",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    rating: 5,
  },
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, countsRes] = await Promise.all([
          productAPI.getAll({ limit: 8, sort: 'rating' }),
          productAPI.getCategoryCounts().catch(() => ({ data: {} }))
        ]);
        setFeaturedProducts(productsRes.data.products || []);
        setCategoryCounts(countsRes.data || {});
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen" id="main-content">

      {/* ═══════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════ */}
      <section
        className="relative min-h-[100svh] flex items-center overflow-hidden bg-cream pt-40 lg:pt-56 pb-24"
        aria-label="Hero section"
      >
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23111827' fill-opacity='1'%3E%3Cpath d='M40 40v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V6h-2v4h-4v2h4v4h2v-4h4V6h-4zM10 40v-4H8v4H4v2h4v4h2v-4h4v-2h-4zM10 10V6H8v4H4v2h4v4h2v-4h4V6h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
          aria-hidden="true"
        />
        {/* Gold blob */}
        <div className="absolute -top-40 -right-40 w-[700px] h-[700px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[80px] pointer-events-none" aria-hidden="true" />

        <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">

          {/* Left Text */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-xl py-10 lg:py-0"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold/10 border border-gold/20 rounded-full mb-8">
              <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" aria-hidden="true" />
              <span className="text-[11px] font-bold tracking-[0.25em] text-gold-dark uppercase">Premium E-Commerce</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-display font-semibold text-primary leading-[1.04] tracking-tight mb-8"
              style={{ fontSize: 'clamp(4rem, 8vw, 7.5rem)' }}
            >
              Discover Quality,{' '}
              <br />
              <span className="gold-text">Delivered with Trust.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl lg:text-2xl text-ink/55 leading-relaxed max-w-2xl mb-12 font-light"
            >
              From everyday essentials to premium finds, BazarGhar brings everything you need — curated, authentic, and at your doorstep.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
              <Link
                to="/products"
                id="hero-cta-primary"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-primary text-white font-semibold text-sm tracking-wide rounded-xl transition-all duration-300 hover:bg-ink hover:shadow-card-hover hover:-translate-y-0.5"
              >
                Explore Collection
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <a
                href="#about"
                id="hero-cta-secondary"
                className="inline-flex items-center gap-2 px-6 py-4 text-sm font-medium text-ink/60 hover:text-primary transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z" />
                </svg>
                Browse Categories
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="flex items-center gap-8 mt-12 pt-8 border-t border-border/60">
              {[
                { val: '50K+', label: 'Happy Customers' },
                { val: '2K+', label: 'Products' },
                { val: '4.9★', label: 'Average Rating' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-display text-4xl font-semibold text-primary mb-1">{s.val}</p>
                  <p className="text-[11px] text-muted uppercase tracking-widest font-bold">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Showcase */}
          <div className="relative hidden lg:block h-[640px]" aria-hidden="true">
            {/* Glow */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-gold/8 rounded-full blur-[80px]"
            />

            {/* Main Product Image */}
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 z-10 flex items-center justify-center"
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                  alt="Premium audio product"
                  loading="eager"
                  className="w-72 h-[420px] object-cover rounded-3xl shadow-2xl"
                />
                {/* Image frame decoration */}
                <div className="absolute -inset-3 rounded-[2rem] border border-primary/6 -z-10" />
                <div className="absolute -inset-6 rounded-[2.5rem] border border-primary/3 -z-10" />
              </div>
            </motion.div>

            {/* Floating Card 1 — Product */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-16 right-8 z-20 bg-white p-4 rounded-2xl shadow-card-hover flex items-center gap-3.5 w-56 border border-border/40"
            >
              <div className="w-12 h-12 bg-cream rounded-xl overflow-hidden flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80" alt="Smart Watch" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div>
                <p className="text-xs font-bold text-primary">Smart Watch Pro</p>
                <p className="text-[11px] gold-text font-semibold mt-0.5">₹12,999</p>
                <div className="flex items-center gap-0.5 mt-1">
                  {[1,2,3,4,5].map(s => <svg key={s} className="w-2.5 h-2.5 text-gold" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                </div>
              </div>
            </motion.div>

            {/* Floating Card 2 — Rating */}
            <motion.div
              animate={{ y: [0, 14, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-36 left-4 z-20 bg-white p-4 rounded-2xl shadow-card-hover flex items-center gap-3 w-52 border border-border/40"
            >
              <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold flex-shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-primary">Top Rated</p>
                <p className="text-[11px] text-muted mt-0.5">4.9 / 5 Average</p>
                <p className="text-[10px] text-gold font-semibold">50K+ Reviews</p>
              </div>
            </motion.div>

            {/* Floating Card 3 — Trust */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute bottom-8 right-16 z-20 bg-primary text-white p-4 rounded-2xl shadow-xl w-44 border border-white/5"
            >
              <div className="w-7 h-7 bg-gold/20 rounded-lg flex items-center justify-center mb-2">
                <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <p className="text-[10px] text-white/50 uppercase tracking-widest mb-0.5">Guaranteed</p>
              <p className="text-sm font-bold">100% Authentic Products</p>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <div className="w-px h-10 bg-gradient-to-b from-transparent via-primary/25 to-transparent" />
          <p className="text-[9px] tracking-[0.3em] text-primary/30 uppercase font-semibold">Scroll</p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════
          TRUST BADGES
      ═══════════════════════════════════════════════ */}
      <TrustBadges />

      {/* ═══════════════════════════════════════════════
          CATEGORIES
      ═══════════════════════════════════════════════ */}
      <section id="categories" className="py-32 scroll-mt-32" aria-labelledby="categories-heading">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="section-subheading mb-3">Explore Categories</p>
              <h2 id="categories-heading" className="section-heading">Everything you need, organized.</h2>
            </div>
            <Link
              to="/products"
              id="categories-view-all"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-muted hover:text-primary transition-colors duration-200 group"
            >
              View all
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat, i) => (
              <CategoryCard key={cat} category={cat} index={i} count={categoryCounts[cat]} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CURATED PRODUCTS
      ═══════════════════════════════════════════════ */}
      <section className="py-32 bg-white/60" aria-labelledby="featured-heading">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="section-subheading mb-3">Handpicked for you</p>
              <h2 id="featured-heading" className="section-heading">Curated Products</h2>
            </div>
            <Link
              to="/products"
              id="featured-browse-all"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-muted hover:text-primary transition-colors duration-200 group"
            >
              Browse all
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : featuredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
          </div>

          <div className="text-center mt-14">
            <Link to="/products" id="featured-view-all" className="btn-outline">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          WHY CHOOSE US
      ═══════════════════════════════════════════════ */}
      <section id="about" className="py-32 scroll-mt-32 bg-cream" aria-labelledby="why-heading">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="section-subheading mb-4">Our Promise</p>
            <h2 id="why-heading" className="section-heading text-balance">Why Choose BazarGhar</h2>
            <p className="text-muted text-base mt-5 leading-relaxed">
              We're committed to providing you with the best shopping experience — quality, convenience, and exceptional service, every single time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Curated Selection',
                desc: 'Every product on BazarGhar is hand-picked by our experts to ensure it meets our strict quality standards.',
                iconBg: 'from-blue-50 to-sky-50',
                iconColor: 'text-blue-600',
                iconPath: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09l2.846.813-.813 2.846a4.5 4.5 0 00-3.09 3.09z',
              },
              {
                title: 'Premium Quality',
                desc: 'We partner directly with top brands and artisans to bring you authentic, premium products with a guarantee.',
                iconBg: 'from-gold/10 to-amber-50',
                iconColor: 'text-gold-dark',
                iconPath: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
              },
              {
                title: 'Seamless Experience',
                desc: 'From browsing to checkout and delivery, every step is designed to be smooth, secure, and genuinely enjoyable.',
                iconBg: 'from-emerald-50 to-green-50',
                iconColor: 'text-emerald-600',
                iconPath: 'M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                className="bg-white p-8 rounded-3xl border border-border/60 shadow-soft text-center group hover:-translate-y-2 hover:shadow-card-hover transition-all duration-400"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.iconBg} rounded-2xl flex items-center justify-center ${feature.iconColor} mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d={feature.iconPath} />
                  </svg>
                </div>
                <h3 className="font-display text-xl font-semibold text-primary mb-3">{feature.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════ */}
      <section className="py-32 bg-white" aria-labelledby="testimonials-heading">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-14">
            <p className="section-subheading mb-3">Customer Stories</p>
            <h2 id="testimonials-heading" className="section-heading">Loved by Thousands</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative bg-cream/60 p-8 rounded-3xl border border-border/40 hover:shadow-card transition-all duration-300 group"
              >
                {/* Large quote mark */}
                <div className="absolute top-6 right-8 font-display text-7xl text-primary/5 font-bold leading-none select-none group-hover:text-gold/10 transition-colors duration-300" aria-hidden="true">"</div>

                {/* Stars */}
                <div className="flex gap-1 mb-5" aria-label={`${t.rating} out of 5 stars`}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Review text */}
                <p className="text-ink/75 text-sm leading-[1.8] mb-7 relative z-10">"{t.text}"</p>

                {/* Author */}
                <div className="flex items-center gap-3.5">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    loading="lazy"
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow-soft"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-primary">{t.name}</h4>
                    <p className="text-[11px] text-muted mt-0.5">{t.role}</p>
                  </div>
                  {/* Verified badge */}
                  <div className="ml-auto flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-[9px] font-bold tracking-wide uppercase">Verified</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          NEWSLETTER CTA
      ═══════════════════════════════════════════════ */}
      <section className="py-32 bg-primary relative overflow-hidden" aria-label="Newsletter signup">
        {/* Pattern */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
          aria-hidden="true"
        />
        {/* Gold blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold/5 rounded-full blur-[80px] pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-gold/5 rounded-full blur-[60px] pointer-events-none" aria-hidden="true" />

        <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="section-subheading text-gold/70 mb-4">Stay Updated</p>
            <h2 className="font-display text-3xl lg:text-4xl font-semibold text-white mb-4 tracking-tight">
              Never Miss a Great Deal
            </h2>
            <p className="text-white/40 text-sm mb-10 leading-relaxed max-w-sm mx-auto">
              Subscribe for exclusive offers, new arrivals, and curated picks — delivered to your inbox weekly.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              onSubmit={(e) => e.preventDefault()}
              id="newsletter-form"
            >
              <input
                type="email"
                placeholder="Your email address"
                id="newsletter-email"
                className="flex-1 px-5 py-4 bg-white/10 border border-white/15 rounded-xl text-white text-sm placeholder:text-white/30 outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30 transition-colors duration-200"
              />
              <button
                type="submit"
                id="newsletter-submit"
                className="btn-gold shrink-0 py-4"
              >
                Subscribe
              </button>
            </form>
            <p className="text-white/25 text-[11px] mt-4">No spam. Unsubscribe anytime.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
