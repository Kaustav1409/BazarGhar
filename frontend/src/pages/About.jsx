import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-primary text-[#F8F5F0]" id="main-content">
      <SEO title="About Us" description="Learn more about BazarGhar's commitment to quality." />
      
      {/* ── Hero Section ─────────────────────────────── */}
      <section className="pt-32 lg:pt-48 pb-20 px-6 lg:px-10 max-w-[1600px] mx-auto border-b border-[rgba(255,255,255,0.08)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <p className="font-body text-[11px] font-medium tracking-[0.4em] text-[#C8BDAE] uppercase mb-6">
              Our Philosophy
            </p>
            <h1 className="font-hero text-5xl lg:text-7xl font-bold text-[#F8F5F0] leading-[1.05] tracking-tighter mb-8">
              Elevating everyday living through exceptional quality and design.
            </h1>
            <p className="font-body text-lg text-[#C8BDAE] max-w-2xl leading-relaxed mb-10">
              BazarGhar was founded on a simple principle: to curate the world's finest essentials and deliver them with unparalleled care. Every item in our collection is rigorously vetted for craftsmanship, sustainability, and timeless aesthetic.
            </p>
            <Link to="/products" className="inline-block border border-[rgba(255,255,255,0.2)] text-[#F8F5F0] hover:bg-[#F8F5F0] hover:text-primary transition-colors duration-300 px-10 py-4 text-[11px] font-body font-semibold tracking-[0.2em] uppercase">
              Explore Collections
            </Link>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 h-[400px] lg:h-[600px] relative overflow-hidden"
          >
            <img 
              src="https://images.unsplash.com/photo-1600607686527-6fb886090705?w=1000&auto=format&fit=crop&q=80" 
              alt="BazarGhar Philosophy" 
              className="w-full h-full object-cover rounded-sm opacity-90"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Feature Cards Section ──────────────────────── */}
      <section className="py-24 lg:py-32 px-6 lg:px-10 max-w-[1600px] mx-auto">
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-[#F8F5F0] tracking-tight mb-6">
            The BazarGhar Promise
          </h2>
          <div className="w-12 h-[1px] bg-[rgba(212,175,55,0.18)] mx-auto mb-6" />
          <p className="font-body text-[#C8BDAE] text-base leading-relaxed">
            We hold ourselves to the highest standards of luxury commerce, ensuring every touchpoint of your journey exceeds expectations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col border border-[rgba(255,255,255,0.08)] p-10 hover:border-[rgba(212,175,55,0.3)] transition-colors duration-500 bg-white/[0.02]"
            >
              <div className="w-14 h-14 border border-[rgba(255,255,255,0.15)] flex items-center justify-center text-[#F5F5F5] mb-8">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                </svg>
              </div>
              <h3 className="font-heading text-xl font-bold text-[#F8F5F0] mb-4">{feature.title}</h3>
              <p className="font-body text-[#C8BDAE] text-[14px] leading-relaxed font-normal">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
