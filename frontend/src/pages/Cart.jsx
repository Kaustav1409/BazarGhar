import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const shipping = getTotalPrice() > 999 ? 0 : 99;
  const grandTotal = getTotalPrice() + shipping;
  const freeShippingThreshold = 999;
  const remainingForFree = Math.max(0, freeShippingThreshold - getTotalPrice());
  const progressPct = Math.min(100, (getTotalPrice() / freeShippingThreshold) * 100);

  const handleRemove = (item) => {
    removeFromCart(item._id);
    toast.success(`${item.name} removed from cart`, {
      style: { background: '#2A1B16', color: '#FDFCF8', borderRadius: '12px' },
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-24 lg:pt-32 flex items-center justify-center bg-surface" id="main-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-sm px-6"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="relative w-32 h-32 mx-auto mb-10"
          >
            <div className="w-32 h-32 bg-surface-white rounded-full border border-border shadow-soft flex items-center justify-center relative z-10">
              <svg className="w-12 h-12 text-secondary" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-brand/20 rounded-full" aria-hidden="true" />
            <div className="absolute -bottom-2 -left-4 w-4 h-4 bg-secondary/20 rounded-full" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
          </motion.div>
          <h1 className="font-heading text-4xl font-bold text-primary mb-4">Your cart is empty</h1>
          <p className="text-[15px] text-primary/70 mb-10 leading-relaxed font-medium">
            Looks like you haven't added anything yet. Discover our curated collection of premium products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="btn-primary" id="empty-cart-shop-btn">Start Shopping</Link>
            <Link to="/#categories" className="btn-secondary border border-border bg-surface-white text-primary hover:border-secondary hover:text-secondary">Browse Categories</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 lg:pt-40 pb-32 bg-surface" id="main-content">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10">

        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="section-subheading mb-3">Your Selection</p>
            <h1 className="section-heading">Shopping Cart</h1>
          </div>
          <button
            onClick={clearCart}
            className="text-[11px] uppercase tracking-widest text-primary/50 hover:text-error transition-colors duration-200 font-bold"
            id="clear-cart-btn"
          >
            Clear all ({cartItems.length})
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-10 lg:gap-16">
          {/* ── Cart Items ─────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Free shipping progress inside items col for better layout */}
            <div className="bg-surface-white rounded-[2rem] border border-border p-8 shadow-soft mb-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-surface to-transparent opacity-50 pointer-events-none" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-primary/80">
                    {remainingForFree > 0 ? (
                      <>Add <span className="font-bold text-primary">{formatPrice(remainingForFree)}</span> more to unlock free shipping</>
                    ) : (
                      <span className="text-brand font-semibold">🎉 You've unlocked free shipping!</span>
                    )}
                  </p>
                  <span className="text-[11px] font-bold text-secondary uppercase tracking-widest">{Math.round(progressPct)}%</span>
                </div>
                <div className="w-full h-1.5 bg-surface-secondary rounded-full overflow-hidden shadow-inner-soft">
                  <motion.div
                    className="h-full bg-gradient-to-r from-secondary to-brand rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {cartItems.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-surface-white rounded-[2rem] border border-border p-6 lg:p-8 shadow-soft flex gap-6 items-center group relative overflow-hidden hover:shadow-card hover:border-secondary/30 transition-all duration-500"
                  id={`cart-item-${item._id}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-surface/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Image */}
                  <Link to={`/product/${item._id}`} className="flex-shrink-0 block relative z-10" aria-label={`View ${item.name}`}>
                    <div className="w-28 h-36 rounded-[1.5rem] overflow-hidden bg-surface border border-secondary/10">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-[1.15] transition-transform duration-700 ease-[0.25,1,0.25,1]"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'; }}
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0 relative z-10 py-2">
                    <p className="text-[10px] font-bold tracking-[0.2em] text-secondary uppercase mb-2">{item.category}</p>
                    <Link to={`/product/${item._id}`}>
                      <h3 className="text-lg font-bold text-primary leading-snug line-clamp-2 group-hover:text-brand transition-colors mb-4">
                        {item.name}
                      </h3>
                    </Link>
                    
                    <div className="flex items-end justify-between mt-auto">
                      <p className="font-heading text-2xl font-extrabold text-primary">
                        {formatPrice(item.price)}
                      </p>

                      {/* Qty + Remove */}
                      <div className="flex items-center gap-5">
                        <button
                          onClick={() => handleRemove(item)}
                          className="text-[10px] font-bold tracking-widest uppercase text-primary/40 hover:text-error transition-colors flex items-center gap-1.5"
                          id={`remove-${item._id}`}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          Remove
                        </button>
                        
                        <div className="flex items-center border border-border rounded-xl overflow-hidden glass shadow-inner-soft" role="group" aria-label={`Quantity for ${item.name}`}>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="w-10 h-10 flex items-center justify-center text-primary/60 hover:text-brand hover:bg-surface transition-all text-xl focus-visible:outline-none"
                            id={`qty-dec-${item._id}`}
                            aria-label="Decrease quantity"
                          >−</button>
                          <div className="w-8 h-10 flex items-center justify-center overflow-hidden relative">
                            <AnimatePresence mode="popLayout">
                              <motion.span
                                key={item.quantity}
                                initial={{ y: -15, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 15, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="text-sm font-bold text-primary absolute"
                                aria-live="polite"
                              >
                                {item.quantity}
                              </motion.span>
                            </AnimatePresence>
                          </div>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center text-primary/60 hover:text-brand hover:bg-surface transition-all text-lg focus-visible:outline-none"
                            id={`qty-inc-${item._id}`}
                            aria-label="Increase quantity"
                          >+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* ── Order Summary ──────────────────────── */}
          <div className="lg:col-span-1">
            <div className="bg-surface-white rounded-[2rem] border border-border p-8 shadow-soft sticky top-32 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-surface/50 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <h2 className="font-heading text-2xl font-bold text-primary mb-8">Order Summary</h2>

                <div className="space-y-4 mb-8">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex justify-between items-center text-[13px]">
                      <span className="text-primary/70 truncate max-w-[160px] pr-2 font-medium">
                        {item.name} <span className="text-secondary font-bold ml-1">×{item.quantity}</span>
                      </span>
                      <span className="font-semibold text-primary shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon field */}
                <div className="border-t border-border pt-6 mb-6">
                  <p className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.2em] mb-3">Have a coupon?</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="flex-1 bg-surface border border-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                      id="coupon-input"
                      aria-label="Coupon code"
                    />
                    <button className="bg-primary text-surface-white rounded-xl px-6 py-3 text-[11px] font-bold tracking-widest uppercase hover:bg-brand transition-colors shadow-sm" id="apply-coupon-btn" aria-label="Apply coupon code">Apply</button>
                  </div>
                </div>

                <div className="border-t border-border pt-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-primary/70 font-medium">Subtotal</span>
                    <span className="font-semibold text-primary">{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-primary/70 font-medium">Shipping</span>
                    {shipping === 0 ? (
                      <span className="text-brand font-bold">Free 🎉</span>
                    ) : (
                      <span className="font-semibold text-primary">{formatPrice(shipping)}</span>
                    )}
                  </div>
                  {shipping > 0 && (
                    <p className="text-[11px] text-secondary font-bold tracking-wide">
                      Add {formatPrice(remainingForFree)} more for free delivery
                    </p>
                  )}
                </div>

                <div className="border-t border-border mt-6 pt-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-primary/70 uppercase tracking-widest text-[11px]">Total</span>
                    <span className="font-heading text-4xl font-extrabold text-primary">{formatPrice(grandTotal)}</span>
                  </div>
                  <p className="text-[10px] text-primary/50 mt-2 font-medium tracking-wide">Including all taxes</p>
                </div>

                <Link
                  to="/checkout"
                  id="proceed-checkout-btn"
                  className="btn-primary w-full text-center mt-8 py-5 text-[13px] tracking-[0.2em] uppercase flex items-center justify-center gap-3"
                >
                  Proceed to Checkout
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                  </svg>
                </Link>
                <Link
                  to="/products"
                  className="block text-center mt-4 text-[11px] font-bold tracking-widest uppercase text-primary/60 hover:text-brand transition-colors"
                >
                  ← Continue Shopping
                </Link>

                {/* Trust signals */}
                <div className="mt-8 pt-6 border-t border-border flex items-center justify-center gap-2 text-[10px] font-bold tracking-widest uppercase text-secondary">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  Secure 256-bit SSL checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
