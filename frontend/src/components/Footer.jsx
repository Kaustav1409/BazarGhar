import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const PAYMENT_ICONS = [
  { name: 'Visa', path: 'M2 6h20v12H2z', label: 'Visa' },
  { name: 'UPI', label: 'UPI' },
  { name: 'GPay', label: 'GPay' },
];

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
    <footer className="bg-charcoal text-white mt-20" role="contentinfo">
      {/* ── Newsletter Banner ─────────────────────────── */}
      <div className="border-b border-white/8">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-md">
              <p className="section-subheading mb-2 text-blue">Stay Updated</p>
              <h3 className="font-display text-2xl font-semibold text-white leading-tight">
                Get exclusive deals, first.
              </h3>
              <p className="text-sm text-white/40 mt-2">No spam. Curated picks only.</p>
            </div>
            <div className="w-full lg:w-auto">
              <AnimatePresence mode="wait">
                {subscribed ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 bg-emerald-500/15 border border-emerald-500/30 px-5 py-3.5 rounded-xl"
                  >
                    <svg className="w-5 h-5 text-green flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    <p className="text-sm font-medium text-green">You're subscribed! Check your inbox.</p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleNewsletterSubmit}
                    className="flex gap-2 w-full lg:w-auto"
                    id="footer-newsletter-form"
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      id="footer-newsletter-email"
                      className="flex-1 lg:w-64 px-4 py-3 bg-white/10 border border-white/15 rounded-xl text-white text-sm placeholder:text-grey outline-none focus:border-blue focus:ring-1 focus:ring-blue/40 transition-colors"
                    />
                    <button
                      type="submit"
                      id="footer-newsletter-submit"
                      className="btn-secondary shrink-0 py-3 px-5"
                    >
                      Subscribe
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Footer ───────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex flex-col leading-none group w-fit" aria-label="BazarGhar homepage">
              <span className="font-display text-2xl font-semibold text-white tracking-tight group-hover:text-blue transition-colors duration-300">
                BazarGhar
              </span>
              <span className="text-[10px] font-medium tracking-[0.18em] text-white/30 uppercase mt-0.5">
                Har Zaroorat Ek Jagah
              </span>
            </Link>
            <p className="mt-5 text-sm text-white/40 leading-relaxed max-w-xs">
              India's curated e-commerce destination. Premium products, seamless experience, delivered with care.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 mt-7">
              {socialLinks.map(({ label, href, path }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 text-white/40 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="mt-7">
              <p className="text-[10px] font-semibold tracking-widest text-white/20 uppercase mb-3">Secure payments</p>
              <div className="flex items-center gap-2 flex-wrap">
                {['Visa', 'Mastercard', 'UPI', 'GPay', 'PhonePe'].map((method) => (
                  <span
                    key={method}
                    className="px-2.5 py-1 bg-white/8 border border-white/10 rounded-lg text-[10px] font-semibold text-white/40 tracking-wide"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Link Columns */}
          <div className="hidden lg:contents">
            {footerSections.map(({ heading, links }) => (
              <div key={heading}>
                <h4 className="text-[10px] font-bold tracking-[0.2em] text-white/25 uppercase mb-5">
                  {heading}
                </h4>
                <ul className="space-y-3">
                  {links.map(({ label, to }) => (
                    <li key={label}>
                      <Link
                        to={to}
                        className="text-sm text-grey hover:text-blue transition-colors duration-200 focus-visible:outline-none focus-visible:underline"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Mobile Accordion Columns */}
          <div className="lg:hidden col-span-1 space-y-1">
            {footerSections.map(({ heading, links }) => (
              <div key={heading} className="border-b border-white/8">
                <button
                  onClick={() => setOpenSection(openSection === heading ? null : heading)}
                  className="w-full flex items-center justify-between py-4 text-sm font-semibold text-white/60 hover:text-white transition-colors focus-visible:outline-none"
                  aria-expanded={openSection === heading}
                >
                  {heading}
                  <motion.svg
                    animate={{ rotate: openSection === heading ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    aria-hidden="true"
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
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden pb-4 space-y-3"
                    >
                      {links.map(({ label, to }) => (
                        <li key={label}>
                          <Link to={to} className="text-sm text-white/40 hover:text-white transition-colors pl-1 block">
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

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/25">
            © {currentYear} BazarGhar Technologies Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-grey">
            <span>Crafted with</span>
            <span className="text-blue text-sm">♥</span>
            <span>in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
