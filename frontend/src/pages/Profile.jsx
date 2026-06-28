import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { orderAPI, authAPI } from '../services/api';
import { SkeletonOrderItem } from '../components/Loader';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import SEO from '../components/SEO';
const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const { addToCart } = useCart();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
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
        setFetchError(true); 
      }
      finally { setLoading(false); }
    };
    fetchOrders();
  }, []); // Fetch orders once on mount so overview has stats

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

  const handleLogout = () => {
    logout();
    navigate('/');
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

  const TABS = [
    { id: 'overview', label: 'Dashboard', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' },
    { id: 'orders', label: 'My Orders', icon: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z' },
    { id: 'wishlist', label: 'Wishlist', icon: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' },
    { id: 'settings', label: 'Settings', icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281zM12 15a3 3 0 100-6 3 3 0 000 6z' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <h2 className="font-heading text-3xl font-bold text-primary tracking-tight">Overview</h2>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {[
                { val: orders.length, label: 'Total Orders' },
                { val: formatPrice(totalSpent), label: 'Total Spent' },
                { val: orders.filter((o) => o.status === 'Delivered').length, label: 'Delivered' },
                { val: wishlistItems.length, label: 'Saved Items' },
              ].map((s, i) => (
                <div key={i} className="card-premium p-6 flex flex-col items-center justify-center text-center">
                  <p className="font-heading text-2xl font-bold text-primary mb-1">{s.val}</p>
                  <p className="text-[10px] font-bold text-primary/50 uppercase tracking-widest">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Account Completion / Details */}
            <div className="card-premium p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading text-xl font-bold text-primary">Account Details</h3>
                <button onClick={() => setActiveTab('settings')} className="text-xs font-bold uppercase tracking-widest text-secondary hover:text-secondary/80 transition-colors">Edit</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="label-editorial mb-1">Full Name</p>
                  <p className="font-medium text-primary">{user?.name}</p>
                </div>
                <div>
                  <p className="label-editorial mb-1">Email Address</p>
                  <p className="font-medium text-primary">{user?.email}</p>
                </div>
                <div>
                  <p className="label-editorial mb-1">Phone Number</p>
                  <p className="font-medium text-primary">{user?.phone || <span className="text-primary/40 italic">Not provided</span>}</p>
                </div>
                <div>
                  <p className="label-editorial mb-1">Default Address</p>
                  <p className="font-medium text-primary line-clamp-2">{user?.address || <span className="text-primary/40 italic">Not provided</span>}</p>
                </div>
              </div>
            </div>

            {/* Recent Orders Snippet */}
            {orders.length > 0 && (
              <div className="card-premium p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-heading text-xl font-bold text-primary">Recent Orders</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-xs font-bold uppercase tracking-widest text-secondary hover:text-secondary/80 transition-colors">View All</button>
                </div>
                <div className="space-y-4">
                  {orders.slice(0, 3).map(order => (
                    <div key={order._id} className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-surface-white rounded-lg border border-border flex items-center justify-center shrink-0">
                          <svg className="w-6 h-6 text-primary/40" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" /></svg>
                        </div>
                        <div>
                          <p className="font-bold text-sm text-primary mb-0.5">#{order._id.slice(-8).toUpperCase()}</p>
                          <p className="text-[11px] text-primary/60 font-medium">{formatDate(order.createdAt)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-primary mb-1">{formatPrice(order.totalPrice)}</p>
                        <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest border ${statusColors[order.status] || 'bg-surface text-primary/60 border-border'}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-8">
            <h2 className="font-heading text-3xl font-bold text-primary tracking-tight mb-2">Order History</h2>
            
            {loading ? (
              <div className="space-y-6">
                {[0, 1, 2].map((i) => <SkeletonOrderItem key={i} />)}
              </div>
            ) : fetchError ? (
              <div className="card-premium py-24 text-center">
                <div className="w-20 h-20 bg-error/10 border border-error/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-error/80" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h3 className="font-heading text-2xl font-bold text-primary mb-3">Something went wrong</h3>
                <p className="text-sm text-primary/60 mb-8 max-w-sm mx-auto font-medium">We couldn't load your orders right now. Please try again later.</p>
                <button onClick={() => { setLoading(true); setFetchError(false); orderAPI.getMyOrders().then(res => { setOrders(res.data); setFetchError(false); }).catch(() => setFetchError(true)).finally(() => setLoading(false)); }} className="btn-primary">Try Again</button>
              </div>
            ) : orders.length === 0 ? (
              <EmptyState 
                title="No orders yet" 
                description="You haven't placed any orders yet. Start exploring our collections." 
                actionLabel="Start Shopping" 
                actionLink="/products" 
              />
            ) : (
              <div className="space-y-6">
                {orders.map((order, idx) => {
                  const grandTotal = (order.totalPrice || 0) + (order.shippingPrice || 0) + (order.taxPrice || 0) - (order.discount || 0);
                  const isCancellable = ['Pending', 'Confirmed', 'Packed'].includes(order.status);
                  
                  return (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.05, ease: [0.25, 1, 0.25, 1] }}
                      className="card-premium overflow-hidden"
                    >
                      <div className="bg-surface/30 px-6 lg:px-8 py-5 flex flex-wrap items-center justify-between gap-5 border-b border-border/50">
                        <div className="flex gap-8 lg:gap-12">
                          <div>
                            <p className="label-editorial mb-1">Order Placed</p>
                            <p className="text-sm font-semibold text-primary">{formatDate(order.createdAt)}</p>
                          </div>
                          <div>
                            <p className="label-editorial mb-1">Total</p>
                            <p className="font-heading text-lg font-bold text-primary leading-none mt-1">{formatPrice(grandTotal)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[11px] font-mono font-bold tracking-widest text-primary/50">
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                          <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase border ${statusColors[order.status] || 'bg-surface text-primary/60 border-border'}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 lg:p-8">
                        <div className="space-y-5">
                          {order.products?.map((item, i) => (
                            <div key={i} className="flex items-center gap-5">
                              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden bg-surface border border-border flex-shrink-0">
                                <img src={item.productId?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'} alt={item.productId?.name} loading="lazy" className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm lg:text-[15px] font-bold text-primary line-clamp-1 mb-1">{item.productId?.name || 'Product unavailable'}</p>
                                <p className="text-xs text-primary/60 font-medium">Qty: {item.quantity}</p>
                              </div>
                              <p className="text-sm lg:text-[15px] font-bold text-primary shrink-0">{formatPrice(item.quantity * item.price)}</p>
                            </div>
                          ))}
                        </div>

                        {order.status !== 'Cancelled' && (
                          <div className="mt-8 pt-6 border-t border-border/50">
                            <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                              {ORDER_STATUSES.map((s, i) => {
                                const currentIdx = ORDER_STATUSES.indexOf(order.status);
                                const stepIdx = i;
                                const done = currentIdx >= stepIdx;
                                return (
                                  <React.Fragment key={s}>
                                    <div className="flex flex-col items-center gap-2 shrink-0 w-16">
                                      <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full border-2 flex items-center justify-center transition-colors ${done ? 'bg-secondary border-secondary shadow-sm' : 'bg-surface-white border-border'}`}>
                                        {done && <svg className="w-3 h-3 lg:w-4 lg:h-4 text-surface-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
                                      </div>
                                      <p className={`text-[9px] font-bold uppercase tracking-widest text-center ${done ? 'text-secondary' : 'text-primary/40'}`}>{s}</p>
                                    </div>
                                    {i < ORDER_STATUSES.length - 1 && <div className={`flex-1 h-[2px] rounded-full min-w-[20px] transition-colors -mt-6 ${currentIdx > i ? 'bg-secondary' : 'bg-border'}`} />}
                                  </React.Fragment>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
                          <div className="w-full sm:w-auto">
                            {order.status === 'Cancelled' ? (
                              <p className="text-[11px] font-bold uppercase tracking-widest text-error flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                Order Cancelled
                              </p>
                            ) : isCancellable ? (
                              <button onClick={() => confirmCancel(order._id)} className="text-[11px] font-bold uppercase tracking-widest text-error hover:text-error/70 transition-colors">
                                Cancel Order
                              </button>
                            ) : null}
                          </div>
                          <div className="flex gap-3 w-full sm:w-auto">
                            <button onClick={() => handleBuyAgain(order)} className="btn-secondary flex-1 sm:flex-none border border-border bg-surface-white text-primary hover:border-secondary hover:text-secondary !py-2.5 !px-6 !text-[10px]">
                              Buy Again
                            </button>
                            <Link to={`/order/${order._id}`} className="btn-primary flex-1 sm:flex-none !py-2.5 !px-6 !text-[10px]">
                              View Invoice
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
        );

      case 'wishlist':
        return (
          <div className="space-y-8">
            <h2 className="font-heading text-3xl font-bold text-primary tracking-tight mb-2">My Wishlist</h2>
            {wishlistItems.length === 0 ? (
              <EmptyState 
                title="Your wishlist is empty" 
                description="Save items you love here to easily find them later." 
                actionLabel="Explore Collection" 
                actionLink="/products" 
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-8 max-w-2xl">
            <h2 className="font-heading text-3xl font-bold text-primary tracking-tight mb-2">Account Settings</h2>
            
            <div className="card-premium p-8">
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="profile-name" className="label-editorial mb-2 block">Full Name</label>
                    <input id="profile-name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-base bg-surface-white" />
                  </div>
                  <div>
                    <label htmlFor="profile-email" className="label-editorial mb-2 block">Email Address</label>
                    <input id="profile-email" type="email" value={user?.email || ''} disabled className="input-base bg-surface text-primary/50 cursor-not-allowed" />
                    <p className="text-[10px] text-primary/40 mt-1.5 font-medium">Email cannot be changed</p>
                  </div>
                  <div>
                    <label htmlFor="profile-phone" className="label-editorial mb-2 block">Phone Number</label>
                    <input id="profile-phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="9876543210" className="input-base bg-surface-white" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="profile-address" className="label-editorial mb-2 block">Default Delivery Address</label>
                    <textarea id="profile-address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={3} placeholder="Flat 101, Luxury Towers, City..." className="input-base bg-surface-white" />
                  </div>
                </div>
                <motion.button type="submit" disabled={updating} whileTap={!updating ? { scale: 0.98 } : {}} className={`btn-primary mt-4 py-4 px-10 text-[11px] uppercase tracking-[0.2em] ${updating ? 'opacity-70 cursor-not-allowed' : ''}`}>
                  {updating ? (
                    <span className="flex items-center gap-3">
                      <motion.div className="w-4 h-4 border-2 border-surface-white/30 border-t-surface-white rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                      Saving Updates...
                    </span>
                  ) : 'Save Changes'}
                </motion.button>
              </form>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-28 lg:pt-36 pb-32 bg-surface" id="main-content">
      <SEO title="Account Dashboard" />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        
        {/* Cancel Modal */}
        <AnimatePresence>
          {cancelModalOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-md">
              <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="card-premium shadow-2xl p-8 max-w-md w-full text-center relative overflow-hidden">
                {cancelSuccess ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-success" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-primary mb-3">Order Cancelled</h3>
                    <p className="text-[15px] text-primary/70 mb-8 font-medium">Your order has been cancelled successfully.</p>
                    <div className="flex gap-4">
                      <button onClick={() => setCancelModalOpen(false)} className="btn-secondary flex-1 bg-surface border-border">Close</button>
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

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* LEFT SIDEBAR NAVIGATION */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="lg:sticky lg:top-32">
              
              {/* Premium User Card inside Sidebar */}
              <div className="flex items-center gap-4 mb-8 p-4 rounded-2xl hover:bg-surface-white transition-colors border border-transparent hover:border-border cursor-default">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <span className="font-heading text-2xl font-bold text-surface-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold tracking-[0.2em] text-secondary uppercase mb-1">Premium Member</p>
                  <h1 className="font-heading text-xl font-bold text-primary truncate leading-tight">{user?.name}</h1>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 custom-scrollbar">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 whitespace-nowrap lg:whitespace-normal text-left ${
                      activeTab === tab.id 
                        ? 'bg-primary text-surface-white shadow-md' 
                        : 'text-primary/70 hover:bg-surface-white hover:text-primary'
                    }`}
                  >
                    <svg className={`w-5 h-5 shrink-0 ${activeTab === tab.id ? 'text-surface-white' : 'text-primary/50'}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                    </svg>
                    <span className="font-bold text-sm tracking-wide">{tab.label}</span>
                  </button>
                ))}
              </nav>

              {/* Logout Button */}
              <div className="mt-8 lg:mt-12 border-t border-border/50 pt-8 hidden lg:block">
                <button onClick={handleLogout} className="flex items-center gap-4 px-5 py-4 w-full rounded-xl text-error/80 hover:bg-error/10 hover:text-error transition-colors text-left group">
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
                  <span className="font-bold text-sm tracking-wide">Sign Out</span>
                </button>
              </div>
              
            </div>
          </aside>

          {/* RIGHT CONTENT AREA */}
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>

        </div>
      </div>
    </div>
  );
};

export default Profile;
