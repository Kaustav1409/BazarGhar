import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 800);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const hideOnRoutes = ['/login', '/register', '/checkout'];
  if (hideOnRoutes.includes(location.pathname)) {
    return null;
  }

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const shopLinks = [
    { label: 'New Arrivals', to: '/products?sort=new' },
    { label: 'Collections', to: '/products' },
    { label: 'Best Sellers', to: '/products?sort=rating' },
    { label: 'Categories', to: '/categories' },
    { label: 'Gift Cards', to: '/gift-cards' },
    { label: 'Luxury Picks', to: '/products?category=Luxury' },
  ];

  const supportLinks = [
    { label: 'Help Centre', to: '/help' },
    { label: 'Track Order', to: '/track-order' },
    { label: 'Shipping', to: '/shipping' },
    { label: 'Returns', to: '/returns' },
    { label: 'Refund Policy', to: '/refunds' },
    { label: 'FAQs', to: '/faq' },
    { label: 'Contact Us', to: '/contact' },
  ];

  const companyLinks = [
    { label: 'About', to: '/about' },
    { label: 'Our Story', to: '/story' },
    { label: 'Careers', to: '/careers' },
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms & Conditions', to: '/terms' },
    { label: 'Cookie Policy', to: '/cookies' },
  ];

  const socialLinks = [
    { label: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
    { label: 'LinkedIn', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
    { label: 'Facebook', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
    { label: 'Pinterest', path: 'M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.633 0 12.017 0z' },
    { label: 'YouTube', path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
    { label: 'X', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
  ];

  const trustFeatures = [
    'Secure Payments',
    'Fast Delivery',
    'Easy Returns',
    'Premium Quality',
    '24×7 Customer Support'
  ];

  const paymentMethods = ['Visa', 'Mastercard', 'RuPay', 'UPI', 'Amex'];

  return (
    <footer className="bg-surface-dark text-primary border-t border-border/40 relative overflow-hidden" role="contentinfo">

      {/* ── Main Footer Flex Grid ───────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-16 lg:pt-20 pb-12">
        <div className="flex flex-col lg:flex-row flex-wrap xl:flex-nowrap gap-12 xl:gap-8 justify-between">

          {/* Column 1: Brand */}
          <div className="w-full lg:w-[calc(50%-24px)] xl:w-[380px] shrink-0 flex flex-col">
            <Link to="/" className="inline-block group focus-visible:outline-none" aria-label="BazarGhar homepage">
              <span className="font-brand text-4xl lg:text-5xl font-extrabold text-primary-light tracking-tighter block w-full">
                BazarGhar
              </span>
            </Link>
            <p className="mt-2 text-[11px] font-body font-medium tracking-[0.3em] uppercase text-secondary">
              Har Zaroorat Ek Jagah
            </p>
            <p className="mt-8 text-[14px] text-[#F7F3EC] leading-relaxed font-body max-w-sm">
              Curating premium products for modern lifestyles with exceptional craftsmanship, trusted quality and timeless design.
            </p>

            {/* Our Promise Block */}
            <div className="mt-10 border-l-2 border-secondary pl-5 py-1">
              <h4 className="text-[10px] font-bold tracking-[0.25em] text-secondary uppercase mb-3 font-body">Our Promise</h4>
              <p className="text-[13px] text-[#F7F3EC] leading-relaxed font-body max-w-[280px]">
                Every product on BazarGhar is carefully selected for its quality, craftsmanship, and lasting value. We believe luxury is defined by thoughtful design, trusted service, and an exceptional shopping experience.
              </p>
            </div>
          </div>

          {/* Middle Columns Grid (Shop, Support, Company) */}
          <div className="w-full xl:flex-1 grid grid-cols-2 md:grid-cols-3 gap-10 xl:gap-6">

            {/* Column 2: Shop */}
            <div className="flex flex-col">
              <h4 className="text-[12px] font-bold tracking-[0.2em] text-[#F7F3EC] uppercase mb-8 font-body">Shop</h4>
              <ul className="space-y-5">
                {shopLinks.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="text-[14px] font-medium font-body text-[#F7F3EC] hover:text-primary-light transition-colors duration-300 focus-visible:outline-none relative group inline-block">
                      {label}
                      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-secondary transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Customer Support */}
            <div className="flex flex-col">
              <h4 className="text-[12px] font-bold tracking-[0.2em] text-[#F7F3EC] uppercase mb-8 font-body">Customer Support</h4>
              <ul className="space-y-5">
                {supportLinks.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="text-[14px] font-medium font-body text-[#F7F3EC] hover:text-primary-light transition-colors duration-300 focus-visible:outline-none relative group inline-block">
                      {label}
                      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-secondary transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Company */}
            <div className="flex flex-col">
              <h4 className="text-[12px] font-bold tracking-[0.2em] text-[#F7F3EC] uppercase mb-8 font-body">Company</h4>
              <ul className="space-y-5">
                {companyLinks.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="text-[14px] font-medium font-body text-[#F7F3EC] hover:text-primary-light transition-colors duration-300 focus-visible:outline-none relative group inline-block">
                      {label}
                      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-secondary transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 5: Newsletter */}
          <div className="w-full lg:w-[calc(50%-24px)] xl:w-[360px] shrink-0 flex flex-col">
            <h4 className="font-hero text-3xl font-bold text-primary-light mb-4">Stay Inspired</h4>
            <p className="text-[14px] text-[#F7F3EC] font-body mb-8 leading-relaxed max-w-sm">
              Receive exclusive launches, luxury collections and member-only offers.
            </p>

            <AnimatePresence mode="wait">
              {subscribed ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4 px-6 py-5 bg-surface border border-secondary/40 rounded-2xl"
                >
                  <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <p className="text-[12px] font-bold tracking-widest text-primary-light uppercase">Subscribed Successfully</p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleNewsletterSubmit}
                  className="flex flex-col gap-4"
                >
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      required
                      className="input-base w-full bg-surface border-border/40 focus:border-secondary focus:ring-secondary/20 placeholder:text-primary/50 text-[14px]"
                      aria-label="Email Address for Newsletter"
                    />
                    <button
                      type="submit"
                      className="btn-primary shrink-0 px-8 py-4 whitespace-nowrap shadow-card"
                      aria-label="Subscribe Newsletter"
                    >
                      Subscribe
                    </button>
                  </div>
                  <p className="text-[11px] text-primary/50 font-body tracking-wide">No spam. Unsubscribe anytime.</p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Social Icons (Centered below columns) ────────────────────── */}
        <div className="mt-12 pt-10 border-t border-border/30 flex justify-center">
          <div className="flex items-center gap-5 flex-wrap justify-center">
            {socialLinks.map(({ label, path }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="w-[44px] h-[44px] flex items-center justify-center rounded-full border border-secondary/40 bg-transparent text-[#F7F3EC] hover:bg-secondary hover:border-secondary hover:text-surface-dark hover:-translate-y-1 hover:shadow-card transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
              >
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* ── Premium Trust Strip (Below Social) ────────────────────────── */}
        <div className="mt-10 py-8 border-y border-border/30 bg-surface/40 backdrop-blur-md rounded-3xl">
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 px-6">
            {trustFeatures.map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: 'easeOut' }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-secondary" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <span className="text-[12px] font-bold tracking-[0.15em] text-primary-light uppercase">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ─────────────────────────────────────────────── */}
      <div className="bg-surface py-5 border-t border-border/30">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left: Premium Monochrome Payment Logos */}
          <div className="flex items-center gap-5 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-default">
            {/* Visa */}
            <span className="font-sans italic font-extrabold text-[15px] tracking-tighter text-[#E0E0E0] leading-none select-none" title="Visa">VISA</span>
            {/* Mastercard */}
            <svg viewBox="0 0 24 16" className="h-[14px] w-auto text-[#E0E0E0]" title="Mastercard">
              <circle cx="8" cy="8" r="8" fill="currentColor" fillOpacity="0.6"/>
              <circle cx="16" cy="8" r="8" fill="currentColor" fillOpacity="0.8"/>
            </svg>
            {/* RuPay */}
            <span className="font-sans font-extrabold italic text-[13px] tracking-tight text-[#E0E0E0] leading-none select-none" title="RuPay">RuPay</span>
            {/* UPI */}
            <span className="font-sans font-extrabold italic text-[13px] tracking-tighter text-[#E0E0E0] leading-none border-l-[3px] border-[#E0E0E0] pl-1 select-none" title="UPI">UPI</span>
            {/* Amex */}
            <span className="font-sans font-bold text-[10px] tracking-tight text-[#E0E0E0] border-[1.5px] border-[#E0E0E0] px-1 py-[1px] leading-none rounded-sm select-none" title="Amex">AMEX</span>
          </div>

          {/* Center: Copyright */}
          <div className="text-center order-first md:order-none mb-2 md:mb-0">
            <p className="text-[10px] font-medium tracking-[0.1em] text-primary/60 font-body uppercase">
              © {currentYear} BazarGhar. All Rights Reserved.
            </p>
          </div>

          {/* Right: Links & Back To Top */}
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-5">
              <Link to="/privacy" className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#E0E0E0] hover:text-[#F7F3EC] transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#E0E0E0] hover:text-[#F7F3EC] transition-colors">
                Terms
              </Link>
              <Link to="/cookies" className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#E0E0E0] hover:text-[#F7F3EC] transition-colors">
                Cookies
              </Link>
            </div>
            
            {/* Circular Back To Top Button */}
            <button 
              onClick={scrollToTop} 
              className="ml-2 w-8 h-8 rounded-full border border-border/40 flex items-center justify-center text-[#E0E0E0] hover:text-surface-dark hover:border-secondary hover:bg-secondary transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary group shadow-sm"
              aria-label="Back to top"
            >
              <svg className="w-3.5 h-3.5 transform group-hover:-translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
