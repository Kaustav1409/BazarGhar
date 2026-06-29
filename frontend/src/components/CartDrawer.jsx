import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import premiumFallback from '../assets/images/premium_fallback.jpg';

const CartDrawer = () => {
 const {
 isCartOpen,
 closeCart,
 cartItems,
 removeFromCart,
 updateQuantity,
 getTotalPrice,
 } = useCart();

 const formatPrice = (price) =>
 new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

 const total = getTotalPrice();
 const freeShippingThreshold = 999;
 const remainingForFree = Math.max(0, freeShippingThreshold - total);
 const progressPct = Math.min(100, (total / freeShippingThreshold) * 100);

 useEffect(() => {
 document.body.style.overflow = isCartOpen ? 'hidden' : 'unset';
 return () => { document.body.style.overflow = 'unset'; };
 }, [isCartOpen]);

 return (
 <AnimatePresence>
 {isCartOpen && (
 <>
 {/* Backdrop */}
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.4 }}
 onClick={closeCart}
 className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-md"
 aria-hidden="true"
 />

 {/* Drawer */}
 <motion.div
 role="dialog"
 aria-modal="true"
 aria-label="Shopping cart"
 initial={{ x: '100%' }}
 animate={{ x: 0 }}
 exit={{ x: '100%' }}
 transition={{ type: 'spring', damping: 28, stiffness: 260 }}
 className="fixed inset-y-0 right-0 z-50 w-full max-w-[440px] bg-surface-white shadow-2xl flex flex-col border-l border-border"
 >
 {/* ── Header ───────────────────────────────── */}
 <div className="flex items-center justify-between px-8 py-6 bg-surface border-b border-border flex-shrink-0">
 <div className="flex items-center gap-4">
 <h2 className="font-heading text-2xl font-bold text-primary">Your Cart</h2>
 <AnimatePresence>
 {cartItems.length > 0 && (
 <motion.span
 initial={{ scale: 0 }}
 animate={{ scale: 1 }}
 exit={{ scale: 0 }}
 className="flex items-center justify-center w-6 h-6 rounded-full bg-brand text-surface-white text-[11px] font-bold shadow-sm"
 >
 {cartItems.length}
 </motion.span>
)}
 </AnimatePresence>
 </div>
 <button
 onClick={closeCart}
 className="p-2 -mr-2 rounded-full text-primary/60 hover:text-brand hover:bg-border/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
 aria-label="Close cart"
 >
 <svg className="w-5 h-5"fill="none"viewBox="0 0 24 24"strokeWidth={2} stroke="currentColor"aria-hidden="true">
 <path strokeLinecap="round"strokeLinejoin="round"d="M6 18L18 6M6 6l12 12"/>
 </svg>
 </button>
 </div>

 {/* ── Free Shipping Progress ───────────────── */}
 {cartItems.length > 0 && (
 <div className="px-8 py-5 bg-surface-white border-b border-border flex-shrink-0 relative">
 <div className="absolute inset-0 bg-gradient-to-b from-surface to-transparent opacity-50 pointer-events-none"/>
 <div className="relative">
 <div className="flex items-center justify-between mb-2">
 <p className="text-xs font-medium text-primary/70">
 {remainingForFree > 0 ? (
 <>Add <span className="font-bold text-primary">{formatPrice(remainingForFree)}</span> more for free shipping</>
) : (
 <span className="text-brand font-semibold">🎉 You've unlocked free shipping!</span>
)}
 </p>
 <span className="text-[10px] font-bold text-secondary">{Math.round(progressPct)}%</span>
 </div>
 <div className="w-full h-1 bg-surface-secondary rounded-full overflow-hidden shadow-inner-soft">
 <motion.div
 className="h-full bg-gradient-to-r from-secondary to-brand rounded-full"
 initial={{ width: 0 }}
 animate={{ width: `${progressPct}%` }}
 transition={{ duration: 0.6, ease: 'easeOut' }}
 />
 </div>
 </div>
 </div>
)}

 {/* ── Items Area ───────────────────────────── */}
 <div className="flex-1 overflow-y-auto px-6 py-6">
 {cartItems.length === 0 ? (
 /* Empty State */
 <div className="h-full flex flex-col items-center justify-center text-center gap-5 py-12">
 <motion.div
 initial={{ scale: 0.8, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 transition={{ duration: 0.5, type: 'spring' }}
 className="relative"
 >
 <div className="w-28 h-28 glass shadow-inner-soft rounded-full flex items-center justify-center border border-border">
 <svg className="w-10 h-10 text-secondary"fill="none"viewBox="0 0 24 24"strokeWidth={1.2} stroke="currentColor"aria-hidden="true">
 <path strokeLinecap="round"strokeLinejoin="round"d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"/>
 </svg>
 </div>
 {/* Decorative dots */}
 <div className="absolute -top-2 -right-2 w-4 h-4 bg-brand/30 rounded-full"/>
 <div className="absolute -bottom-1 -left-3 w-3 h-3 bg-secondary/30 rounded-full"/>
 </motion.div>
 <div>
 <h3 className="font-heading text-xl font-bold text-primary mb-2">Your cart is empty</h3>
 <p className="text-sm text-primary/60 leading-relaxed max-w-[240px] mx-auto font-medium">
 Discover our curated collection of premium products.
 </p>
 </div>
 <button onClick={closeCart} className="btn-primary mt-4">
 Start Shopping
 <svg className="w-4 h-4"fill="none"viewBox="0 0 24 24"strokeWidth={2} stroke="currentColor"aria-hidden="true">
 <path strokeLinecap="round"strokeLinejoin="round"d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
 </svg>
 </button>
 </div>
) : (
 <div className="space-y-4">
 <AnimatePresence initial={false}>
 {cartItems.map((item) => (
 <motion.div
 key={item._id}
 layout
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
 transition={{ duration: 0.4 }}
 className="flex gap-4 p-4 card-premium group relative overflow-hidden"
 >
 <div className="absolute inset-0 bg-gradient-to-tr from-surface/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"/>

 {/* Image */}
 <Link to={`/product/${item._id}`} onClick={closeCart} className="flex-shrink-0 w-24 h-28 bg-surface rounded-xl overflow-hidden block relative z-10 border border-secondary/10">
 <img
 src={item.image || premiumFallback}
 alt={item.name}
 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
 onError={(e) => { e.target.onerror = null; e.target.src = premiumFallback; }}
 />
 </Link>

 {/* Details */}
 <div className="flex-1 flex flex-col justify-between py-1 min-w-0 relative z-10">
 <div>
 <p className="label-editorial text-secondary mb-1">{item.category}</p>
 <Link to={`/product/${item._id}`} onClick={closeCart}>
 <h4 className="text-[13px] font-semibold text-primary leading-snug line-clamp-2 group-hover:text-brand transition-colors">{item.name}</h4>
 </Link>
 </div>

 <div className="flex items-end justify-between mt-3">
 <p className="font-heading text-lg font-extrabold text-primary">
 {formatPrice(item.price)}
 </p>

 {/* Animated Qty Controls */}
 <div className="flex items-center border border-border rounded-xl overflow-hidden glass shadow-inner-soft">
 <button
 onClick={() => updateQuantity(item._id, item.quantity - 1)}
 className="w-8 h-8 flex items-center justify-center text-primary/70 hover:text-brand hover:bg-surface transition-colors text-lg leading-none focus-visible:outline-none"
 aria-label="Decrease quantity"
 >−</button>
 <div className="w-8 h-8 flex items-center justify-center overflow-hidden relative">
 <AnimatePresence mode="popLayout">
 <motion.span
 key={item.quantity}
 initial={{ y: -15, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 exit={{ y: 15, opacity: 0 }}
 transition={{ duration: 0.2 }}
 className="text-[13px] font-bold text-primary absolute"
 >
 {item.quantity}
 </motion.span>
 </AnimatePresence>
 </div>
 <button
 onClick={() => updateQuantity(item._id, Math.min(item.stock || 10, item.quantity + 1))}
 className="w-8 h-8 flex items-center justify-center text-primary/70 hover:text-brand hover:bg-surface transition-colors text-base leading-none focus-visible:outline-none"
 aria-label="Increase quantity"
 >+</button>
 </div>
 </div>
 </div>

 {/* Remove */}
 <button
 onClick={() => removeFromCart(item._id)}
 className="absolute top-3 right-3 p-1.5 rounded-full text-primary/70 hover:text-error hover:bg-error/10 transition-all flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error z-20 opacity-0 group-hover:opacity-100"
 aria-label={`Remove ${item.name} from cart`}
 >
 <svg className="w-4 h-4"fill="none"viewBox="0 0 24 24"strokeWidth={2} stroke="currentColor"aria-hidden="true">
 <path strokeLinecap="round"strokeLinejoin="round"d="M6 18L18 6M6 6l12 12"/>
 </svg>
 </button>
 </motion.div>
))}
 </AnimatePresence>
 </div>
)}
 </div>

 {/* ── Footer ───────────────────────────────── */}
 {cartItems.length > 0 && (
 <div className="border-t border-border bg-surface-white px-8 py-6 flex-shrink-0 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
 {/* Total */}
 <div className="flex items-end justify-between mb-6">
 <div>
 <p className="label-editorial text-primary/70 mb-1">Subtotal</p>
 <p className="text-[10px] text-primary/70 font-medium">Shipping & taxes at checkout</p>
 </div>
 <p className="font-heading text-3xl font-extrabold text-primary">
 {formatPrice(total)}
 </p>
 </div>

 {/* CTAs */}
 <Link
 to="/checkout"
 onClick={closeCart}
 id="cart-drawer-checkout"
 className="btn-primary w-full flex justify-center items-center"
 >
 Proceed to Checkout
 <svg className="w-4 h-4"fill="none"viewBox="0 0 24 24"strokeWidth={2.5} stroke="currentColor"aria-hidden="true">
 <path strokeLinecap="round"strokeLinejoin="round"d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"/>
 </svg>
 </Link>
 <div className="flex items-center justify-between mt-4">
 <Link to="/cart"onClick={closeCart} className="text-[11px] text-primary/60 hover:text-brand transition-colors uppercase tracking-widest font-bold">
 View full cart
 </Link>
 <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-secondary">
 <svg className="w-3.5 h-3.5"fill="none"viewBox="0 0 24 24"strokeWidth={2} stroke="currentColor"aria-hidden="true">
 <path strokeLinecap="round"strokeLinejoin="round"d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
 </svg>
 Secure SSL Checkout
 </div>
 </div>
 </div>
)}
 </motion.div>
 </>
)}
 </AnimatePresence>
);
};

export default CartDrawer;
