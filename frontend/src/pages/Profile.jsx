import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { orderAPI, authAPI } from '../services/api';
import Loader, { SkeletonOrderItem } from '../components/Loader';
import toast from 'react-hot-toast';

const inputClass = 'input-field';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '' });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await orderAPI.getMyOrders();
        setOrders(data);
      } catch { toast.error('Failed to load orders'); }
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
        style: { background: '#111827', color: '#fff', borderRadius: '12px' },
        iconTheme: { primary: '#D4AF37', secondary: '#111827' },
      });
    } catch { toast.error('Failed to update profile'); }
    finally { setUpdating(false); }
  };

  const formatPrice = (p) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

  const totalSpent = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  const statusColors = {
    pending: 'badge-pending',
    processing: 'badge-processing',
    shipped: 'badge-shipped',
    delivered: 'badge-delivered',
    cancelled: 'badge-cancelled',
  };

  return (
    <div className="min-h-screen pt-16 lg:pt-20 pb-24 bg-cream" id="main-content">
      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-10">

        {/* ── Header Card ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl border border-border/60 shadow-soft p-8 mb-8 relative overflow-hidden"
        >
          {/* Background gradient blob */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" aria-hidden="true" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Avatar + name */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-ink flex items-center justify-center shadow-md">
                  <span className="font-display text-3xl font-semibold text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full border-2 border-white flex items-center justify-center" aria-hidden="true">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold tracking-[0.2em] text-gold uppercase mb-1">Member</p>
                <h1 className="font-display text-3xl font-semibold text-primary leading-tight">{user?.name}</h1>
                <p className="text-sm text-muted mt-0.5">{user?.email}</p>
              </div>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-6 flex-wrap">
              {[
                { val: orders.length, label: 'Orders', icon: '📦' },
                { val: formatPrice(totalSpent), label: 'Total Spent', icon: '💳' },
                { val: orders.filter((o) => o.status === 'delivered').length, label: 'Delivered', icon: '✅' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-[11px] text-muted mb-1">{s.icon} {s.label}</p>
                  <p className="font-display text-xl font-semibold text-primary">{s.val}</p>
                </div>
              ))}
            </div>

            {/* Tab Navigation */}
            <div className="flex bg-cream rounded-2xl p-1.5 border border-border/60 shadow-inner-soft w-fit">
              {['orders', 'profile'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setLoading(true); }}
                  className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-250 capitalize ${
                    activeTab === tab
                      ? 'bg-white text-primary shadow-soft'
                      : 'text-muted hover:text-primary'
                  }`}
                  id={`tab-${tab}`}
                  aria-selected={activeTab === tab}
                  role="tab"
                >
                  {tab === 'orders' ? 'My Orders' : 'Account Details'}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Tab Content ─────────────────────────── */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white rounded-3xl border border-border/60 p-6 lg:p-8 shadow-soft"
          role="tabpanel"
        >
          {activeTab === 'orders' ? (
            <div>
              <h2 className="font-display text-xl font-semibold text-primary mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                </svg>
                Order History
              </h2>

              {loading ? (
                <div className="space-y-4">
                  {[0, 1, 2].map((i) => <SkeletonOrderItem key={i} />)}
                </div>
              ) : orders.length === 0 ? (
                /* Empty Orders */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-20 text-center"
                >
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="w-24 h-24 bg-cream border-2 border-dashed border-border rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-border" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
                      </svg>
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gold/30 rounded-full" aria-hidden="true" />
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-primary/10 rounded-full" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-primary mb-2">No orders yet</h3>
                  <p className="text-sm text-muted mb-8 max-w-[240px] mx-auto leading-relaxed">
                    When you place an order, it will appear here with full tracking details.
                  </p>
                  <a href="/products" className="btn-primary">Start Shopping</a>
                </motion.div>
              ) : (
                <div className="space-y-5">
                  {orders.map((order, idx) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.06 }}
                      className="border border-border/60 rounded-2xl overflow-hidden hover:shadow-card transition-all duration-300"
                      id={`order-${order._id}`}
                    >
                      {/* Order Header */}
                      <div className="bg-cream/60 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-border/40">
                        <div className="flex gap-8">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-muted font-bold mb-1">Order Placed</p>
                            <p className="text-sm font-semibold text-primary">{formatDate(order.createdAt)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-muted font-bold mb-1">Total</p>
                            <p className="font-display text-sm font-semibold text-primary">{formatPrice(order.totalPrice)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono text-muted bg-cream border border-border px-2.5 py-1 rounded-lg">
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                          <span className={statusColors[order.status] || 'badge bg-gray-50 text-gray-600 border border-gray-200'}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="p-6">
                        <div className="space-y-4">
                          {order.products?.map((item, i) => (
                            <div key={i} className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-xl overflow-hidden bg-cream border border-border/40 flex-shrink-0">
                                <img
                                  src={item.productId?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                                  alt={item.productId?.name || 'Product'}
                                  loading="lazy"
                                  className="w-full h-full object-cover"
                                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'; }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-primary line-clamp-1">
                                  {item.productId?.name || 'Product unavailable'}
                                </p>
                                <p className="text-xs text-muted mt-0.5">
                                  Qty: {item.quantity} × {formatPrice(item.price)}
                                </p>
                              </div>
                              <p className="text-sm font-bold text-primary shrink-0">{formatPrice(item.quantity * item.price)}</p>
                            </div>
                          ))}
                        </div>

                        {/* Order timeline */}
                        <div className="mt-6 pt-5 border-t border-border/40 flex items-center gap-2 overflow-x-auto pb-1">
                          {['pending', 'processing', 'shipped', 'delivered'].map((s, i) => {
                            const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
                            const currentIdx = statuses.indexOf(order.status);
                            const stepIdx = statuses.indexOf(s);
                            const done = currentIdx >= stepIdx && order.status !== 'cancelled';
                            const active = order.status === s;
                            return (
                              <React.Fragment key={s}>
                                <div className="flex flex-col items-center gap-1 shrink-0">
                                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                    done ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-border'
                                  }`}>
                                    {done && (
                                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                      </svg>
                                    )}
                                  </div>
                                  <p className={`text-[9px] font-semibold capitalize whitespace-nowrap ${done ? 'text-emerald-600' : 'text-muted'}`}>{s}</p>
                                </div>
                                {i < 3 && (
                                  <div className={`flex-1 h-0.5 rounded-full min-w-[20px] ${
                                    currentIdx > i && order.status !== 'cancelled' ? 'bg-emerald-400' : 'bg-border'
                                  }`} aria-hidden="true" />
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>

                        {order.shippingAddress && (
                          <div className="mt-4 text-xs text-muted flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                            <span className="font-semibold text-primary">{order.shippingAddress.fullName}</span>
                            — {order.shippingAddress.city}, {order.shippingAddress.state}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* ── Profile Form ─────────────────── */
            <div className="max-w-2xl">
              <h2 className="font-display text-xl font-semibold text-primary mb-7 flex items-center gap-2">
                <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                Personal Information
              </h2>
              <form onSubmit={handleUpdateProfile} className="space-y-5" aria-label="Profile settings form">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="profile-name" className="block text-xs font-bold text-muted tracking-wide uppercase mb-1.5">Full Name</label>
                    <input id="profile-name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="profile-email" className="block text-xs font-bold text-muted tracking-wide uppercase mb-1.5">Email Address</label>
                    <input id="profile-email" type="email" value={user?.email || ''} disabled className={`${inputClass} bg-cream text-muted cursor-not-allowed`} aria-readonly="true" />
                    <p className="text-[10px] text-muted mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <label htmlFor="profile-phone" className="block text-xs font-bold text-muted tracking-wide uppercase mb-1.5">Phone Number</label>
                    <input id="profile-phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="9876543210" className={inputClass} />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="profile-address" className="block text-xs font-bold text-muted tracking-wide uppercase mb-1.5">Default Address</label>
                    <textarea
                      id="profile-address"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      rows={3}
                      placeholder="123 Main St, City..."
                      className={inputClass}
                    />
                  </div>
                </div>
                <motion.button
                  type="submit"
                  disabled={updating}
                  whileTap={!updating ? { scale: 0.98 } : {}}
                  id="save-profile-btn"
                  className={`btn-primary mt-2 ${updating ? 'opacity-70 cursor-not-allowed' : ''}`}
                  aria-busy={updating}
                >
                  {updating ? (
                    <span className="flex items-center gap-2">
                      <motion.div
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        aria-hidden="true"
                      />
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
