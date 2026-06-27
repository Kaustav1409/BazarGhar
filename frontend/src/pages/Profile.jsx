import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderAPI, authAPI } from '../services/api';
import { SkeletonOrderItem } from '../components/Loader';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const inputClass = 'input-field';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { addToCart } = useCart();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '' });
  const [updating, setUpdating] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  
  // Cancel Order State
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await orderAPI.getMyOrders();
        setOrders(data);
        setFetchError(false);
      } catch (err) { 
        console.error('Failed to load orders', err);
        setFetchError(true); 
      }
      finally { setLoading(false); }
    };
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const { data } = await authAPI.updateProfile(form);
      updateUser(data);
      toast.success('Profile updated successfully', {
        style: { background: '#03110D', color: '#FDFCF8', borderRadius: '12px' },
      });
    } catch { toast.error('Failed to update profile'); }
    finally { setUpdating(false); }
  };

  const confirmCancel = (orderId) => {
    setOrderToCancel(orderId);
    setCancelModalOpen(true);
    setCancelSuccess(false);
  };

  const handleCancelOrder = async () => {
    if (!orderToCancel) return;
    setCancelling(true);
    try {
      const { data } = await orderAPI.cancel(orderToCancel);
      setOrders(orders.map(o => o._id === orderToCancel ? data.order : o));
      setCancelSuccess(true);
      setTimeout(() => {
        setCancelModalOpen(false);
        setOrderToCancel(null);
      }, 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order.');
      setCancelModalOpen(false);
    } finally {
      setCancelling(false);
    }
  };

  const handleBuyAgain = (order) => {
    order.products.forEach(item => {
      if (item.productId && item.productId._id) {
        addToCart({ ...item.productId }, item.quantity);
      }
    });
    toast.success('Items added to cart!', {
      style: { background: '#03110D', color: '#FDFCF8', borderRadius: '12px' },
    });
    navigate('/cart');
  };

  const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);
  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  const totalSpent = orders.reduce((sum, o) => sum + (o.totalPrice || 0) + (o.shippingPrice || 0) + (o.taxPrice || 0) - (o.discount || 0), 0);

  const statusColors = {
    Pending: 'bg-surface-secondary text-primary/60 border-border',
    Confirmed: 'bg-success/10 text-success border-success/20',
    Packed: 'bg-secondary/10 text-secondary border-secondary/20',
    Shipped: 'bg-secondary/10 text-secondary border-secondary/20',
    'Out for Delivery': 'bg-brand/10 text-brand border-brand/20',
    Delivered: 'bg-success text-surface-white border-success-hover',
    Cancelled: 'bg-error/10 text-error border-error/20',
  };

  const paymentStatusColors = {
    'Paid': 'text-success',
    'Pending': 'text-secondary',
    'Cash on Delivery': 'text-primary/70',
    'Refunded': 'text-brand',
    'Cancelled': 'text-error',
  };

  const ORDER_STATUSES = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

  return (
    <div className="min-h-screen pt-32 lg:pt-40 pb-32 bg-surface" id="main-content">
      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-10">

        {/* ── Cancel Order Modal ─────────────────── */}
        <AnimatePresence>
          {cancelModalOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-md">
              <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="bg-surface-white rounded-[2rem] border border-border shadow-2xl p-8 max-w-md w-full text-center relative overflow-hidden">
                {cancelSuccess ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-success" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-primary mb-3">Order Cancelled</h3>
                    <p className="text-[15px] text-primary/70 mb-8 font-medium">Your order has been cancelled successfully.</p>
                    <div className="flex gap-4">
                      <button onClick={() => setCancelModalOpen(false)} className="btn-secondary flex-1 bg-surface border-border">Close</button>
                      <Link to="/products" className="btn-primary flex-1 flex items-center justify-center">Continue Shopping</Link>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-error" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-primary mb-3">Cancel Order</h3>
                    <p className="text-[15px] text-primary/70 mb-8 font-medium">
                      Are you sure you want to cancel this order?<br/>This action cannot be undone.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button onClick={() => setCancelModalOpen(false)} disabled={cancelling} className="btn-secondary flex-1 bg-surface border-border text-primary hover:border-primary">Keep Order</button>
                      <button onClick={handleCancelOrder} disabled={cancelling} className={`btn-primary flex-1 bg-error border-error hover:bg-error/90 hover:border-error/90 text-surface-white ${cancelling ? 'opacity-70' : ''}`}>
                        {cancelling ? 'Cancelling...' : 'Cancel Order'}
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Header Card ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-surface-white rounded-[2rem] border border-border shadow-soft p-8 lg:p-10 mb-10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" aria-hidden="true" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md border border-border">
                  <span className="font-heading text-4xl font-bold text-surface-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-brand rounded-full border-[3px] border-surface-white flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-surface-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.3em] text-secondary uppercase mb-1.5">Premium Member</p>
                <h1 className="font-heading text-4xl font-bold text-primary leading-tight mb-1">{user?.name}</h1>
                <p className="text-sm text-primary/60 font-medium">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-8 flex-wrap">
              {[
                { val: orders.length, label: 'Orders', icon: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z' },
                { val: formatPrice(totalSpent), label: 'Total Spent', icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z' },
                { val: orders.filter((o) => o.status === 'Delivered').length, label: 'Delivered', icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                { val: wishlistItems.length, label: 'Wishlist', icon: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-[10px] font-bold text-primary/50 uppercase tracking-widest mb-1.5 flex items-center justify-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d={s.icon} /></svg>
                    {s.label}
                  </p>
                  <p className="font-heading text-2xl font-bold text-primary">{s.val}</p>
                </div>
              ))}
            </div>

            <div className="flex bg-surface rounded-xl p-1.5 border border-border shadow-inner-soft w-fit mt-4 md:mt-0">
              {['orders', 'wishlist', 'profile'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); if (tab === 'orders') setLoading(true); }}
                  className={`px-6 py-3 rounded-lg text-[11px] font-bold tracking-widest uppercase transition-all duration-300 ${activeTab === tab ? 'bg-surface-white text-primary shadow-sm border border-border/50' : 'text-primary/50 hover:text-primary'}`}
                >
                  {tab === 'orders' ? 'My Orders' : tab === 'wishlist' ? 'Wishlist' : 'Account Details'}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-surface-white/60 backdrop-blur-xl rounded-[2rem] border border-border p-8 lg:p-10 shadow-soft">
          {activeTab === 'orders' ? (
            <div>
              <h2 className="font-heading text-2xl font-bold text-primary mb-8 flex items-center gap-3">
                <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" /></svg>
                Order History
              </h2>

              {loading ? (
                <div className="space-y-6">
                  {[0, 1, 2].map((i) => <SkeletonOrderItem key={i} />)}
                </div>
              ) : fetchError ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-24 text-center">
                  <div className="relative w-28 h-28 mx-auto mb-8">
                    <div className="w-28 h-28 bg-surface border border-error/20 rounded-full flex items-center justify-center shadow-inner-soft">
                      <svg className="w-12 h-12 text-error/60" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                  </div>
                  <h3 className="font-heading text-3xl font-bold text-primary mb-3">Something went wrong</h3>
                  <p className="text-[15px] text-primary/60 mb-10 max-w-[280px] mx-auto font-medium">We couldn't load your orders right now. Please try again later.</p>
                  <button onClick={() => { setLoading(true); setFetchError(false); orderAPI.getMyOrders().then(res => { setOrders(res.data); setFetchError(false); }).catch(() => setFetchError(true)).finally(() => setLoading(false)); }} className="btn-primary">Try Again</button>
                </motion.div>
              ) : orders.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-24 text-center">
                  <div className="relative w-28 h-28 mx-auto mb-8">
                    <div className="w-28 h-28 bg-surface border border-border rounded-full flex items-center justify-center shadow-inner-soft">
                      <svg className="w-12 h-12 text-primary/40" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" /></svg>
                    </div>
                  </div>
                  <h3 className="font-heading text-3xl font-bold text-primary mb-3">No orders yet</h3>
                  <p className="text-[15px] text-primary/60 mb-10 max-w-[280px] mx-auto font-medium">You haven't placed any orders yet.</p>
                  <Link to="/products" className="btn-primary inline-flex">Start Shopping</Link>
                </motion.div>
              ) : (
                <div className="space-y-8">
                  {orders.map((order, idx) => {
                    const grandTotal = (order.totalPrice || 0) + (order.shippingPrice || 0) + (order.taxPrice || 0) - (order.discount || 0);
                    const isCancellable = ['Pending', 'Confirmed', 'Packed'].includes(order.status);
                    
                    return (
                      <motion.div
                        key={order._id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.08, ease: [0.25, 1, 0.25, 1] }}
                        className="border border-border/60 rounded-[1.5rem] overflow-hidden hover:shadow-card hover:border-secondary/30 transition-all duration-300 bg-surface-white/80 backdrop-blur-sm"
                      >
                        <div className="bg-surface/30 px-8 py-5 flex flex-wrap items-center justify-between gap-5 border-b border-border/50">
                          <div className="flex gap-10">
                            <div>
                              <p className="text-[9px] uppercase tracking-[0.2em] text-primary/60 font-bold mb-1.5">Order Placed</p>
                              <p className="text-[13px] font-semibold text-primary">{formatDate(order.createdAt)}</p>
                            </div>
                            <div>
                              <p className="text-[9px] uppercase tracking-[0.2em] text-primary/60 font-bold mb-1.5">Total</p>
                              <p className="font-heading text-base font-extrabold text-primary">{formatPrice(grandTotal)}</p>
                            </div>
                            <div className="hidden sm:block">
                              <p className="text-[9px] uppercase tracking-[0.2em] text-primary/60 font-bold mb-1.5">Payment</p>
                              <p className={`text-[13px] font-bold ${paymentStatusColors[order.paymentStatus] || 'text-primary'}`}>{order.paymentStatus}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] font-mono font-bold tracking-widest text-primary/70 bg-surface-white border border-border px-3 py-1.5 rounded-lg shadow-sm">
                              #{order._id.slice(-8).toUpperCase()}
                            </span>
                            <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase border ${statusColors[order.status] || 'bg-surface text-primary/60 border-border'}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        <div className="p-8">
                          <div className="space-y-5">
                            {order.products?.map((item, i) => (
                              <div key={i} className="flex items-center gap-5">
                                <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface border border-border flex-shrink-0">
                                  <img src={item.productId?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'} alt={item.productId?.name} loading="lazy" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[15px] font-semibold text-primary line-clamp-1 mb-1">{item.productId?.name || 'Product unavailable'}</p>
                                  <p className="text-xs text-primary/60 font-medium">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                                </div>
                                <p className="text-[15px] font-bold text-primary shrink-0">{formatPrice(item.quantity * item.price)}</p>
                              </div>
                            ))}
                          </div>

                          {order.status !== 'Cancelled' && (
                            <div className="mt-8 pt-6 border-t border-border/50 flex flex-col gap-4">
                              <p className="text-[10px] font-bold text-primary/50 uppercase tracking-[0.2em]">Order Timeline</p>
                              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                                {ORDER_STATUSES.map((s, i) => {
                                  const currentIdx = ORDER_STATUSES.indexOf(order.status);
                                  const stepIdx = i;
                                  const done = currentIdx >= stepIdx;
                                  return (
                                    <React.Fragment key={s}>
                                      <div className="flex flex-col items-center gap-2 shrink-0">
                                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${done ? 'bg-secondary border-secondary shadow-sm' : 'bg-surface-white border-border'}`}>
                                          {done && <svg className="w-4 h-4 text-surface-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
                                        </div>
                                        <p className={`text-[10px] font-bold uppercase tracking-widest whitespace-nowrap ${done ? 'text-secondary' : 'text-primary/40'}`}>{s}</p>
                                      </div>
                                      {i < ORDER_STATUSES.length - 1 && <div className={`flex-1 h-[2px] rounded-full min-w-[30px] transition-colors ${currentIdx > i ? 'bg-secondary' : 'bg-border'}`} />}
                                    </React.Fragment>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
                            <div className="flex gap-4">
                              {order.status === 'Cancelled' ? (
                                <p className="text-[12px] font-medium text-error flex items-center gap-2 bg-error/5 px-4 py-2 rounded-lg">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                  This order was cancelled.
                                </p>
                              ) : isCancellable ? (
                                <button onClick={() => confirmCancel(order._id)} className="text-[12px] font-bold uppercase tracking-widest text-error hover:text-error/70 transition-colors px-4 py-2">
                                  Cancel Order
                                </button>
                              ) : (
                                <p className="text-[11px] font-medium text-primary/40 flex items-center gap-2 bg-surface px-4 py-2 rounded-lg">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                                  This order can no longer be cancelled.
                                </p>
                              )}
                            </div>
                            <div className="flex gap-3 w-full sm:w-auto">
                              <button onClick={() => handleBuyAgain(order)} className="btn-secondary flex-1 sm:flex-none border border-border bg-surface-white text-primary hover:border-secondary hover:text-secondary !py-2.5 !text-[10px]">
                                Buy Again
                              </button>
                              <Link to={`/order/${order._id}`} className="btn-primary flex-1 sm:flex-none !py-2.5 !text-[10px]">
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : activeTab === 'wishlist' ? (
            <div>
              <h2 className="font-heading text-2xl font-bold text-primary mb-8 flex items-center gap-3">
                <svg className="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                My Wishlist
              </h2>
              {wishlistItems.length === 0 ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-24 text-center">
                  <div className="relative w-28 h-28 mx-auto mb-8">
                    <div className="w-28 h-28 bg-surface border border-border rounded-full flex items-center justify-center shadow-inner-soft">
                      <svg className="w-12 h-12 text-primary/40" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                    </div>
                  </div>
                  <h3 className="font-heading text-3xl font-bold text-primary mb-3">Your wishlist is empty</h3>
                  <p className="text-[15px] text-primary/60 mb-10 max-w-[280px] mx-auto font-medium">Save items you love here to easily find them later.</p>
                  <Link to="/products" className="btn-primary inline-flex">Explore Products</Link>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistItems.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-2xl">
              <h2 className="font-heading text-2xl font-bold text-primary mb-8 flex items-center gap-3">
                <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                Personal Information
              </h2>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="profile-name" className="block text-[10px] font-bold text-primary/70 tracking-[0.2em] uppercase mb-2">Full Name</label>
                    <input id="profile-name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="profile-email" className="block text-[10px] font-bold text-primary/70 tracking-[0.2em] uppercase mb-2">Email Address</label>
                    <input id="profile-email" type="email" value={user?.email || ''} disabled className={`${inputClass} bg-surface text-primary/50 cursor-not-allowed`} />
                    <p className="text-[10px] text-primary/50 mt-1.5 font-medium">Email cannot be changed</p>
                  </div>
                  <div>
                    <label htmlFor="profile-phone" className="block text-[10px] font-bold text-primary/70 tracking-[0.2em] uppercase mb-2">Phone Number</label>
                    <input id="profile-phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="9876543210" className={inputClass} />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="profile-address" className="block text-[10px] font-bold text-primary/70 tracking-[0.2em] uppercase mb-2">Default Address</label>
                    <textarea id="profile-address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={3} placeholder="123 Luxury Avenue, City..." className={inputClass} />
                  </div>
                </div>
                <motion.button type="submit" disabled={updating} whileTap={!updating ? { scale: 0.98 } : {}} className={`btn-primary mt-4 py-4 px-10 text-[11px] uppercase tracking-[0.2em] ${updating ? 'opacity-70 cursor-not-allowed' : ''}`}>
                  {updating ? (
                    <span className="flex items-center gap-3">
                      <motion.div className="w-4 h-4 border-2 border-surface-white/30 border-t-surface-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                      Saving...
                    </span>
                  ) : 'Save Changes'}
                </motion.button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
