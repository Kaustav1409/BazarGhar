import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import { SkeletonCard } from '../components/Loader';
import { productAPI } from '../services/api';
import SEO from '../components/SEO';

const CATEGORIES = ['Electronics', 'Fashion', 'Books', 'Furniture', 'Lifestyle', 'Accessories'];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, countsRes] = await Promise.all([
          productAPI.getAll({ limit: 4, sort: 'rating' }), // Only top 4 for best sellers
          productAPI.getCategoryCounts().catch(() => ({ data: {} }))
        ]);
        setFeaturedProducts(productsRes.data.products || []);
        setCategoryCounts(countsRes.data || {});
      } catch (err) {
        // Silently handle error in production
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-surface" id="main-content">
      <SEO 
        title="Home" 
        description="Discover curated premium products for modern living. Elevated design, exceptional quality, delivered with unparalleled care."
      />

      {/* ═══════════════════════════════════════════════
          HERO SECTION - Ultra Minimal Apple/Aesop Style
      ═══════════════════════════════════════════════ */}
      <section className="relative h-[100svh] w-full flex flex-col justify-end pb-24 lg:pb-32 px-6 lg:px-10 overflow-hidden">
        {/* Massive Hero Image */}
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 3, ease: 'easeOut' }}
            src="https://images.unsplash.com/photo-1600607686527-6fb886090705?w=2000&auto=format&fit=crop&q=80"
            alt="Luxury Interior"
            fetchpriority="high"
            decoding="async"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111111]/80 via-[#111111]/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/90 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[11px] font-bold tracking-[0.4em] text-[#F8F5F0] uppercase mb-6">
              The Fall 2026 Collection
            </p>
            <h1 className="font-hero text-6xl lg:text-8xl font-bold text-[#FFFFFF] leading-[0.95] tracking-tighter mb-8">
              Crafted for<br />Modern Living.
            </h1>
            <p className="text-lg lg:text-xl text-[#F8F5F0]/90 max-w-xl font-medium mb-12">
              Discover a curated selection of premium essentials. Elevated design, exceptional quality, delivered with unparalleled care.
            </p>
            
            <div className="flex items-center gap-6">
              <Link to="/products" className="bg-[#FFFFFF] text-[#111111] px-10 py-5 font-semibold tracking-[0.2em] text-[11px] uppercase hover:bg-[#F8F5F0] transition-colors font-body shadow-soft">
                Explore Collection
              </Link>
              <a href="#featured" className="text-[#FFFFFF] text-[11px] font-semibold tracking-[0.2em] uppercase hover:text-[#FFFFFF]/70 transition-colors font-body">
                Discover More
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FEATURED COLLECTIONS - Asymmetrical Editorial
      ═══════════════════════════════════════════════ */}
      <section id="featured" className="py-32 lg:py-48 px-6 lg:px-10 max-w-[1600px] mx-auto scroll-mt-20">
        <div className="text-center mb-20 lg:mb-32">
          <p className="label-editorial text-secondary mb-4">Curated Edits</p>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-primary tracking-tight">The Essentials</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10">
          {/* Large Left Card */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-7 h-[600px] lg:h-[800px] group relative overflow-hidden"
          >
            <Link to="/products?category=Fashion" className="block w-full h-full">
              <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&auto=format&fit=crop&q=80" alt="Fashion Edit" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-[2s] ease-[0.16,1,0.3,1] group-hover:scale-105" />
              <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/40 transition-colors duration-700" />
              <div className="absolute inset-x-0 bottom-0 p-10 lg:p-16">
                <p className="text-[10px] font-bold tracking-[0.3em] text-surface-white/80 uppercase mb-4">01 — The Wardrobe</p>
                <h3 className="font-heading text-4xl lg:text-5xl font-bold text-surface-white mb-6">Minimalist Fashion.</h3>
                <span className="text-surface-white text-[11px] font-semibold font-body tracking-[0.2em] uppercase border-b border-surface-white pb-1">Shop The Edit</span>
              </div>
            </Link>
          </motion.div>

          {/* Right Column (Stacked Cards) */}
          <div className="md:col-span-5 flex flex-col gap-6 lg:gap-10">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="h-[350px] lg:h-[450px] group relative overflow-hidden"
            >
              <Link to="/products?category=Electronics" className="block w-full h-full">
                <img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop&q=80" alt="Tech Edit" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-[2s] ease-[0.16,1,0.3,1] group-hover:scale-105" />
                <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/40 transition-colors duration-700" />
                <div className="absolute inset-x-0 bottom-0 p-8 lg:p-10">
                  <p className="text-[10px] font-bold tracking-[0.3em] text-surface-white/80 uppercase mb-3">02 — Productivity</p>
                  <h3 className="font-heading text-3xl font-bold text-surface-white mb-4">Tech Essentials.</h3>
                  <span className="text-surface-white text-[10px] font-semibold font-body tracking-[0.2em] uppercase border-b border-surface-white pb-1">Shop Now</span>
                </div>
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 min-h-[350px] group relative overflow-hidden bg-surface-secondary flex items-center justify-center p-10 text-center"
            >
              <Link to="/products?category=Furniture" className="block w-full">
                <p className="text-[10px] font-bold tracking-[0.3em] text-secondary uppercase mb-6">03 — Interiors</p>
                <h3 className="font-heading text-3xl font-bold text-primary mb-8 max-w-[250px] mx-auto">Elevate your living space.</h3>
                <span className="text-primary text-[10px] font-semibold font-body tracking-[0.2em] uppercase border-b border-primary pb-1 group-hover:text-secondary group-hover:border-secondary transition-colors">Explore Furniture</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CATEGORIES - Breathing Room & Tall Cards
      ═══════════════════════════════════════════════ */}
      <section className="py-24 lg:py-32 bg-surface-white">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 lg:mb-24 gap-6">
            <div>
              <p className="label-editorial text-secondary mb-4">Shop By Category</p>
              <h2 className="font-heading text-4xl lg:text-5xl font-bold text-primary tracking-tight">All Collections</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {CATEGORIES.map((cat, i) => (
              <CategoryCard key={cat} category={cat} index={i} count={categoryCounts[cat]} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          BEST SELLERS
      ═══════════════════════════════════════════════ */}
      <section className="py-32 lg:py-48 px-6 lg:px-10 max-w-[1600px] mx-auto">
        <div className="text-center mb-20 lg:mb-32">
          <p className="label-editorial text-secondary mb-4">Our Signatures</p>
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-primary tracking-tight">Highly Coveted</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
        </div>

        <div className="text-center mt-24">
          <Link to="/products" className="inline-block border border-primary text-primary hover:bg-primary hover:text-surface-white transition-colors duration-300 px-12 py-5 text-[11px] font-semibold font-body tracking-[0.2em] uppercase">
            View Complete Collection
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TRUST / PROMISES - Premium Info Cards
      ═══════════════════════════════════════════════ */}
      <section className="py-24 lg:py-32 bg-primary text-surface-white">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            {[
              {
                title: 'Complimentary Shipping',
                desc: 'Enjoy free, insured shipping on all luxury orders above ₹999. Delivered with exceptional care.',
                icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h.508c1.4 0 2.604.756 3.132 1.905l.395 1.258a1.5 1.5 0 01-.137 1.344l-.248.372z',
              },
              {
                title: 'Secure Payment',
                desc: 'Your transactions are protected with the highest level of encryption. Shop with absolute confidence.',
                icon: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z',
              },
              {
                title: 'Effortless Returns',
                desc: 'If an item doesn’t meet your expectations, our concierge will arrange a seamless return process.',
                icon: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99',
              },
              {
                title: '24/7 Concierge',
                desc: 'Our dedicated support team is available around the clock to assist you with any inquiries.',
                icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09l2.846.813-.813 2.846a4.5 4.5 0 00-3.09 3.09z',
              }
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-left"
              >
                <div className="w-12 h-12 border border-surface-white/20 flex items-center justify-center text-surface-white mb-6">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-surface-white/50 text-[14px] leading-relaxed font-medium">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
