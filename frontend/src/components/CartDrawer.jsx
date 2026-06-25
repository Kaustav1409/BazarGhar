import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

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
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-[3px]"
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
            className="fixed inset-y-0 right-0 z-50 w-full max-w-[420px] bg-white shadow-2xl flex flex-col border-l border-grey"
          >
            {/* ── Header ───────────────────────────────── */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-grey bg-white flex-shrink-0">
              <div className="flex items-center gap-3">
                <h2 className="font-display text-xl font-semibold text-charcoal">Your Cart</h2>
                <AnimatePresence>
                  {cartItems.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center justify-center w-6 h-6 rounded-full bg-blue text-white text-[11px] font-bold"
                    >
                      {cartItems.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <button
                onClick={closeCart}
                className="p-2.5 -mr-1 rounded-xl text-grey-dark hover:text-charcoal hover:bg-grey-light transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/30"
                aria-label="Close cart"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* ── Free Shipping Progress ───────────────── */}
            {cartItems.length > 0 && (
              <div className="px-6 py-3 bg-surface border-b border-grey flex-shrink-0">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-medium text-grey-dark">
                    {remainingForFree > 0 ? (
                      <>Add <span className="font-bold text-charcoal">{formatPrice(remainingForFree)}</span> more for free shipping</>
                    ) : (
                      <span className="text-green font-semibold">🎉 You've unlocked free shipping!</span>
                    )}
                  </p>
                  <span className="text-[10px] font-bold text-blue">{Math.round(progressPct)}%</span>
                </div>
                <div className="w-full h-1.5 bg-grey rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue to-blue-hover rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )}

            {/* ── Items Area ───────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {cartItems.length === 0 ? (
                /* Empty State */
                <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-12">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, type: 'spring' }}
                    className="relative"
                  >
                    <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center border-2 border-dashed border-grey">
                      <svg className="w-10 h-10 text-grey" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                      </svg>
                    </div>
                    {/* Decorative dots */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue/30 rounded-full" />
                    <div className="absolute -bottom-1 -left-3 w-3 h-3 bg-charcoal/10 rounded-full" />
                  </motion.div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-charcoal mb-1.5">Your cart is empty</h3>
                    <p className="text-sm text-grey-dark leading-relaxed max-w-[220px] mx-auto">
                      Discover our curated collection of premium products.
                    </p>
                  </div>
                  <button onClick={closeCart} className="btn-secondary mt-2">
                    Start Shopping
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <AnimatePresence initial={false}>
                    {cartItems.map((item) => (
                      <motion.div
                        key={item._id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex gap-3.5 p-4 bg-white rounded-2xl border border-border/50 shadow-soft"
                      >
                        {/* Image */}
                        <Link to={`/product/${item._id}`} onClick={closeCart} className="flex-shrink-0 w-20 h-24 bg-grey-light rounded-xl overflow-hidden block">
                          <img
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </Link>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                          <div>
                            <p className="text-[10px] font-bold tracking-widest text-grey-dark uppercase mb-0.5">{item.category}</p>
                            <Link to={`/product/${item._id}`} onClick={closeCart}>
                              <h4 className="text-sm font-semibold text-charcoal leading-snug line-clamp-2 hover:text-blue transition-colors">{item.name}</h4>
                            </Link>
                          </div>

                          <div className="flex items-center justify-between mt-2.5">
                            <p className="font-display text-base font-semibold text-green">
                              {formatPrice(item.price)}
                            </p>

                            {/* Qty Controls */}
                            <div className="flex items-center border border-grey rounded-xl overflow-hidden bg-surface">
                              <button
                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center text-charcoal/60 hover:text-charcoal hover:bg-grey-light transition-colors text-lg leading-none focus-visible:outline-none"
                                aria-label="Decrease quantity"
                              >−</button>
                              <span className="w-8 text-center text-sm font-bold text-charcoal">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item._id, Math.min(item.stock || 10, item.quantity + 1))}
                                className="w-8 h-8 flex items-center justify-center text-charcoal/60 hover:text-charcoal hover:bg-grey-light transition-colors text-base leading-none focus-visible:outline-none"
                                aria-label="Increase quantity"
                              >+</button>
                            </div>
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="self-start p-1.5 rounded-lg text-grey-dark hover:text-error hover:bg-error/10 transition-all flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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
              <div className="border-t border-grey bg-white px-6 py-5 flex-shrink-0">
                {/* Total */}
                <div className="flex items-end justify-between mb-5">
                  <div>
                    <p className="text-xs font-bold tracking-widest text-grey-dark uppercase">Subtotal</p>
                    <p className="text-[11px] text-grey-dark mt-0.5">Shipping & taxes at checkout</p>
                  </div>
                  <p className="font-display text-2xl font-semibold text-charcoal">
                    {formatPrice(total)}
                  </p>
                </div>

                {/* CTAs */}
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  id="cart-drawer-checkout"
                  className="btn-secondary w-full py-4 text-sm tracking-wide flex justify-center items-center gap-2"
                >
                  Proceed to Checkout
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                  </svg>
                </Link>
                <div className="flex items-center justify-between mt-3">
                  <Link to="/cart" onClick={closeCart} className="text-xs text-grey-dark hover:text-charcoal transition-colors underline underline-offset-2">
                    View full cart
                  </Link>
                  <div className="flex items-center gap-1.5 text-xs text-grey-dark">
                    <svg className="w-3.5 h-3.5 text-green" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
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
