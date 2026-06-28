import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import SEO from '../components/SEO';
import toast from 'react-hot-toast';
import EmptyState from '../components/EmptyState';
const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const subtotal = getTotalPrice();
  const shipping = subtotal > 999 ? 0 : 99;
  const discount = appliedCoupon ? Math.round(subtotal * 0.1) : 0; // 10% dummy discount
  const grandTotal = subtotal + shipping - discount;
  const freeShippingThreshold = 999;
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);
  const progressPct = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleRemove = (item) => {
    removeFromCart(item._id);
    toast.success(`${item.name} removed`, {
      style: { background: '#03110D', color: '#FDFCF8', borderRadius: '12px' },
    });
  };

  const applyCoupon = () => {
    if (!coupon.trim()) return;
    setCouponLoading(true);
    setTimeout(() => {
      setAppliedCoupon(true);
      setCouponLoading(false);
      toast.success('Coupon applied successfully', {
        style: { background: '#03110D', color: '#FDFCF8', borderRadius: '12px' },
      });
    }, 600);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-surface" id="main-content">
        <SEO title="Your Bag" />
        <EmptyState 
          title="Your bag is empty."
          description="Looks like you haven't added anything yet. Discover our curated collection of premium products and find something you'll love."
          actionLabel="Explore Collection"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-32 bg-surface" id="main-content">
      <SEO title="Your Bag" />
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="flex items-end justify-between mb-16 border-b border-border/60 pb-8">
          <div>
            <h1 className="font-heading text-5xl font-extrabold text-primary tracking-tight">Shopping Bag</h1>
            <p className="text-[13px] text-primary/50 font-medium tracking-wide mt-4 uppercase">
              {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'} in your bag
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 lg:gap-20 items-start">
          
          {/* ── Cart Items List (Left Column) ─────────────────────────── */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-8">
            <AnimatePresence initial={false}>
              {cartItems.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col sm:flex-row gap-8 pb-8 border-b border-border/40 group relative"
                >
                  {/* Image */}
                  <Link to={`/product/${item._id}`} className="shrink-0 relative">
                    <div className="w-32 h-40 sm:w-40 sm:h-48 rounded-[2rem] overflow-hidden bg-surface-white border border-border shadow-soft group-hover:border-primary/20 transition-colors">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="label-editorial mb-2">{item.category}</p>
                          <Link to={`/product/${item._id}`} className="hover:text-secondary transition-colors">
                            <h3 className="text-xl font-bold text-primary leading-tight line-clamp-2">
                              {item.name}
                            </h3>
                          </Link>
                        </div>
                        <p className="font-heading text-2xl font-extrabold text-primary shrink-0">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-8">
                      {/* Premium Quantity Selector */}
                      <div className="flex items-center border border-border rounded-2xl bg-surface-white shadow-soft h-[52px]">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="w-12 h-full flex items-center justify-center text-xl text-primary/40 hover:text-primary transition-colors focus:outline-none"
                          aria-label="Decrease quantity"
                        >−</button>
                        <div className="w-8 text-center overflow-hidden">
                          <AnimatePresence mode="popLayout">
                            <motion.span
                              key={item.quantity}
                              initial={{ y: -15, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: 15, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="text-[15px] font-bold text-primary inline-block"
                            >
                              {item.quantity}
                            </motion.span>
                          </AnimatePresence>
                        </div>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="w-12 h-full flex items-center justify-center text-xl text-primary/40 hover:text-primary transition-colors focus:outline-none"
                          aria-label="Increase quantity"
                        >+</button>
                      </div>

                      {/* Premium Remove Button */}
                      <button
                        onClick={() => handleRemove(item)}
                        className="group/remove flex items-center gap-2 px-3 py-2 text-primary/40 hover:text-error transition-colors"
                        aria-label="Remove item"
                      >
                        <span className="text-[11px] font-bold uppercase tracking-widest opacity-0 group-hover/remove:opacity-100 transition-opacity -translate-x-2 group-hover/remove:translate-x-0">Remove</span>
                        <svg className="w-5 h-5 transition-transform group-hover/remove:scale-110" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* ── Order Summary (Right Column) ──────────────────────── */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="card-premium p-8 lg:p-10 sticky top-32 !rounded-[2.5rem]">
              <h2 className="font-heading text-2xl font-bold text-primary mb-8">Summary</h2>

              {/* Free Shipping Progress */}
              <div className="mb-8 p-5 bg-surface rounded-2xl border border-border/60">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[12px] font-bold text-primary uppercase tracking-wide">
                    {remainingForFree > 0 ? `Away from free shipping` : `Complimentary Shipping`}
                  </p>
                  <span className="text-[10px] font-bold text-secondary">{Math.round(progressPct)}%</span>
                </div>
                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
                {remainingForFree > 0 && (
                  <p className="text-[11px] text-primary/60 mt-3 font-medium">
                    Add <span className="font-bold text-primary">{formatPrice(remainingForFree)}</span> to your bag to unlock complimentary shipping.
                  </p>
                )}
              </div>

              {/* Promo Code */}
              <div className="mb-8">
                <label className="text-[11px] font-bold uppercase tracking-widest text-primary/60 mb-3 block">Promo Code</label>
                {!appliedCoupon ? (
                  <div className="flex border border-border rounded-2xl overflow-hidden focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 transition-all bg-surface-white">
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="Enter code"
                      className="w-full bg-transparent px-4 py-4 text-[13px] text-primary font-medium focus:outline-none placeholder:text-primary/30 uppercase"
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={couponLoading || !coupon.trim()}
                      className="px-6 text-[11px] font-bold uppercase tracking-widest text-primary hover:bg-surface transition-colors disabled:opacity-50"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-success/5 border border-success/20 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      <span className="text-[12px] font-bold text-success tracking-widest uppercase">{coupon} APPLIED</span>
                    </div>
                    <button onClick={() => { setAppliedCoupon(false); setCoupon(''); }} className="text-primary/40 hover:text-error transition-colors" aria-label="Remove coupon">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-[14px]">
                  <span className="text-primary/70 font-medium">Subtotal</span>
                  <span className="font-semibold text-primary">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[14px]">
                  <span className="text-primary/70 font-medium">Shipping</span>
                  <span className={shipping === 0 ? 'text-success font-bold tracking-wide' : 'font-semibold text-primary'}>
                    {shipping === 0 ? 'COMPLIMENTARY' : formatPrice(shipping)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[14px] text-success">
                    <span className="font-semibold">Savings</span>
                    <span className="font-bold">−{formatPrice(discount)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="font-bold text-primary/70 uppercase tracking-widest text-[11px] block mb-1">Total</span>
                    <span className="text-[10px] text-primary/40 font-medium tracking-wide">Inclusive of taxes</span>
                  </div>
                  <span className="font-heading text-4xl font-extrabold text-primary">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="btn-primary w-full py-5 text-[12px] tracking-[0.2em] shadow-card flex items-center justify-center gap-3 group"
              >
                Checkout Securely
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
