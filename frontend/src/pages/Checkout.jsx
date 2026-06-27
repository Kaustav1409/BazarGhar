import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';

const inputClass = 'input-field';

const Confetti = () => {
  const colors = ['#A38560', '#03110D', '#8C2B32', '#E0E0E0', '#FDFCF8'];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2.5 h-2.5 rounded-sm"
          style={{
            background: colors[i % colors.length],
            left: `${5 + (i * 3.8) % 90}%`,
            top: '-10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          animate={{
            y: [0, Math.random() * 500 + 300],
            x: [(Math.random() - 0.5) * 100],
            rotate: [0, Math.random() * 720],
            opacity: [1, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 1.5,
            delay: Math.random() * 0.8,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
};

const PAYMENT_METHODS = [
  { id: 'Cash on Delivery', icon: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z', desc: 'Pay securely upon delivery' },
  { id: 'UPI', icon: 'M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3', desc: 'Google Pay, PhonePe, Paytm' },
  { id: 'Credit Card', icon: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z', desc: 'Visa, MasterCard, Amex' },
  { id: 'Net Banking', icon: 'M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z', desc: 'All major banks supported' },
];

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '', address: '', city: '', state: '', pincode: '', phone: '', deliveryInstructions: ''
  });
  const [errors, setErrors] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);
  
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const COUPONS = {
    WELCOME10: { type: 'percent', value: 10, label: '10% Off', description: '10% off on your first order' },
    SAVE20:    { type: 'percent', value: 20, label: '20% Off', description: '20% off sitewide' },
    FREESHIP:  { type: 'shipping', value: 0, label: 'Free Shipping', description: 'Free shipping on this order' },
  };

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    setCouponError('');
    if (!code) { setCouponError('Please enter a coupon code'); return; }
    setCouponLoading(true);
    setTimeout(() => {
      if (COUPONS[code]) {
        setAppliedCoupon({ code, ...COUPONS[code] });
        setCouponLoading(false);
        toast.success(`Coupon ${code} applied! ${COUPONS[code].description}`, {
          style: { background: '#03110D', color: '#FDFCF8', borderRadius: '12px' },
        });
      } else {
        setCouponError('Invalid coupon code. Try WELCOME10, SAVE20, or FREESHIP');
        setCouponLoading(false);
      }
    }, 500);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCoupon('');
    setCouponError('');
  };

  const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  const subtotal = getTotalPrice();
  let shippingPrice = subtotal > 999 ? 0 : 99;
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discount = Math.round(subtotal * appliedCoupon.value / 100);
    } else if (appliedCoupon.type === 'shipping') {
      shippingPrice = 0;
    }
  }
  const taxPrice = subtotal * 0.18;
  const grandTotal = subtotal + shippingPrice + taxPrice - discount;

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
    if (paymentMethod !== 'Cash on Delivery') {
      setShowDemoModal(true);
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        products: cartItems.map((item) => ({ productId: item._id, quantity: item.quantity })),
        shippingAddress: {
          fullName: form.fullName, address: form.address, city: form.city, state: form.state, pincode: form.pincode, phone: form.phone
        },
        deliveryInstructions: form.deliveryInstructions,
        paymentMethod,
        shippingPrice,
        taxPrice,
        discount
      };
      const { data } = await orderAPI.create(orderData);
      setOrder(data);
      clearCart();
      setStep(3);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order. Please try again.', {
        style: { background: '#03110D', color: '#FDFCF8', borderRadius: '12px' },
      });
    } finally {
      setLoading(false);
    }
  };

  const STEPS = [
    { label: 'Shipping', icon: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z' },
    { label: 'Payment', icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Done', icon: 'M15.59 14.37a6 6 0 01-5.84 7.38' },
  ];

  const renderField = (name, label, placeholder, type = 'text', full = false) => (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label htmlFor={`checkout-${name}`} className="block text-[10px] font-bold text-primary/70 tracking-[0.2em] uppercase mb-2">
        {label}
      </label>
      <input
        id={`checkout-${name}`}
        type={type}
        value={form[name]}
        onChange={(e) => { setForm({ ...form, [name]: e.target.value }); if (errors[name]) setErrors({ ...errors, [name]: '' }); }}
        placeholder={placeholder}
        className={`${inputClass} ${errors[name] ? 'border-error focus:ring-error/20' : ''}`}
      />
      <AnimatePresence>
        {errors[name] && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="flex items-center gap-1.5 text-[11px] text-error mt-2 font-bold tracking-wide">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
            {errors[name]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );

  if (cartItems.length === 0 && step !== 3) {
    return (
      <div className="min-h-screen pt-24 lg:pt-32 flex items-center justify-center bg-surface">
        <div className="text-center px-6">
          <h2 className="font-heading text-4xl font-bold text-primary mb-4">Your cart is empty</h2>
          <p className="text-primary/70 text-[15px] font-medium mb-8">Add some premium products before checking out.</p>
          <Link to="/products" className="btn-primary">Shop Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 lg:pt-40 pb-32 bg-surface" id="main-content">
      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-10 relative">

        {/* Demo Payment Modal */}
        <AnimatePresence>
          {showDemoModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-surface-white rounded-[2rem] border border-border shadow-2xl p-8 max-w-md w-full relative overflow-hidden">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-8 h-8 text-secondary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h3 className="font-heading text-2xl font-bold text-primary mb-3 text-center">Payment Unavailable</h3>
                <p className="text-[15px] text-primary/70 text-center mb-8 font-medium leading-relaxed">
                  Online payment gateway integration is currently unavailable in this demo version. Please use <span className="font-bold text-primary">Cash on Delivery</span> to continue.
                </p>
                <div className="flex flex-col gap-3">
                  <button onClick={() => { setPaymentMethod('Cash on Delivery'); setShowDemoModal(false); }} className="btn-primary w-full justify-center">Switch to COD</button>
                  <button onClick={() => setShowDemoModal(false)} className="btn-secondary w-full justify-center bg-surface border border-border text-primary hover:border-secondary hover:text-secondary">Cancel</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {step < 3 && (
          <div className="flex items-center gap-0 mb-14">
            {STEPS.map(({ label, icon }, i) => {
              const n = i + 1;
              const active = step === n;
              const done = step > n;
              return (
                <React.Fragment key={label}>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border ${done ? 'bg-brand border-brand text-surface-white' : active ? 'bg-primary border-primary text-surface-white' : 'bg-surface-white border-border text-primary/40'}`}>
                      {done ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg> : <span className="text-xs font-bold">{n}</span>}
                    </div>
                    <span className={`text-[11px] uppercase tracking-widest font-bold hidden sm:block ${active ? 'text-primary' : done ? 'text-brand' : 'text-primary/40'}`}>{label}</span>
                  </div>
                  {i < 2 && <div className={`flex-1 mx-4 h-[1px] rounded-full transition-all duration-700 ${step > n ? 'bg-brand' : 'bg-border'}`} />}
                </React.Fragment>
              );
            })}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }} className="grid lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2">
                <div className="bg-surface-white rounded-[2rem] border border-border p-8 lg:p-10 shadow-soft">
                  <h2 className="font-heading text-2xl font-bold text-primary mb-8">Shipping Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {renderField('fullName', 'Full Name', 'John Doe', 'text', true)}
                    {renderField('phone', 'Phone Number', '9876543210', 'tel')}
                    {renderField('pincode', 'Pincode', '400001')}
                    {renderField('address', 'Street Address', '123 Luxury Avenue', 'text', true)}
                    {renderField('city', 'City', 'Mumbai')}
                    {renderField('state', 'State', 'Maharashtra')}
                    <div className="sm:col-span-2">
                      <label htmlFor="checkout-deliveryInstructions" className="block text-[10px] font-bold text-primary/70 tracking-[0.2em] uppercase mb-2">Delivery Instructions (Optional)</label>
                      <textarea id="checkout-deliveryInstructions" value={form.deliveryInstructions} onChange={(e) => setForm({ ...form, deliveryInstructions: e.target.value })} placeholder="e.g. Leave at the front door" className={inputClass} rows={2} />
                    </div>
                  </div>
                  <button onClick={handleContinue} className="btn-primary w-full mt-10 py-5 text-[13px] tracking-[0.2em] uppercase flex justify-center items-center gap-3">
                    Continue to Payment
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  </button>
                </div>
              </div>
              <OrderSidebar cartItems={cartItems} formatPrice={formatPrice} subtotal={subtotal} shipping={shippingPrice} tax={taxPrice} discount={discount} total={grandTotal} coupon={coupon} setCoupon={setCoupon} />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }} className="grid lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-6">
                
                {/* Delivery Summary */}
                <div className="bg-surface-white rounded-[2rem] border border-border p-8 shadow-soft">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-primary flex items-center gap-3 text-lg">
                      <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                      Delivery To
                    </h3>
                    <button onClick={() => setStep(1)} className="text-[10px] uppercase tracking-widest font-bold text-secondary hover:text-brand transition-colors">Edit</button>
                  </div>
                  <div className="bg-surface rounded-xl p-5 text-sm text-primary/70 leading-relaxed border border-border font-medium">
                    <span className="font-bold text-primary text-base block mb-1.5">{form.fullName}</span>
                    {form.address},<br />
                    {form.city}, {form.state} — {form.pincode}<br />
                    <span className="flex items-center gap-2 mt-3 text-primary/60 text-[13px]">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                      {form.phone}
                    </span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-surface-white rounded-[2rem] border border-border p-8 shadow-soft">
                  <h3 className="font-semibold text-primary mb-6 flex items-center gap-3 text-lg">
                    <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>
                    Payment Method
                  </h3>
                  <div className="space-y-3">
                    {PAYMENT_METHODS.map((method) => {
                      const active = paymentMethod === method.id;
                      return (
                        <div
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all cursor-pointer ${active ? 'border-primary bg-primary/5' : 'border-border bg-surface hover:border-primary/30'}`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${active ? 'border-primary' : 'border-primary/20'}`}>
                            {active && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                          </div>
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${active ? 'bg-primary text-surface-white' : 'bg-surface-white text-primary'}`}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d={method.icon} /></svg>
                          </div>
                          <div>
                            <p className={`text-[14px] font-bold tracking-wide ${active ? 'text-primary' : 'text-primary/70'}`}>{method.id}</p>
                            <p className="text-[12px] text-primary/50 font-medium mt-0.5">{method.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <motion.button onClick={handlePlaceOrder} disabled={loading} whileTap={!loading ? { scale: 0.98 } : {}} className={`btn-primary w-full py-5 text-[13px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                  {loading ? (
                    <span className="flex items-center gap-3">
                      <motion.div className="w-4 h-4 border-2 border-surface-white/30 border-t-surface-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                      Processing...
                    </span>
                  ) : (
                    <>
                      Place Order — {formatPrice(grandTotal)}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                    </>
                  )}
                </motion.button>
              </div>
              <OrderSidebar
                cartItems={cartItems}
                formatPrice={formatPrice}
                subtotal={subtotal}
                shipping={shippingPrice}
                tax={taxPrice}
                discount={discount}
                total={grandTotal}
                coupon={coupon}
                setCoupon={setCoupon}
                appliedCoupon={appliedCoupon}
                applyCoupon={applyCoupon}
                removeCoupon={removeCoupon}
                couponError={couponError}
                couponLoading={couponLoading}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="max-w-2xl mx-auto text-center py-16 relative">
              {showConfetti && <Confetti />}

              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2, stiffness: 200, damping: 20 }} className="relative w-28 h-28 mx-auto mb-10">
                <div className="w-28 h-28 bg-surface-white border border-border shadow-soft rounded-full flex items-center justify-center relative z-10">
                  <svg className="w-12 h-12 text-brand" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                </div>
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1.3, opacity: 0 }} transition={{ duration: 1, delay: 0.4, repeat: 1 }} className="absolute inset-0 rounded-full border border-secondary/50" />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <h2 className="font-heading text-4xl font-bold text-primary mb-4">Order Successful!</h2>
                <p className="text-primary/70 text-[15px] font-medium mb-6 leading-relaxed">
                  Thank you for shopping with BazarGhar. Your premium items will be shipped soon.
                </p>
                
                {order && (
                  <div className="bg-surface-white border border-border rounded-2xl p-6 mb-10 max-w-sm mx-auto shadow-sm text-left">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-border/50">
                      <div>
                        <p className="text-[10px] font-bold text-primary/50 uppercase tracking-[0.2em] mb-1">Order ID</p>
                        <p className="font-mono text-sm font-bold text-primary">#{order._id.slice(-8).toUpperCase()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-primary/50 uppercase tracking-[0.2em] mb-1">Method</p>
                        <p className="text-sm font-bold text-primary">{order.paymentMethod}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-primary/50 uppercase tracking-[0.2em] mb-1.5">Estimated Delivery</p>
                      <p className="text-[15px] font-bold text-secondary">
                        {new Date(Date.now() + 5 * 86400000).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to={`/order/${order?._id}`} className="btn-primary">View Order Details</Link>
                  <Link to="/products" className="btn-secondary border border-border bg-surface-white text-primary hover:border-secondary hover:text-secondary">Continue Shopping</Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const OrderSidebar = ({ cartItems, formatPrice, subtotal, shipping, tax, discount, total, coupon, setCoupon, appliedCoupon, applyCoupon, removeCoupon, couponError, couponLoading }) => (
  <div className="bg-surface-white rounded-[2rem] border border-border p-8 shadow-soft h-fit sticky top-32">
    <h3 className="font-heading font-bold text-primary mb-6 flex items-center gap-3 text-[17px]">
      <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg>
      Order Summary
    </h3>
    <div className="space-y-4 mb-6">
      {cartItems.map((item) => (
        <div key={item._id} className="flex gap-4 items-center">
          <img src={item.image} alt={item.name} loading="lazy" className="w-12 h-16 object-cover rounded-xl bg-surface border border-border flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-primary/80 line-clamp-1 font-semibold">{item.name}</p>
            <p className="text-[10px] text-secondary font-bold mt-0.5">×{item.quantity}</p>
          </div>
          <span className="text-[13px] font-bold text-primary shrink-0">{formatPrice(item.price * item.quantity)}</span>
        </div>
      ))}
    </div>

    {/* Coupon Section */}
    <div className="mb-6 pt-6 border-t border-border">
      <p className="text-[10px] font-bold text-primary/50 uppercase tracking-[0.2em] mb-3">Apply Coupon</p>
      {appliedCoupon ? (
        <div className="flex items-center justify-between px-4 py-3 bg-success/5 border border-success/20 rounded-xl">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            <div>
              <p className="text-[12px] font-bold text-success">{appliedCoupon.code}</p>
              <p className="text-[10px] text-primary/50 font-medium">{appliedCoupon.description}</p>
            </div>
          </div>
          <button onClick={removeCoupon} className="text-primary/40 hover:text-error transition-colors ml-2" aria-label="Remove coupon">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      ) : (
        <>
          <div className="flex gap-2">
            <input
              type="text"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
              placeholder="e.g. WELCOME10"
              className={`input-field flex-1 !py-3 text-[13px] ${couponError ? 'border-error focus:ring-error/20' : ''}`}
            />
            <button
              onClick={applyCoupon}
              disabled={couponLoading}
              className="btn-secondary !py-3 px-5 text-[11px] border-border bg-surface hover:border-secondary hover:text-secondary"
            >
              {couponLoading ? '...' : 'Apply'}
            </button>
          </div>
          {couponError && (
            <p className="text-[11px] text-error font-bold mt-2 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
              {couponError}
            </p>
          )}
          <p className="text-[10px] text-primary/30 mt-2 font-medium">Try: WELCOME10 · SAVE20 · FREESHIP</p>
        </>
      )}
    </div>

    <div className="border-t border-border pt-5 space-y-3">
      <div className="flex justify-between text-[13px]">
        <span className="text-primary/70 font-medium">Subtotal</span>
        <span className="font-semibold text-primary">{formatPrice(subtotal)}</span>
      </div>
      <div className="flex justify-between text-[13px]">
        <span className="text-primary/70 font-medium">Tax (18% GST)</span>
        <span className="font-semibold text-primary">{formatPrice(tax)}</span>
      </div>
      <div className="flex justify-between text-[13px]">
        <span className="text-primary/70 font-medium">Shipping</span>
        <span className={shipping === 0 ? 'text-success font-bold' : 'font-semibold text-primary'}>
          {shipping === 0 ? 'Free' : formatPrice(shipping)}
        </span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-[13px] text-success">
          <span className="font-semibold">Coupon Discount</span>
          <span className="font-bold">−{formatPrice(discount)}</span>
        </div>
      )}
      <div className="flex justify-between items-center text-primary border-t border-border pt-4 mt-2">
        <span className="font-bold text-[11px] uppercase tracking-widest text-primary/70">Grand Total</span>
        <span className="font-heading text-2xl font-extrabold">{formatPrice(total)}</span>
      </div>
    </div>
  </div>
);

export default Checkout;
