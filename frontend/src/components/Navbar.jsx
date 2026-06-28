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
    { to: '/categories', label: 'Categories' },
    { to: '/about', label: 'About' },
  ];

  const hideOnRoutes = ['/login', '/register'];
  if (hideOnRoutes.includes(location.pathname)) {
    return null;
  }

  // Detect dark theme requirement (About page always, Home page un-scrolled)
  const isDarkTheme = location.pathname === '/about' || (location.pathname === '/' && !scrolled);
  
  // Luxury Contrast Classes as requested
  const textLogo = isDarkTheme ? 'text-[#FFFFFF]' : 'text-[#111111]';
  const textTagline = isDarkTheme ? 'text-[#F8F5F0]/70' : 'text-[#1F1F1F]/70';
  
  const linkBase = `relative text-[11px] font-body uppercase tracking-[0.25em] font-medium transition-colors duration-300 pb-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/50 rounded`;
  const linkIdle = isDarkTheme ? 'text-[#F8F5F0] hover:text-[#FFFFFF]' : 'text-[#1F1F1F] hover:text-[#111111]';
  const linkActive = 'text-[#D4AF37]';
  
  const iconIdle = isDarkTheme ? 'text-[#FFFFFF] hover:bg-white/10' : 'text-[#1F1F1F] hover:bg-black/5';

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-surface-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium"
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
            transition={{ duration: 0.5, ease: [0.25, 1, 0.25, 1] }}
            className="fixed top-0 left-0 right-0 z-50 bg-brand text-surface-white overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
              <div className="flex-1 text-center text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase">
                <span className="text-secondary font-semibold">Premium Experience</span>
                <span className="text-surface-white/70 tracking-wide hidden sm:inline"> — Free shipping on all luxury orders above ₹999. Use code </span>
                <span className="text-surface-white/70 tracking-wide sm:hidden"> — Use code </span>
                <span className="text-secondary font-bold tracking-widest">BAZAAR10</span>
              </div>
              <button
                onClick={() => setAnnouncementVisible(false)}
                className="flex-shrink-0 text-surface-white/50 hover:text-surface-white transition-colors p-1 rounded"
                aria-label="Dismiss announcement"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
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
        transition={{ duration: 0.8, ease: [0.25, 1, 0.25, 1] }}
        className={`fixed left-0 right-0 z-40 transition-all duration-700 ${
          announcementVisible ? 'top-[36px]' : 'top-0'
        } ${
          scrolled
            ? (location.pathname === '/about' ? 'bg-primary/80 backdrop-blur-md shadow-soft border-b border-[rgba(255,255,255,0.08)] py-3' : 'glass shadow-soft border-b border-border py-3')
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-16">

            {/* Brand */}
            <Link
              to="/"
              className="flex flex-col leading-none group"
              id="navbar-brand"
              aria-label="BazarGhar — Go to homepage"
            >
              <span className={`font-brand text-3xl lg:text-4xl font-extrabold tracking-tight transition-colors duration-500 ${textLogo}`}>
                BazarGhar
              </span>
              <span className={`text-[8px] lg:text-[9px] font-body font-medium tracking-[0.4em] uppercase mt-1.5 hidden sm:block ${textTagline}`}>
                Har Zaroorat Ek Jagah
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-12">
              {navLinks.map(({ to, label }) => {
                return (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      `${linkBase} ${isActive ? linkActive : linkIdle}`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {label}
                        {isActive && (
                          <motion.span
                            layoutId="nav-underline"
                            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full bg-[#D4AF37]"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Search */}
              <Link
                to="/products"
                className={`flex items-center justify-center w-[2.125rem] h-[2.125rem] rounded-full transition-all duration-300 ${iconIdle}`}
                aria-label="Search products"
                title="Search"
              >
                <svg className="w-[1.125rem] h-[1.125rem]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z" />
                </svg>
              </Link>

              {/* Profile */}
              {isAuthenticated ? (
                <div className="relative group w-fit flex items-center">
                  <Link
                    to="/profile"
                    className={`flex items-center justify-center w-[2.125rem] h-[2.125rem] rounded-full transition-all duration-300 ${iconIdle}`}
                    aria-label="My profile"
                    title="Profile"
                  >
                    <svg className="w-[1.125rem] h-[1.125rem]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </Link>
                  {/* Dropdown */}
                  <div className="absolute right-0 top-full mt-2 w-56 card-premium !rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 origin-top-right scale-95 group-hover:scale-100 z-50">
                    <Link to="/profile" className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-primary/80 hover:text-brand hover:bg-surface-secondary transition-colors">
                      <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" /></svg>
                      My Profile
                    </Link>
                    <Link to="/profile" className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-primary/80 hover:text-brand hover:bg-surface-secondary transition-colors">
                      <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" /></svg>
                      My Orders
                    </Link>
                    <div className="divider my-2" />
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-3 text-[13px] font-bold text-error hover:bg-error/5 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className={`flex items-center justify-center w-[2.125rem] h-[2.125rem] rounded-full transition-all duration-300 ${iconIdle}`}
                  aria-label="Sign in"
                  title="Sign in"
                >
                  <svg className="w-[1.125rem] h-[1.125rem]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </Link>
              )}

              {/* Cart */}
              <button
                onClick={openCart}
                className={`relative flex items-center justify-center w-[2.125rem] h-[2.125rem] rounded-full transition-all duration-300 ${iconIdle}`}
                aria-label={`Cart — ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
                title="Cart"
              >
                <svg className="w-[1.125rem] h-[1.125rem]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
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
                      className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-brand text-surface-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm"
                    >
                      {itemCount > 9 ? '9+' : itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>

            {/* Mobile: Cart + Hamburger */}
            <div className="lg:hidden flex items-center gap-3">
              <button onClick={openCart} className={`relative p-2 ${isDarkTheme ? 'text-[#F5F5F5]' : 'text-primary'}`} aria-label="Open cart">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-brand text-surface-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                    {itemCount}
                  </span>
                )}
              </button>
              <button
                onClick={toggleMobile}
                className={`p-2 relative z-50 ${isDarkTheme ? 'text-[#F5F5F5]' : 'text-primary'}`}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
              >
                <motion.div animate={mobileOpen ? 'open' : 'closed'} className="w-5 h-5 flex flex-col justify-center gap-[5px]">
                  <motion.span
                    variants={{ open: { rotate: 45, y: 7, scaleX: 1, backgroundColor: '#D4AF37' }, closed: { rotate: 0, y: 0, scaleX: 1, backgroundColor: isDarkTheme ? '#FFFFFF' : '#1F1F1F' } }}
                    className="w-5 h-[1.5px] block origin-center"
                    transition={{ duration: 0.4, ease: [0.25, 1, 0.25, 1] }}
                  />
                  <motion.span
                    variants={{ open: { opacity: 0, scaleX: 0 }, closed: { opacity: 1, scaleX: 1, backgroundColor: isDarkTheme ? '#FFFFFF' : '#1F1F1F' } }}
                    className="w-5 h-[1.5px] block"
                    transition={{ duration: 0.4, ease: [0.25, 1, 0.25, 1] }}
                  />
                  <motion.span
                    variants={{ open: { rotate: -45, y: -7, scaleX: 1, backgroundColor: '#D4AF37' }, closed: { rotate: 0, y: 0, scaleX: 1, backgroundColor: isDarkTheme ? '#FFFFFF' : '#1F1F1F' } }}
                    className="w-5 h-[1.5px] block origin-center"
                    transition={{ duration: 0.4, ease: [0.25, 1, 0.25, 1] }}
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
            transition={{ duration: 0.5, ease: [0.25, 1, 0.25, 1] }}
            className="fixed inset-0 z-40 flex flex-col bg-surface-dark"
          >
            {/* Mobile menu header */}
            <div className="flex items-center justify-between px-6 pt-8 pb-0">
              <Link to="/" className="flex flex-col leading-none" onClick={() => setMobileOpen(false)}>
                <span className="font-brand text-3xl font-extrabold text-surface-white">BazarGhar</span>
                <span className="text-[9px] font-body font-medium tracking-[0.3em] text-secondary uppercase mt-1">Har Zaroorat Ek Jagah</span>
              </Link>
            </div>

            {/* Nav links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 1, 0.25, 1] }}
              className="flex flex-col gap-0 px-6 pt-12 flex-1"
            >
              {navLinks.map(({ to, label }, i) => (
                <motion.div
                  key={to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.1, duration: 0.5, ease: [0.25, 1, 0.25, 1] }}
                  className="border-b border-surface-white/10"
                >
                  <Link
                    to={to}
                    className="font-body text-4xl md:text-5xl font-medium text-surface-white/80 hover:text-secondary transition-colors py-6 block"
                    onClick={() => setMobileOpen(false)}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}

              {/* Auth actions */}
              <div className="mt-12 flex flex-col gap-4">
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" className="flex items-center gap-4 text-lg font-medium text-surface-white/80 hover:text-secondary transition-colors" onClick={() => setMobileOpen(false)}>
                      <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" /></svg>
                      My Profile
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-4 text-lg font-medium text-error hover:text-error/80 transition-colors text-left mt-2">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-4">
                    <Link to="/login" className="btn-primary" onClick={() => setMobileOpen(false)}>Sign In</Link>
                    <Link to="/register" className="btn-outline !text-surface-white !border-surface-white/20 hover:!border-secondary hover:!text-secondary" onClick={() => setMobileOpen(false)}>Create Account</Link>
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
