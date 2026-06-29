import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CATEGORIES = ['Electronics', 'Fashion', 'Books', 'Furniture', 'Lifestyle', 'Accessories'];

const NotFound = () => {
 const navigate = useNavigate();
 return (
 <div className="min-h-screen flex items-center justify-center bg-surface px-6 relative overflow-hidden"id="main-content">
 {/* Background blobs */}
 <div className="absolute -top-20 -right-20 w-72 h-72 bg-brand/10 rounded-full blur-[80px]"aria-hidden="true"/>
 <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-secondary/10 rounded-full blur-[80px]"aria-hidden="true"/>

 <div className="text-center max-w-xl relative z-10">
 {/* Animated floating number */}
 <motion.div
 initial={{ opacity: 0, y: 40 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
 className="relative mb-4"
 >
 <motion.h1
 animate={{ y: [0, -8, 0] }}
 transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
 className="font-display font-semibold text-primary leading-none tracking-tighter select-none"
 style={{ fontSize: 'clamp(8rem, 22vw, 15rem)' }}
 aria-label="404"
 >
 4
 <span className="text-brand">0</span>
 4
 </motion.h1>
 {/* Floating decorative elements */}
 <motion.div
 animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
 transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
 className="absolute top-4 -right-4 w-10 h-10 bg-brand/20 rounded-2xl"
 aria-hidden="true"
 />
 <motion.div
 animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
 transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
 className="absolute bottom-4 -left-6 w-7 h-7 bg-primary/10 rounded-xl"
 aria-hidden="true"
 />
 </motion.div>

 {/* Divider */}
 <motion.div
 initial={{ scaleX: 0 }}
 animate={{ scaleX: 1 }}
 transition={{ duration: 0.5, delay: 0.3 }}
 className="w-20 h-0.5 bg-brand mx-auto mb-8"
 aria-hidden="true"
 />

 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6, delay: 0.2 }}
 >
 <h2 className="font-display text-3xl font-semibold text-primary mb-4 tracking-tight">
 Page Not Found
 </h2>
 <p className="text-primary/70 text-sm leading-relaxed max-w-sm mx-auto mb-8">
 This page might have been moved, removed, or doesn't exist. Let's get you back on track.
 </p>

 {/* Search bar */}
 <div className="flex gap-2 max-w-sm mx-auto mb-8"role="search">
 <input
 type="search"
 placeholder="Search for products..."
 id="notfound-search"
 aria-label="Search for products"
 className="input-base flex-1 text-sm"
 onKeyDown={(e) => { if (e.key === 'Enter' && e.target.value) navigate(`/products?search=${e.target.value}`); }}
 />
 <button
 onClick={() => {
 const input = document.getElementById('notfound-search');
 if (input?.value) navigate(`/products?search=${input.value}`);
 }}
 className="btn-primary shrink-0"
 aria-label="Search"
 >
 <svg className="w-4 h-4"fill="none"viewBox="0 0 24 24"strokeWidth={2} stroke="currentColor"aria-hidden="true">
 <path strokeLinecap="round"strokeLinejoin="round"d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z"/>
 </svg>
 </button>
 </div>

 {/* Category links */}
 <p className="label-editorial mb-4">Browse Categories</p>
 <div className="flex flex-wrap justify-center gap-2 mb-10">
 {CATEGORIES.map((cat) => (
 <Link
 key={cat}
 to={`/products?category=${cat}`}
 className="label-editorial px-4 py-2 border border-border/60 rounded-xl hover:border-primary hover:text-primary transition-colors cursor-pointer inline-flex bg-surface"
 >
 {cat}
 </Link>
))}
 </div>

 <Link to="/"id="notfound-home-btn"className="btn-primary inline-flex">
 <svg className="w-4 h-4"fill="none"viewBox="0 0 24 24"strokeWidth={2} stroke="currentColor"aria-hidden="true">
 <path strokeLinecap="round"strokeLinejoin="round"d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
 </svg>
 Return to Homepage
 </Link>
 </motion.div>
 </div>
 </div>
);
};

export default NotFound;
