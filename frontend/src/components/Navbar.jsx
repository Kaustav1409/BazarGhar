import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const { isAuthenticated, logout } = useAuth();
  const { getItemCount, openCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const itemCount = getItemCount();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    document.body.style.overflow = '';
  }, [location]);

  const toggleMobile = () => {
    setMobileOpen((prev) => {
      document.body.style.overflow = !prev ? 'hidden' : '';
      return !prev;
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Collections' },
    { to: '/#categories', label: 'Categories' },
    { to: '/#about', label: 'About' },
  ];

  const hideOnRoutes = ['/login', '/register'];
  if (hideOnRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <>
      {/* Skip to main content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>

      {/* ── Announcement Bar ─────────────────────────── */}
      <AnimatePresence>
        {announcementVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-50 bg-charcoal text-white overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
              <div className="flex-1 text-center text-xs font-medium tracking-wide">
                <span className="text-green font-semibold">🎉 Free Shipping</span>
                <span className="text-white/70"> on all orders above ₹999 · Use code </span>
                <span className="text-blue font-bold">BAZAAR10</span>
                <span className="text-white/70"> for 10% off your first order</span>
              </div>
              <button
                onClick={() => setAnnouncementVisible(false)}
                className="flex-shrink-0 text-white/50 hover:text-white transition-colors p-1 rounded"
                aria-label="Dismiss announcement"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Navbar ───────────────────────────────── */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed left-0 right-0 z-40 transition-all duration-500 ${
          announcementVisible ? 'top-8' : 'top-0'
        } ${
          scrolled
            ? 'bg-charcoal/95 backdrop-blur-md shadow-sm'
            : 'bg-charcoal'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-20 lg:h-28">

            {/* Brand */}
            <Link
              to="/"
              className="flex flex-col leading-none group"
              id="navbar-brand"
              aria-label="BazarGhar — Go to homepage"
            >
              <span className="font-display text-3xl lg:text-4xl font-semibold text-white tracking-tight group-hover:text-blue transition-colors duration-300">
                BazarGhar
              </span>
              <span className="text-[9px] font-medium tracking-[0.25em] text-grey uppercase mt-1 hidden lg:block">
                Har Zaroorat Ek Jagah
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map(({ to, label }) => {
                const isAnchor = to.startsWith('/#');
                if (isAnchor) {
                  return (
                    <Link
                      key={to}
                      to={to}
                      className="relative text-base font-medium text-white/70 hover:text-white transition-colors duration-200 pb-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/30 rounded"
                    >
                      {label}
                    </Link>
                  );
                }

                return (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      `relative text-base font-medium transition-colors duration-200 pb-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/30 rounded ${
                        isActive ? 'text-blue' : 'text-white/70 hover:text-white'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {label}
                        {isActive && (
                          <motion.span
                            layoutId="nav-underline"
                            className="absolute -bottom-0.5 left-0 right-0 h-px bg-blue"
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Search */}
              <Link
                to="/products"
                className="nav-icon-btn"
                aria-label="Search products"
                title="Search"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z" />
                </svg>
              </Link>

              {/* Profile */}
              {isAuthenticated ? (
                <div className="relative group">
                  <Link
                    to="/profile"
                    className="nav-icon-btn"
                    aria-label="My profile"
                    title="Profile"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </Link>
                  {/* Dropdown */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-surface rounded-2xl shadow-lg border border-grey py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right scale-95 group-hover:scale-100 z-50">
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-base text-charcoal/70 hover:text-blue hover:bg-grey-light transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" /></svg>
                      My Profile
                    </Link>
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-base text-charcoal/70 hover:text-blue hover:bg-grey-light transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" /></svg>
                      My Orders
                    </Link>
                    <div className="h-px bg-grey my-1.5" />
                    <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="nav-icon-btn"
                  aria-label="Sign in"
                  title="Sign in"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </Link>
              )}

              {/* Cart */}
              <button
                onClick={openCart}
                className="nav-icon-btn"
                aria-label={`Cart — ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
                title="Cart"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      key={itemCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                      className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-blue text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm"
                    >
                      {itemCount > 9 ? '9+' : itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Sign in CTA (unauthenticated) */}
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="ml-4 btn-secondary py-3 px-6 text-sm"
                >
                  Sign in
                </Link>
              )}
            </div>

            {/* Mobile: Cart + Hamburger */}
            <div className="lg:hidden flex items-center gap-1">
              <button onClick={openCart} className="nav-icon-btn" aria-label="Open cart">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-blue text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                    {itemCount}
                  </span>
                )}
              </button>
              <button
                onClick={toggleMobile}
                className="nav-icon-btn relative z-50"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
              >
                <motion.div animate={mobileOpen ? 'open' : 'closed'} className="w-5 h-5 flex flex-col justify-center gap-[5px]">
                  <motion.span
                    variants={{ open: { rotate: 45, y: 7, scaleX: 1 }, closed: { rotate: 0, y: 0, scaleX: 1 } }}
                    className="w-5 h-[1.5px] bg-current block origin-center"
                    transition={{ duration: 0.3 }}
                  />
                  <motion.span
                    variants={{ open: { opacity: 0, scaleX: 0 }, closed: { opacity: 1, scaleX: 1 } }}
                    className="w-5 h-[1.5px] bg-current block"
                    transition={{ duration: 0.3 }}
                  />
                  <motion.span
                    variants={{ open: { rotate: -45, y: -7, scaleX: 1 }, closed: { rotate: 0, y: 0, scaleX: 1 } }}
                    className="w-5 h-[1.5px] bg-current block origin-center"
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile Full-Screen Menu ───────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col bg-charcoal"
          >
            {/* Mobile menu header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-0">
              <Link to="/" className="flex flex-col leading-none" onClick={() => setMobileOpen(false)}>
                <span className="font-display text-3xl lg:text-4xl font-semibold text-white">BazarGhar</span>
                <span className="text-[8px] tracking-[0.2em] text-white/30 uppercase mt-0.5">Har Zaroorat Ek Jagah</span>
              </Link>
            </div>

            {/* Nav links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="flex flex-col gap-0 px-6 pt-10 flex-1"
            >
              {navLinks.map(({ to, label }, i) => (
                <motion.div
                  key={to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  className="border-b border-white/5"
                >
                  {to.startsWith('/#') ? (
                    <Link
                      to={to}
                      className="font-display text-4xl font-medium text-white/80 hover:text-blue transition-colors py-4 block"
                      onClick={() => setMobileOpen(false)}
                    >
                      {label}
                    </Link>
                  ) : (
                    <Link
                      to={to}
                      className="font-display text-4xl font-medium text-white/80 hover:text-blue transition-colors py-4 block"
                      onClick={() => setMobileOpen(false)}
                    >
                      {label}
                    </Link>
                  )}
                </motion.div>
              ))}

              {/* Auth actions */}
              <div className="mt-8 pt-6 flex flex-col gap-3">
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" className="flex items-center gap-3 text-base font-medium text-white/60 hover:text-white transition-colors" onClick={() => setMobileOpen(false)}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" /></svg>
                      My Profile
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-3 text-base font-medium text-red-400 hover:text-red-300 transition-colors text-left">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3 mt-2">
                    <Link to="/login" className="btn-outline border-white/20 text-white hover:bg-white hover:text-charcoal text-center" onClick={() => setMobileOpen(false)}>Sign In</Link>
                    <Link to="/register" className="btn-secondary text-center" onClick={() => setMobileOpen(false)}>Create Account</Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
