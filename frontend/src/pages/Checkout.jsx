import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';

const inputClass = 'input-field';

/* ── Confetti Particle ─────────────────────────────── */
const Confetti = () => {
  const colors = ['#2F80ED', '#1E1E1E', '#52C41A', '#BDBDBD', '#6b7280'];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-sm"
          style={{
            background: colors[i % colors.length],
            left: `${5 + (i * 3.8) % 90}%`,
            top: '-10px',
          }}
          animate={{
            y: [0, Math.random() * 300 + 200],
            x: [(Math.random() - 0.5) * 60],
            rotate: [0, Math.random() * 720],
            opacity: [1, 0],
          }}
          transition={{
            duration: 1.5 + Math.random() * 1,
            delay: Math.random() * 0.8,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
};

const Checkout = () => {
  const [step, setStep] = useState(1); // 1: shipping, 2: confirm, 3: success
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '', address: '', city: '', state: '', pincode: '', phone: '',
  });
  const [errors, setErrors] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);

  const formatPrice = (p) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.state.trim()) e.state = 'State is required';
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode)) e.pincode = 'Valid 6-digit pincode required';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone)) e.phone = 'Valid 10-digit phone required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = () => {
    if (validate()) setStep(2);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        products: cartItems.map((item) => ({ productId: item._id, quantity: item.quantity })),
        shippingAddress: form,
      };
      const { data } = await orderAPI.create(orderData);
      setOrderId(data._id);
      clearCart();
      setStep(3);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order. Please try again.', {
        style: { background: '#111827', color: '#fff', borderRadius: '12px' },
      });
    } finally {
      setLoading(false);
    }
  };

  const shipping = getTotalPrice() > 999 ? 0 : 99;

  const STEPS = [
    { label: 'Shipping', icon: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z' },
    { label: 'Confirm', icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Done', icon: 'M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58' },
  ];

  const renderField = (name, label, placeholder, type = 'text') => (
    <div>
      <label htmlFor={`checkout-${name}`} className="block text-xs font-bold text-muted tracking-wide uppercase mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          id={`checkout-${name}`}
          type={type}
          value={form[name]}
          onChange={(e) => { setForm({ ...form, [name]: e.target.value }); if (errors[name]) setErrors({ ...errors, [name]: '' }); }}
          placeholder={placeholder}
          className={`${inputClass} ${errors[name] ? 'border-red-400 focus:ring-red-100' : ''}`}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `${name}-error` : undefined}
        />
      </div>
      <AnimatePresence>
        {errors[name] && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            id={`${name}-error`}
            className="flex items-center gap-1.5 text-xs text-red-500 mt-1.5 font-medium"
            role="alert"
          >
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {errors[name]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );

  if (cartItems.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-surface" id="main-content">
        <div className="text-center px-6">
          <h2 className="font-display text-2xl font-semibold text-charcoal mb-4">Your cart is empty</h2>
          <p className="text-grey-dark text-sm mb-6">Add some products before checking out.</p>
          <Link to="/products" className="btn-secondary">Shop Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 lg:pt-20 pb-24 bg-surface" id="main-content">
      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-10">

        {/* ── Step Indicator ─────────────────────── */}
        {step < 3 && (
          <div className="flex items-center gap-0 mb-12" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={3} aria-label={`Step ${step} of 3`}>
            {STEPS.map(({ label, icon }, i) => {
              const n = i + 1;
              const active = step === n;
              const done = step > n;
              return (
                <React.Fragment key={label}>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                      done
                        ? 'bg-green border-green text-white shadow-sm'
                        : active
                        ? 'bg-charcoal border-charcoal text-white shadow-md'
                        : 'bg-white border-grey text-grey-dark'
                    }`}>
                      {done ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      ) : (
                        <span className="text-xs font-bold">{n}</span>
                      )}
                    </div>
                    <span className={`text-sm font-semibold hidden sm:block transition-colors ${active ? 'text-charcoal' : done ? 'text-green' : 'text-grey-dark'}`}>
                      {label}
                    </span>
                  </div>
                  {i < 2 && (
                    <div className={`flex-1 mx-3 h-0.5 rounded-full transition-all duration-500 ${step > n ? 'bg-green' : 'bg-grey'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ── Step 1: Shipping ─────────────────── */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
              className="grid lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-grey p-8 shadow-sm">
                  <h2 className="font-display text-2xl font-semibold text-charcoal mb-7">Shipping Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">{renderField('fullName', 'Full Name', 'John Doe')}</div>
                    <div className="sm:col-span-2">{renderField('phone', 'Phone Number', '9876543210', 'tel')}</div>
                    <div className="sm:col-span-2">{renderField('address', 'Street Address', '123 MG Road, Apt 4')}</div>
                    {renderField('city', 'City', 'Mumbai')}
                    {renderField('state', 'State', 'Maharashtra')}
                    {renderField('pincode', 'Pincode', '400001')}
                  </div>
                  <button
                    onClick={handleContinue}
                    className="btn-primary w-full mt-8 py-4 text-sm"
                    id="checkout-continue-btn"
                  >
                    Continue to Review
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </div>
              </div>
              <OrderSidebar cartItems={cartItems} formatPrice={formatPrice} shipping={shipping} getTotalPrice={getTotalPrice} />
            </motion.div>
          )}

          {/* ── Step 2: Confirm ───────────────────── */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
              className="grid lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-4">
                {/* Delivery Address */}
                <div className="bg-white rounded-2xl border border-grey p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-charcoal flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      Delivery Address
                    </h3>
                    <button onClick={() => setStep(1)} className="text-xs font-bold text-blue hover:text-blue-hover transition-colors">Edit</button>
                  </div>
                  <div className="bg-surface rounded-xl p-4 text-sm text-charcoal/80 leading-relaxed border border-grey">
                    <span className="font-bold text-charcoal block mb-1">{form.fullName}</span>
                    {form.address},<br />
                    {form.city}, {form.state} — {form.pincode}<br />
                    <span className="flex items-center gap-1.5 mt-2 text-grey-dark">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                      {form.phone}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-2xl border border-grey p-6 shadow-sm">
                  <h3 className="font-semibold text-charcoal mb-5 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                    </svg>
                    Order Items ({cartItems.length})
                  </h3>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item._id} className="flex items-center gap-4 py-2 border-b border-grey last:border-0">
                        <img src={item.image} alt={item.name} loading="lazy" className="w-14 h-14 object-cover rounded-xl bg-grey-light flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-charcoal line-clamp-1">{item.name}</p>
                          <p className="text-xs text-grey-dark mt-0.5">Qty: {item.quantity}</p>
                        </div>
                        <span className="text-sm font-bold text-charcoal shrink-0">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment info */}
                <div className="bg-white rounded-2xl border border-grey p-6 shadow-sm">
                  <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>
                    Payment Method
                  </h3>
                  <div className="flex items-center gap-3 p-3 bg-green/10 border border-green/20 rounded-xl">
                    <div className="w-8 h-8 bg-green rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-green">Cash on Delivery</p>
                      <p className="text-xs text-green/80">Pay when your order arrives</p>
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                  id="place-order-btn"
                  className={`btn-secondary w-full py-4 text-sm font-bold ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  aria-busy={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <motion.div
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        aria-hidden="true"
                      />
                      Placing Order...
                    </span>
                  ) : (
                    `Place Order — ${formatPrice(getTotalPrice() + shipping)}`
                  )}
                </motion.button>
              </div>
              <OrderSidebar cartItems={cartItems} formatPrice={formatPrice} shipping={shipping} getTotalPrice={getTotalPrice} />
            </motion.div>
          )}

          {/* ── Step 3: Success ───────────────────── */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-lg mx-auto text-center py-12 relative"
            >
              {showConfetti && <Confetti />}

              {/* Success icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2, stiffness: 250, damping: 15 }}
                className="relative w-24 h-24 mx-auto mb-8"
              >
                <div className="w-24 h-24 bg-green/10 border-2 border-green/30 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-green" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                {/* Green ring */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 0 }}
                  transition={{ duration: 0.8, delay: 0.3, repeat: 2 }}
                  className="absolute inset-0 rounded-full border-2 border-green/50"
                  aria-hidden="true"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="font-display text-4xl font-semibold text-charcoal mb-3">Order Placed! 🎉</h2>
                <p className="text-grey-dark text-sm mb-2 leading-relaxed">
                  Thank you for shopping with BazarGhar. Your order is confirmed!
                </p>
                {orderId && (
                  <p className="inline-block text-xs text-grey-dark bg-surface border border-grey px-4 py-2 rounded-full mb-3 font-mono">
                    Order #{orderId.slice(-8).toUpperCase()}
                  </p>
                )}
                {/* Estimated delivery */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-8 mt-4">
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-1">Estimated Delivery</p>
                  <p className="text-sm font-semibold text-blue-800">
                    {new Date(Date.now() + 5 * 86400000).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/profile" id="view-orders-btn" className="btn-primary">View My Orders</Link>
                  <Link to="/products" id="continue-shopping-btn" className="btn-outline">Continue Shopping</Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ── Order Sidebar ──────────────────────────────────── */
const OrderSidebar = ({ cartItems, formatPrice, shipping, getTotalPrice }) => (
  <div className="bg-white rounded-2xl border border-grey p-6 shadow-sm h-fit sticky top-28">
    <h3 className="font-semibold text-charcoal mb-5 flex items-center gap-2">
      <svg className="w-4 h-4 text-blue" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
      </svg>
      Order Summary
    </h3>
    <div className="space-y-3 mb-5">
      {cartItems.map((item) => (
        <div key={item._id} className="flex gap-3 items-center">
          <img src={item.image} alt={item.name} loading="lazy" className="w-10 h-12 object-cover rounded-lg bg-grey-light flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-charcoal/80 line-clamp-1 font-medium">{item.name}</p>
            <p className="text-[10px] text-grey-dark">×{item.quantity}</p>
          </div>
          <span className="text-xs font-bold text-charcoal shrink-0">{formatPrice(item.price * item.quantity)}</span>
        </div>
      ))}
    </div>
    <div className="border-t border-grey pt-4 space-y-2.5">
      <div className="flex justify-between text-sm">
        <span className="text-grey-dark">Subtotal</span>
        <span className="font-semibold">{formatPrice(getTotalPrice())}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-grey-dark">Shipping</span>
        <span className={shipping === 0 ? 'text-green font-bold' : 'font-semibold'}>
          {shipping === 0 ? 'Free' : formatPrice(shipping)}
        </span>
      </div>
      <div className="flex justify-between font-bold text-charcoal border-t border-grey pt-3 mt-1 text-base">
        <span>Total</span>
        <span className="font-display text-xl">{formatPrice(getTotalPrice() + shipping)}</span>
      </div>
    </div>
  </div>
);

export default Checkout;
