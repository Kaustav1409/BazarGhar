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
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.25, 1, 0.25, 1] } },
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
        className="relative min-h-[100svh] flex items-center overflow-hidden bg-surface pt-40 lg:pt-56 pb-24"
        aria-label="Hero section"
      >
        {/* Background texture - Deep Forest tone */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2303110d' fill-opacity='1'%3E%3Cpath d='M40 40v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V6h-2v4h-4v2h4v4h2v-4h4V6h-4zM10 40v-4H8v4H4v2h4v4h2v-4h4v-2h-4zM10 10V6H8v4H4v2h4v4h2v-4h4V6h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
          aria-hidden="true"
        />
        {/* Subtle blur blobs - Luxury Gold and Burgundy */}
        <div className="absolute -top-40 -right-40 w-[700px] h-[700px] bg-secondary/15 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] bg-brand/10 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />

        <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">

          {/* Left Text */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-xl py-10 lg:py-0"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-4 py-2 bg-surface-white/60 backdrop-blur-md border border-secondary/30 rounded-full mb-8 shadow-sm">
              <div className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse-slow" aria-hidden="true" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase">The Premium Collection</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-hero font-bold text-primary leading-[1.05] tracking-tight mb-8"
              style={{ fontSize: 'clamp(3.5rem, 7vw, 6.5rem)' }}
            >
              Discover Quality,{' '}
              <br />
              <span className="text-secondary">Delivered with Trust.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg lg:text-xl text-primary/70 leading-relaxed max-w-lg mb-12 font-medium"
            >
              From everyday essentials to exclusive luxury finds, BazarGhar curates the finest products delivered directly to your doorstep.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-5">
              <Link
                to="/products"
                id="hero-cta-primary"
                className="btn-primary group px-10 py-5"
              >
                Explore Collection
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <a
                href="#categories"
                id="hero-cta-secondary"
                className="btn-secondary group px-10 py-5"
              >
                Browse Categories
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="flex items-center gap-10 mt-16 pt-10 border-t border-border">
              {[
                { val: '5K+', label: 'Happy Customers' },
                { val: '50+', label: 'Products' },
                { val: '4.2★', label: 'Average Rating' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-heading text-4xl font-bold text-primary mb-2">{s.val}</p>
                  <p className="text-[10px] text-secondary uppercase tracking-[0.2em] font-bold">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Showcase */}
          <div className="relative hidden lg:block h-[700px]" aria-hidden="true">
            {/* Glow */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-[100px]"
            />

            {/* Main Product Image */}
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 1, 0.25, 1] }}
              className="absolute inset-0 z-10 flex items-center justify-center"
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&auto=format&fit=crop&q=80"
                  alt="Premium interior product"
                  loading="eager"
                  className="w-80 h-[500px] object-cover rounded-[2rem] shadow-card border border-border"
                />
                {/* Image frame decoration (metallic) */}
                <div className="absolute -inset-4 rounded-[2.5rem] border border-secondary/30 -z-10 shadow-metallic" />
                <div className="absolute -inset-8 rounded-[3rem] border border-border/40 -z-10" />
              </div>
            </motion.div>

            {/* Floating Card 1 — Product */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-24 right-4 z-20 glass-white p-4 rounded-2xl shadow-card flex items-center gap-4 w-60 border border-secondary/20"
            >
              <div className="w-14 h-14 bg-surface-secondary rounded-xl overflow-hidden flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&auto=format&fit=crop&q=80" alt="Leather Shoes" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div>
                <p className="font-heading text-[13px] font-bold text-primary">Classic Leather</p>
                <p className="font-heading text-[12px] text-brand font-extrabold mt-1">₹4,999</p>
              </div>
            </motion.div>

            {/* Floating Card 2 — Rating */}
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-40 -left-6 z-20 glass-white p-5 rounded-2xl shadow-card flex items-center gap-4 w-56 border border-secondary/20"
            >
              <div className="w-12 h-12 bg-secondary/15 rounded-full flex items-center justify-center text-secondary flex-shrink-0 shadow-inner-soft">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold text-primary tracking-wide uppercase">Top Rated</p>
                <p className="text-[11px] text-primary/70 mt-1 font-medium">4.9 / 5 Average</p>
              </div>
            </motion.div>

            {/* Floating Card 3 — Trust */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute bottom-12 right-12 z-20 bg-brand text-surface-white p-5 rounded-2xl shadow-card w-48 border border-brand-hover relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
              <div className="w-8 h-8 bg-surface-white/10 rounded-xl flex items-center justify-center mb-3">
                <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <p className="text-[9px] text-secondary uppercase tracking-[0.25em] mb-1 font-bold">Guaranteed</p>
              <p className="text-sm font-semibold tracking-wide">100% Authentic Products</p>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-brand to-transparent" />
          <p className="text-[10px] tracking-[0.3em] text-brand uppercase font-semibold">Scroll</p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════
          TRUST BADGES
      ═══════════════════════════════════════════════ */}
      <TrustBadges />

      {/* ═══════════════════════════════════════════════
          CATEGORIES
      ═══════════════════════════════════════════════ */}
      <section id="categories" className="py-32 scroll-mt-32 bg-surface" aria-labelledby="categories-heading">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between mb-16">
            <div>
              <p className="section-subheading mb-4 text-brand">Explore Collections</p>
              <h2 id="categories-heading" className="section-heading">Everything you need, organized.</h2>
            </div>
            <Link
              to="/products"
              id="categories-view-all"
              className="hidden sm:flex items-center gap-3 text-sm font-bold tracking-widest uppercase text-brand hover:text-secondary transition-colors duration-300 group"
            >
              View all
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {CATEGORIES.map((cat, i) => (
              <CategoryCard key={cat} category={cat} index={i} count={categoryCounts[cat]} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CURATED PRODUCTS
      ═══════════════════════════════════════════════ */}
      <section className="py-32 bg-surface-secondary border-t border-border" aria-labelledby="featured-heading">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between mb-16">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border border-secondary/30 rounded-full mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-slow"></span>
                <p className="text-[10px] font-bold tracking-[0.25em] text-accent uppercase">Trending Exclusives</p>
              </div>
              <h2 id="featured-heading" className="section-heading">Luxury Selections</h2>
            </div>
            <Link
              to="/products"
              id="featured-browse-all"
              className="hidden sm:flex items-center gap-3 text-sm font-bold tracking-widest uppercase text-brand hover:text-secondary transition-colors duration-300 group"
            >
              Browse all
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>

          <div className="text-center mt-20">
            <Link to="/products" id="featured-view-all" className="btn-secondary px-10 py-4 uppercase tracking-widest text-[12px]">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          WHY CHOOSE US
      ═══════════════════════════════════════════════ */}
      <section id="about" className="py-32 scroll-mt-32 bg-surface" aria-labelledby="why-heading">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <p className="section-subheading mb-4 text-brand">Our Promise</p>
            <h2 id="why-heading" className="section-heading text-balance">Why Choose BazarGhar</h2>
            <p className="text-primary/70 text-lg mt-6 leading-relaxed">
              We're committed to providing you with the best shopping experience — quality, convenience, and exceptional service, every single time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: 'Curated Selection',
                desc: 'Every product on BazarGhar is hand-picked by our experts to ensure it meets our strict quality standards.',
                iconPath: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09l2.846.813-.813 2.846a4.5 4.5 0 00-3.09 3.09z',
              },
              {
                title: 'Premium Quality',
                desc: 'We partner directly with top brands and artisans to bring you authentic, premium products with a guarantee.',
                iconPath: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
              },
              {
                title: 'Seamless Experience',
                desc: 'From browsing to checkout and delivery, every step is designed to be smooth, secure, and genuinely enjoyable.',
                iconPath: 'M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: [0.25, 1, 0.25, 1] }}
                className="bg-surface-white p-10 rounded-[2rem] border border-border shadow-soft text-center group hover:-translate-y-2 hover:shadow-card hover:border-secondary/30 transition-all duration-500"
              >
                <div className={`w-20 h-20 bg-surface rounded-2xl flex items-center justify-center text-brand mx-auto mb-8 group-hover:scale-110 transition-transform duration-500 border border-border shadow-inner-soft`}>
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d={feature.iconPath} />
                  </svg>
                </div>
                <h3 className="font-heading text-2xl font-bold text-primary mb-4">{feature.title}</h3>
                <p className="text-base text-primary/70 leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════ */}
      <section className="py-32 bg-surface border-t border-border" aria-labelledby="testimonials-heading">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-20">
            <p className="section-subheading mb-4 text-brand">Customer Stories</p>
            <h2 id="testimonials-heading" className="section-heading">Loved by Thousands</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: [0.25, 1, 0.25, 1] }}
                className="relative bg-surface-white p-10 rounded-[2rem] border border-border hover:border-secondary/40 shadow-soft hover:shadow-card transition-all duration-500 group"
              >
                {/* Large quote mark */}
                <div className="absolute top-8 right-8 font-hero text-7xl text-primary/5 font-bold leading-none select-none group-hover:text-secondary/10 transition-colors duration-500" aria-hidden="true">"</div>

                {/* Stars */}
                <div className="flex gap-1.5 mb-6" aria-label={`${t.rating} out of 5 stars`}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-secondary" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Review text */}
                <p className="text-primary/80 text-[15px] leading-relaxed mb-8 relative z-10 font-medium">"{t.text}"</p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    loading="lazy"
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-surface-white shadow-sm border border-border"
                  />
                  <div>
                    <h4 className="text-base font-bold text-primary">{t.name}</h4>
                    <p className="text-[12px] text-primary/60 mt-0.5">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
