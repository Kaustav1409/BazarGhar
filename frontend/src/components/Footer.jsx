import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const location = useLocation();

  const hideOnRoutes = ['/login', '/register'];
  if (hideOnRoutes.includes(location.pathname)) {
    return null;
  }

  const footerSections = [
    {
      heading: 'Shop',
      links: [
        { label: 'All Products', to: '/products' },
        { label: 'Electronics', to: '/products?category=Electronics' },
        { label: 'Fashion', to: '/products?category=Fashion' },
        { label: 'Books', to: '/products?category=Books' },
        { label: 'Furniture', to: '/products?category=Furniture' },
      ],
    },
    {
      heading: 'Account',
      links: [
        { label: 'My Profile', to: '/profile' },
        { label: 'My Orders', to: '/profile' },
        { label: 'Cart', to: '/cart' },
        { label: 'Checkout', to: '/checkout' },
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'About BazarGhar', to: '/' },
        { label: 'Privacy Policy', to: '/' },
        { label: 'Terms of Service', to: '/' },
        { label: 'Contact Us', to: '/' },
      ],
    },
  ];

  const socialLinks = [
    {
      label: 'Instagram',
      href: '#',
      path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
    },
    {
      label: 'Twitter / X',
      href: '#',
      path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
    },
    {
      label: 'LinkedIn',
      href: '#',
      path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
    },
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-primary text-surface-white" role="contentinfo">
      
      {/* ── Premium Newsletter ─────────────────────────── */}
      <div className="border-t border-b border-surface-white/10 bg-primary/95 py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-surface-white/40 mb-6">Join The Club</p>
          <h3 className="font-heading text-4xl lg:text-5xl font-bold text-surface-white mb-8 tracking-tight">
            Exclusive privileges, delivered.
          </h3>
          <p className="text-sm lg:text-base text-surface-white/60 mb-12 max-w-lg mx-auto font-medium">
            Subscribe to receive insider access to new collections, exclusive events, and premium editorial content.
          </p>
          
          <AnimatePresence mode="wait">
            {subscribed ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-3 px-8 py-5 border border-surface-white/20 rounded-full"
              >
                <svg className="w-5 h-5 text-surface-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <p className="text-sm font-bold tracking-widest uppercase">Welcome to BazarGhar</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleNewsletterSubmit}
                className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
                id="footer-newsletter-form"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  id="footer-newsletter-email"
                  className="flex-1 px-8 py-5 bg-transparent border border-surface-white/20 rounded-full text-surface-white text-sm font-medium placeholder:text-surface-white/30 outline-none focus:border-surface-white transition-all text-center sm:text-left"
                />
                <button
                  type="submit"
                  id="footer-newsletter-submit"
                  className="bg-surface-white text-primary px-10 py-5 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-surface transition-colors shrink-0"
                >
                  Subscribe
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Main Footer ───────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">

          {/* Brand Column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <Link to="/" className="inline-block group focus-visible:outline-none" aria-label="BazarGhar homepage">
                <span className="font-heading text-4xl lg:text-5xl font-bold text-surface-white tracking-tighter">
                  BazarGhar.
                </span>
              </Link>
              <p className="mt-8 text-[14px] text-surface-white/50 leading-relaxed max-w-[320px] font-medium">
                The ultimate destination for premium curation. We bring the world's finest products directly to your doorstep with exceptional care.
              </p>
            </div>

            <div className="mt-16 flex items-center gap-6">
              {socialLinks.map(({ label, href, path }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-surface-white/30 hover:text-surface-white transition-colors duration-300 focus-visible:outline-none"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns Desktop */}
          <div className="hidden lg:contents">
            <div className="lg:col-span-2"></div>
            {footerSections.map(({ heading, links }, idx) => (
              <div key={heading} className={`lg:col-span-2 lg:col-start-${8 + (idx * 2)}`}>
                <h4 className="text-[10px] font-bold tracking-[0.25em] text-surface-white/40 uppercase mb-8">
                  {heading}
                </h4>
                <ul className="space-y-4">
                  {links.map(({ label, to }) => (
                    <li key={label}>
                      <Link
                        to={to}
                        className="text-[13px] font-medium text-surface-white/70 hover:text-surface-white transition-colors duration-300 focus-visible:outline-none"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Link Columns Mobile Accordion */}
          <div className="lg:hidden col-span-1 border-t border-surface-white/10">
            {footerSections.map(({ heading, links }) => (
              <div key={heading} className="border-b border-surface-white/10">
                <button
                  onClick={() => setOpenSection(openSection === heading ? null : heading)}
                  className="w-full flex items-center justify-between py-6 text-[10px] font-bold tracking-[0.2em] uppercase text-surface-white/70 focus-visible:outline-none"
                  aria-expanded={openSection === heading}
                >
                  {heading}
                  <motion.svg
                    animate={{ rotate: openSection === heading ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-4 h-4 text-surface-white/40"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>
                <AnimatePresence>
                  {openSection === heading && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pb-6 space-y-4"
                    >
                      {links.map(({ label, to }) => (
                        <li key={label}>
                          <Link to={to} className="text-[13px] font-medium text-surface-white/60 hover:text-surface-white block">
                            {label}
                          </Link>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-surface-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[11px] font-bold tracking-widest text-surface-white/30 uppercase">
            © {currentYear} BazarGhar Technologies
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold tracking-[0.2em] text-surface-white/30 uppercase">Secure Checkout</span>
            <div className="flex items-center gap-2">
              {['Visa', 'Mastercard', 'UPI', 'Amex'].map((method) => (
                <span
                  key={method}
                  className="px-2.5 py-1 border border-surface-white/10 rounded-[4px] text-[9px] font-bold text-surface-white/40 uppercase tracking-widest"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
