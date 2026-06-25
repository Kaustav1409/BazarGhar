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
      style: { background: '#1E1E1E', color: '#fff', borderRadius: '12px' },
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-16 lg:pt-20 flex items-center justify-center" id="main-content">
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
            className="relative w-28 h-28 mx-auto mb-8"
          >
            <div className="w-28 h-28 bg-surface rounded-full border-2 border-dashed border-grey flex items-center justify-center">
              <svg className="w-12 h-12 text-grey-dark" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue/30 rounded-full" aria-hidden="true" />
            <div className="absolute -bottom-1 -left-3 w-3.5 h-3.5 bg-charcoal/10 rounded-full" aria-hidden="true" />
          </motion.div>
          <h1 className="font-display text-3xl font-semibold text-charcoal mb-3">Your cart is empty</h1>
          <p className="text-sm text-grey-dark mb-8 leading-relaxed">
            Looks like you haven't added anything yet. Discover our curated collection of premium products.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/products" className="btn-primary" id="empty-cart-shop-btn">Start Shopping</Link>
            <Link to="/#categories" className="btn-outline">Browse Categories</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 lg:pt-20 pb-24 bg-surface" id="main-content">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="section-subheading mb-2">Your Selection</p>
            <h1 className="section-heading">Shopping Cart</h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-grey-dark hover:text-error transition-colors duration-200 underline underline-offset-2 font-medium"
            id="clear-cart-btn"
          >
            Clear all ({cartItems.length})
          </button>
        </div>

        {/* Free shipping progress */}
        <div className="bg-white rounded-2xl border border-grey p-4 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-charcoal/80">
              {remainingForFree > 0 ? (
                <>Add <span className="font-bold text-charcoal">{formatPrice(remainingForFree)}</span> more to unlock free shipping</>
              ) : (
                <span className="text-green font-semibold">🎉 You've unlocked free shipping!</span>
              )}
            </p>
            <span className="text-xs font-bold text-blue">{Math.round(progressPct)}%</span>
          </div>
          <div className="w-full h-2 bg-grey rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue to-blue-hover rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Cart Items ─────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence initial={false}>
              {cartItems.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
                  transition={{ duration: 0.35 }}
                  className="bg-white rounded-2xl border border-grey p-5 shadow-sm flex gap-5 items-center"
                  id={`cart-item-${item._id}`}
                >
                  {/* Image */}
                  <Link to={`/product/${item._id}`} className="flex-shrink-0 block" aria-label={`View ${item.name}`}>
                    <div className="w-24 h-28 rounded-2xl overflow-hidden bg-surface">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'; }}
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold tracking-widest text-grey-dark uppercase mb-1">{item.category}</p>
                    <Link to={`/product/${item._id}`}>
                      <h3 className="text-sm font-bold text-charcoal leading-snug line-clamp-2 hover:text-blue transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="font-display text-xl font-semibold text-green mt-2.5">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Qty + Remove */}
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <div className="flex items-center border border-grey rounded-xl overflow-hidden bg-surface" role="group" aria-label={`Quantity for ${item.name}`}>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center text-charcoal/60 hover:text-charcoal hover:bg-white transition-all text-lg focus-visible:outline-none"
                        id={`qty-dec-${item._id}`}
                        aria-label="Decrease quantity"
                      >−</button>
                      <span className="w-8 text-center text-sm font-bold text-charcoal" aria-live="polite">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center text-charcoal/60 hover:text-charcoal hover:bg-white transition-all text-base focus-visible:outline-none"
                        id={`qty-inc-${item._id}`}
                        aria-label="Increase quantity"
                      >+</button>
                    </div>
                    <button
                      onClick={() => handleRemove(item)}
                      className="text-xs text-grey-dark hover:text-error transition-colors flex items-center gap-1.5 font-medium"
                      id={`remove-${item._id}`}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                      Remove
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* ── Order Summary ──────────────────────── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-grey p-6 shadow-sm sticky top-28">
              <h2 className="font-semibold text-charcoal text-lg mb-6">Order Summary</h2>

              <div className="space-y-3 mb-5">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between items-center text-sm">
                    <span className="text-charcoal/80 truncate max-w-[160px] pr-2">
                      {item.name} <span className="text-grey-dark font-medium">×{item.quantity}</span>
                    </span>
                    <span className="font-semibold text-charcoal shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon field */}
              <div className="border-t border-grey pt-4 mb-4">
                <p className="text-xs font-bold text-grey-dark uppercase tracking-wide mb-2.5">Have a coupon?</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="input-field py-2.5 text-xs flex-1"
                    id="coupon-input"
                    aria-label="Coupon code"
                  />
                  <button className="btn-outline text-xs py-2.5 px-4" id="apply-coupon-btn" aria-label="Apply coupon code">Apply</button>
                </div>
              </div>

              <div className="border-t border-grey pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal/80">Subtotal</span>
                  <span className="font-semibold">{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal/80">Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-green font-bold">Free 🎉</span>
                  ) : (
                    <span className="font-semibold">{formatPrice(shipping)}</span>
                  )}
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-blue font-medium">
                    Add {formatPrice(remainingForFree)} more for free delivery
                  </p>
                )}
              </div>

              <div className="border-t border-grey mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-charcoal text-lg">Total</span>
                  <span className="font-display text-2xl font-semibold text-charcoal">{formatPrice(grandTotal)}</span>
                </div>
                <p className="text-[11px] text-grey-dark mt-1">Including all taxes</p>
              </div>

              <Link
                to="/checkout"
                id="proceed-checkout-btn"
                className="btn-secondary w-full text-center mt-6 py-4 text-sm font-bold flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </Link>
              <Link
                to="/products"
                className="block text-center mt-3 text-xs text-grey-dark hover:text-blue transition-colors font-medium"
              >
                ← Continue Shopping
              </Link>

              {/* Trust signals */}
              <div className="mt-5 pt-4 border-t border-grey flex items-center justify-center gap-1.5 text-xs text-grey-dark">
                <svg className="w-3.5 h-3.5 text-green" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                Secure 256-bit SSL checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
