import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';
import premiumFallback from '../assets/images/premium_fallback.jpg';

const inputClass = 'input-base w-full bg-surface-white focus:bg-surface-secondary transition-colors duration-300';

const PAYMENT_METHODS = [
 { id: 'Cash on Delivery', icon: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z', desc: 'Pay securely upon delivery' },
 { id: 'UPI', icon: 'M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3', desc: 'Google Pay, PhonePe, Paytm' },
 { id: 'Credit Card', icon: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z', desc: 'Visa, MasterCard, Amex' },
];

const Checkout = () => {
 const [step, setStep] = useState(1);
 const [loading, setLoading] = useState(false);
 const [order, setOrder] = useState(null);
 const { cartItems, getTotalPrice, clearCart } = useCart();
 const navigate = useNavigate();

 const [form, setForm] = useState({
 fullName: '', address: '', city: '', state: '', pincode: '', phone: ''
 });
 const [errors, setErrors] = useState({});
 const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
 
 // Dummy Coupon Logic for demo purposes in checkout
 const [coupon] = useState('');
 const [appliedCoupon] = useState(false);

 const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p || 0);

 const subtotal = getTotalPrice();
 const shippingPrice = subtotal > 999 ? 0 : 99;
 const discount = appliedCoupon ? Math.round(subtotal * 0.1) : 0;
 const taxPrice = subtotal * 0.18; // Included in price theoretically, but showing for receipt
 const grandTotal = subtotal + shippingPrice - discount; // Assuming tax is inclusive to match PDP

 const validate = () => {
 const e = {};
 if (!form.fullName.trim()) e.fullName = 'Required';
 if (!form.address.trim()) e.address = 'Required';
 if (!form.city.trim()) e.city = 'Required';
 if (!form.state.trim()) e.state = 'Required';
 if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode)) e.pincode = 'Invalid pin';
 if (!form.phone.trim() || !/^\d{10}$/.test(form.phone)) e.phone = 'Invalid phone';
 setErrors(e);
 return Object.keys(e).length === 0;
 };

 const handleContinue = () => {
 if (validate()) {
 window.scrollTo({ top: 0, behavior: 'smooth' });
 setStep(2);
 }
 };

 const handlePlaceOrder = async () => {
 if (paymentMethod !== 'Cash on Delivery') {
 toast.error('Only Cash on Delivery is available in this demo.', {
 style: { background: '#03110D', color: '#FDFCF8', borderRadius: '12px' },
 });
 return;
 }

 setLoading(true);
 try {
 const orderData = {
 products: cartItems?.map((item) => ({ productId: item._id, quantity: item.quantity })) || [],
 shippingAddress: {
 fullName: form.fullName, address: form.address, city: form.city, state: form.state, pincode: form.pincode, phone: form.phone
 },
 paymentMethod,
 shippingPrice,
 taxPrice: 0, // Simplified to 0 since prices are inclusive
 discount
 };
 
 const { data } = await orderAPI.create(orderData);
 setOrder(data);
 clearCart();
 window.scrollTo({ top: 0, behavior: 'smooth' });
 setStep(3);
 } catch (err) {
 toast.error(err.response?.data?.message || 'Failed to place order.', {
 style: { background: '#03110D', color: '#FDFCF8', borderRadius: '12px' },
 });
 } finally {
 setLoading(false);
 }
 };

 const renderField = (name, label, placeholder, type = 'text', full = false) => (
 <div className={`relative ${full ? 'sm:col-span-2' : ''}`}>
 <label htmlFor={`chk-${name}`} className="text-[10px] font-bold tracking-widest uppercase text-primary/60 mb-2 block ml-1">
 {label}
 </label>
 <input
 id={`chk-${name}`}
 type={type}
 value={form[name]}
 onChange={(e) => { setForm({ ...form, [name]: e.target.value }); if (errors[name]) setErrors({ ...errors, [name]: '' }); }}
 placeholder={placeholder}
 className={`${inputClass} ${errors[name] ? '!border-error !ring-error/20' : ''}`}
 />
 {errors[name] && (
 <span className="absolute top-0 right-1 text-[10px] font-bold text-error tracking-wide uppercase bg-surface px-2">
 {errors[name]}
 </span>
)}
 </div>
);

 if (cartItems.length === 0 && step !== 3) {
 return (
 <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-surface">
 <div className="text-center px-6">
 <h2 className="font-heading text-4xl font-bold text-primary mb-6">Nothing to Checkout</h2>
 <Link to="/products"className="btn-primary">Return to Shop</Link>
 </div>
 </div>
);
 }

 return (
 <div className="min-h-screen pt-32 lg:pt-40 pb-32 bg-surface"id="main-content">
 <SEO title="Checkout"/>
 <div className="max-w-[1280px] mx-auto px-6 lg:px-12">

 {step < 3 && (
 <div className="flex items-center gap-4 mb-16 max-w-2xl mx-auto">
 {['Shipping', 'Payment'].map((label, i) => {
 const n = i + 1;
 const active = step === n;
 const done = step > n;
 return (
 <React.Fragment key={label}>
 <div className={`flex flex-col items-center gap-2 ${active ? 'text-primary' : done ? 'text-primary' : 'text-primary/70'} transition-colors`}>
 <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px] border-2 transition-all ${active ? 'border-primary bg-primary text-surface-white' : done ? 'border-primary text-primary bg-surface-white' : 'border-border bg-surface-white'}`}>
 {done ? <svg className="w-4 h-4"fill="none"viewBox="0 0 24 24"strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round"strokeLinejoin="round"d="M4.5 12.75l6 6 9-13.5"/></svg> : n}
 </div>
 <span className="text-[10px] uppercase tracking-widest font-bold">{label}</span>
 </div>
 {i === 0 && <div className={`flex-1 h-[2px] rounded-full mx-2 ${done ? 'bg-primary' : 'bg-border'} transition-colors duration-500`} />}
 </React.Fragment>
);
 })}
 </div>
)}

 <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
 
 {/* Main Content Area */}
 <div className="lg:col-span-7 xl:col-span-8">
 <AnimatePresence mode="wait">
 
 {/* STEP 1: SHIPPING */}
 {step === 1 && (
 <motion.div key="step1"initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="space-y-10">
 <div className="card-premium p-8 lg:p-12">
 <h2 className="font-heading text-3xl font-bold text-primary mb-8">Shipping Address</h2>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
 {renderField('fullName', 'Full Name', 'e.g. Rahul Sharma', 'text', true)}
 {renderField('phone', 'Phone Number', 'e.g. 9876543210', 'tel')}
 {renderField('pincode', 'Pincode', 'e.g. 400001')}
 {renderField('address', 'Street Address', 'e.g. Flat 101, Luxury Towers', 'text', true)}
 {renderField('city', 'City', 'e.g. Mumbai')}
 {renderField('state', 'State', 'e.g. Maharashtra')}
 </div>
 
 <div className="mt-12 flex justify-end">
 <button onClick={handleContinue} className="btn-primary w-full sm:w-auto px-12 py-5 tracking-[0.2em] text-[12px] flex items-center justify-center gap-3">
 Continue to Payment
 <svg className="w-4 h-4"fill="none"viewBox="0 0 24 24"strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round"strokeLinejoin="round"d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
 </button>
 </div>
 </div>
 </motion.div>
)}

 {/* STEP 2: PAYMENT */}
 {step === 2 && (
 <motion.div key="step2"initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="space-y-10">
 
 {/* Delivery Summary Block */}
 <div className="card-premium p-8 lg:p-10">
 <div className="flex items-center justify-between mb-6">
 <h3 className="font-heading text-2xl font-bold text-primary">Delivery Details</h3>
 <button onClick={() => setStep(1)} className="text-[11px] uppercase tracking-widest font-bold text-primary/70 hover:text-primary transition-colors">Edit</button>
 </div>
 <div className="p-6 bg-surface-white border border-border rounded-3xl text-[14px] text-primary/80 font-medium leading-relaxed">
 <p className="font-bold text-primary text-base mb-2">{form.fullName}</p>
 <p>{form.address}</p>
 <p>{form.city}, {form.state} {form.pincode}</p>
 <p className="mt-3 text-primary/60 flex items-center gap-2">
 <svg className="w-4 h-4"fill="none"viewBox="0 0 24 24"strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round"strokeLinejoin="round"d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
 +91 {form.phone}
 </p>
 </div>
 </div>

 {/* Payment Selection */}
 <div className="card-premium p-8 lg:p-10">
 <h3 className="font-heading text-2xl font-bold text-primary mb-8">Payment Method</h3>
 <div className="space-y-4">
 {PAYMENT_METHODS.map((method) => {
 const active = paymentMethod === method.id;
 return (
 <div
 key={method.id}
 onClick={() => setPaymentMethod(method.id)}
 className={`group relative flex items-center gap-5 p-6 rounded-3xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${active ? 'border-primary bg-primary text-surface-white' : 'border-border bg-surface-white hover:border-primary/30'}`}
 >
 {active && <div className="absolute inset-0 bg-primary opacity-50 pointer-events-none"/>}
 
 <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${active ? 'border-surface-white' : 'border-primary/40 group-hover:border-primary/50'}`}>
 {active && <div className="w-2.5 h-2.5 rounded-full bg-surface-white"/>}
 </div>
 
 <div className="flex flex-col flex-1">
 <p className={`text-[15px] font-bold tracking-wide ${active ? 'text-surface-white' : 'text-primary'}`}>{method.id}</p>
 <p className={`text-[12px] font-medium mt-1 ${active ? 'text-surface-white/70' : 'text-primary/70'}`}>{method.desc}</p>
 </div>

 <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm shrink-0 ${active ? 'bg-surface-white/10 text-surface-white' : 'bg-surface text-primary/60'}`}>
 <svg className="w-6 h-6"fill="none"viewBox="0 0 24 24"strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round"strokeLinejoin="round"d={method.icon} /></svg>
 </div>
 </div>
);
 })}
 </div>
 </div>

 {/* Place Order Action */}
 <div className="pt-6">
 <motion.button 
 onClick={handlePlaceOrder} 
 disabled={loading} 
 whileTap={!loading ? { scale: 0.98 } : {}} 
 className={`btn-primary w-full py-6 text-[13px] uppercase tracking-[0.2em] shadow-card flex items-center justify-center gap-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
 >
 {loading ? (
 <>
 <motion.div className="w-5 h-5 border-2 border-surface-white/30 border-t-surface-white rounded-full"animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
 Processing Security...
 </>
) : (
 <>
 Confirm & Pay {formatPrice(grandTotal)}
 <svg className="w-5 h-5"fill="none"viewBox="0 0 24 24"strokeWidth={2} stroke="currentColor"><path strokeLinecap="round"strokeLinejoin="round"d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>
 </>
)}
 </motion.button>
 </div>
 </motion.div>
)}

 {/* STEP 3: SUCCESS */}
 {step === 3 && (
 <motion.div key="step3"initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease:"easeOut"}} className="w-full text-center py-20 lg:col-span-12">
 <motion.div initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} className="w-24 h-24 mx-auto bg-primary text-surface-white rounded-full flex items-center justify-center shadow-card mb-10">
 <svg className="w-10 h-10"fill="none"viewBox="0 0 24 24"strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round"strokeLinejoin="round"d="M4.5 12.75l6 6 9-13.5"/></svg>
 </motion.div>
 
 <h2 className="font-heading text-5xl font-extrabold text-primary mb-6 tracking-tight">Order Confirmed</h2>
 <p className="text-primary/60 text-[16px] font-medium mb-12 max-w-lg mx-auto leading-relaxed">
 Thank you for choosing BazarGhar. Your luxury items are being carefully prepared for shipment.
 </p>
 
 {order && (
 <div className="card-premium p-8 max-w-md mx-auto text-left mb-12">
 <div className="flex justify-between items-center mb-6 pb-6 border-b border-border/60">
 <div>
 <p className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.2em] mb-2">Order Reference</p>
 <p className="font-mono text-lg font-bold text-primary">#{order?._id?.slice(-8).toUpperCase()}</p>
 </div>
 <div className="text-right">
 <p className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.2em] mb-2">Payment</p>
 <p className="text-[13px] font-bold text-primary uppercase">{order.paymentMethod}</p>
 </div>
 </div>
 <div>
 <p className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.2em] mb-2">Estimated Arrival</p>
 <p className="text-xl font-bold text-primary">
 {new Date(Date.now() + 5 * 86400000).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
 </p>
 </div>
 </div>
)}

 <div className="flex flex-col sm:flex-row gap-4 justify-center">
 <Link to={`/order/${order?._id}`} className="btn-primary px-10 py-4 text-[12px] tracking-[0.15em]">Track Order</Link>
 <Link to="/products"className="btn-outline px-10 py-4 text-[12px] tracking-[0.15em]">Continue Shopping</Link>
 </div>
 </motion.div>
)}
 </AnimatePresence>
 </div>

 {/* Sidebar (Order Summary) - Only show if not on success step */}
 {step < 3 && (
 <div className="lg:col-span-5 xl:col-span-4">
 <div className="card-premium p-8 lg:p-10 sticky top-32">
 <h3 className="font-heading text-2xl font-bold text-primary mb-8">Order Summary</h3>
 
 <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
 {cartItems?.map((item) => (
 <div key={item._id} className="flex gap-4 items-center">
 <div className="w-16 h-20 rounded-2xl overflow-hidden bg-surface-white border border-border shrink-0">
 <img src={item.image || premiumFallback} alt={item.name} className="w-full h-full object-cover"onError={(e) => { e.target.onerror = null; e.target.src = premiumFallback; }} />
 </div>
 <div className="flex-1 min-w-0 py-1">
 <p className="text-[13px] text-primary font-bold line-clamp-2 leading-snug">{item.name}</p>
 <p className="text-[11px] text-primary/70 font-medium mt-1">Qty: {item.quantity}</p>
 </div>
 <span className="text-[13px] font-bold text-primary shrink-0">{formatPrice(item.price * item.quantity)}</span>
 </div>
))}
 </div>

 <div className="border-t border-border pt-6 space-y-4 mb-6">
 <div className="flex justify-between text-[14px]">
 <span className="text-primary/70 font-medium">Subtotal</span>
 <span className="font-semibold text-primary">{formatPrice(subtotal)}</span>
 </div>
 <div className="flex justify-between text-[14px]">
 <span className="text-primary/70 font-medium">Shipping</span>
 <span className={shippingPrice === 0 ? 'text-success font-bold tracking-wide' : 'font-semibold text-primary'}>
 {shippingPrice === 0 ? 'COMPLIMENTARY' : formatPrice(shippingPrice)}
 </span>
 </div>
 {discount > 0 && (
 <div className="flex justify-between text-[14px] text-success">
 <span className="font-semibold">Savings</span>
 <span className="font-bold">−{formatPrice(discount)}</span>
 </div>
)}
 </div>

 <div className="border-t border-border pt-6 mb-10">
 <div className="flex justify-between items-end">
 <div>
 <span className="font-bold text-primary/70 uppercase tracking-widest text-[11px] block mb-1">Total</span>
 <span className="text-[10px] text-primary/60 font-medium tracking-wide">Inclusive of taxes</span>
 </div>
 <span className="font-heading text-4xl font-extrabold text-primary">{formatPrice(grandTotal)}</span>
 </div>
 </div>

 {/* Trust Badges */}
 <div className="space-y-4">
 {[
 { icon: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z', text: 'Secure 256-bit SSL checkout' },
 { icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z', text: 'Authenticity guaranteed' }
 ].map((item, i) => (
 <div key={i} className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-full bg-surface-white border border-border flex items-center justify-center text-primary/60">
 <svg className="w-4 h-4"fill="none"viewBox="0 0 24 24"strokeWidth={1.5} stroke="currentColor">
 <path strokeLinecap="round"strokeLinejoin="round"d={item.icon} />
 </svg>
 </div>
 <p className="text-[11px] font-bold tracking-wide text-primary/60">{item.text}</p>
 </div>
))}
 </div>

 </div>
 </div>
)}

 </div>
 </div>
 </div>
);
};

export default Checkout;
