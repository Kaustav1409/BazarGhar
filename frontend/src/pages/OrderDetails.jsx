import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await orderAPI.getById(id);
        setOrder(data);
      } catch (err) {
        toast.error('Failed to load order details');
        navigate('/profile');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 lg:pt-40 pb-32 flex items-center justify-center bg-surface">
        <motion.div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
      </div>
    );
  }

  if (!order) return null;

  const formatPrice = (p) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);
  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const grandTotal = (order.totalPrice || 0) + (order.shippingPrice || 0) + (order.taxPrice || 0) - (order.discount || 0);

  const statusColors = {
    Pending: 'bg-surface-secondary text-primary/60 border-border',
    Confirmed: 'bg-success/10 text-success border-success/20',
    Packed: 'bg-secondary/10 text-secondary border-secondary/20',
    Shipped: 'bg-secondary/10 text-secondary border-secondary/20',
    'Out for Delivery': 'bg-brand/10 text-brand border-brand/20',
    Delivered: 'bg-success text-surface-white border-success-hover',
    Cancelled: 'bg-error/10 text-error border-error/20',
  };

  const ORDER_STATUSES = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen pt-28 lg:pt-36 pb-32 bg-surface print:bg-surface-white print:pt-10 print:pb-0" id="main-content">
      <SEO title={`Order #${order._id.slice(-8).toUpperCase()}`} />
      <div className="max-w-[1000px] mx-auto px-6 lg:px-10">
        
        {/* Breadcrumb - Hidden in print */}
        <div className="mb-8 flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] uppercase text-primary/50 print:hidden">
          <Link to="/profile" className="hover:text-primary transition-colors">Profile</Link>
          <span className="w-1 h-1 rounded-full bg-primary/20"></span>
          <Link to="/profile" className="hover:text-primary transition-colors">Orders</Link>
          <span className="w-1 h-1 rounded-full bg-primary/20"></span>
          <span className="text-primary">#{order._id.slice(-8).toUpperCase()}</span>
        </div>

        {/* Invoice Header */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="card-premium p-8 lg:p-16 mb-8 print:shadow-none print:border-none print:p-0 print:!bg-transparent print:rounded-none">
          <div className="flex flex-col md:flex-row justify-between gap-8 mb-16 pb-12 border-b border-border/50">
            <div>
              <p className="label-editorial mb-2">Invoice</p>
              <h1 className="font-heading text-4xl lg:text-5xl font-bold text-primary mb-2">#{order._id.slice(-8).toUpperCase()}</h1>
              <p className="text-primary/60 text-sm font-medium">{formatDate(order.createdAt)}</p>
            </div>
            <div className="text-left md:text-right">
              <h2 className="font-heading text-3xl font-bold text-primary mb-3 tracking-tight">BazarGhar.</h2>
              <p className="text-primary/60 text-sm font-medium leading-relaxed">
                123 Luxury Avenue, Design District<br/>
                Mumbai, Maharashtra 400001<br/>
                contact@bazarghar.com
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <p className="label-editorial mb-4">Billed To</p>
              <h3 className="font-bold text-primary text-lg mb-2">{order.shippingAddress?.fullName}</h3>
              <p className="text-[14px] text-primary/70 font-medium leading-relaxed mb-4 max-w-[280px]">
                {order.shippingAddress?.address}<br/>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
              </p>
              <p className="text-[14px] text-primary/70 font-medium flex items-center gap-3">
                <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                {order.shippingAddress?.phone}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-y-8 gap-x-6">
              <div>
                <p className="label-editorial mb-2">Order Date</p>
                <p className="font-semibold text-sm text-primary">{formatDate(order.createdAt).split(',')[0]}</p>
              </div>
              <div>
                <p className="label-editorial mb-2">Payment Method</p>
                <p className="font-semibold text-sm text-primary">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="label-editorial mb-2">Current Status</p>
                <span className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-widest inline-block ${statusColors[order.status] || 'bg-surface text-primary/60 border-border'}`}>
                  {order.status}
                </span>
              </div>
              {order.deliveryInstructions && (
                <div className="col-span-2 mt-2">
                  <p className="label-editorial mb-2">Delivery Instructions</p>
                  <p className="font-medium text-[13px] text-primary/80 bg-surface px-5 py-3 rounded-xl border border-border inline-block">
                    "{order.deliveryInstructions}"
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Timeline - Hidden in print or show simplified */}
          {order.status !== 'Cancelled' && (
            <div className="mb-16 pb-12 border-b border-border/50 print:hidden">
              <p className="label-editorial mb-8">Order Journey</p>
              <div className="flex items-center justify-between relative max-w-2xl">
                {/* Background Line */}
                <div className="absolute top-4 left-0 right-0 h-[2px] bg-border -z-10 mx-6"></div>
                
                {ORDER_STATUSES.map((s, i) => {
                  const currentIdx = ORDER_STATUSES.indexOf(order.status);
                  const stepIdx = i;
                  const done = currentIdx >= stepIdx;
                  return (
                    <div key={s} className="flex flex-col items-center gap-3 relative bg-surface-white px-2">
                      <div className={`w-8 h-8 rounded-full border-[3px] flex items-center justify-center transition-colors ${done ? 'bg-secondary border-secondary shadow-sm' : 'bg-surface-white border-border'}`}>
                        {done && <svg className="w-4 h-4 text-surface-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
                      </div>
                      <p className={`text-[9px] font-bold uppercase tracking-widest text-center ${done ? 'text-secondary' : 'text-primary/40'}`}>{s}</p>
                      
                      {/* Active line fill */}
                      {i < ORDER_STATUSES.length - 1 && currentIdx > i && (
                        <div className="absolute top-4 left-8 w-[calc(100%+32px)] h-[2px] bg-secondary -z-10" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="overflow-x-auto mb-16">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="py-4 label-editorial">Item Description</th>
                  <th className="py-4 text-center label-editorial">Qty</th>
                  <th className="py-4 text-right label-editorial">Price</th>
                  <th className="py-4 text-right label-editorial">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.products?.map((item, i) => (
                  <tr key={i} className="border-b border-border/30 last:border-0 group hover:bg-surface/30 transition-colors print:hover:bg-transparent">
                    <td className="py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface border border-border flex-shrink-0 print:hidden">
                          <img src={item.productId?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'} alt={item.productId?.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-bold text-sm text-primary">{item.productId?.name || 'Product unavailable'}</span>
                      </div>
                    </td>
                    <td className="py-6 text-center text-sm font-medium text-primary/80">{item.quantity}</td>
                    <td className="py-6 text-right text-sm font-medium text-primary/80">{formatPrice(item.price)}</td>
                    <td className="py-6 text-right font-bold text-[15px] text-primary">{formatPrice(item.quantity * item.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-end md:items-start gap-12 pt-12 border-t border-border/50">
            <div className="w-full md:w-1/2 text-left print:hidden">
              <p className="label-editorial mb-3">Thank you for your trust</p>
              <p className="text-[13px] text-primary/60 font-medium leading-relaxed max-w-sm">
                If you have any questions about this order, please contact our concierge team at support@bazarghar.com. We hope you enjoy your premium items.
              </p>
            </div>
            <div className="w-full md:w-1/2 max-w-sm space-y-4">
              <div className="flex justify-between text-[14px]">
                <span className="text-primary/70 font-medium">Subtotal</span>
                <span className="font-bold text-primary">{formatPrice(order.totalPrice || 0)}</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-primary/70 font-medium">Tax (18% GST)</span>
                <span className="font-bold text-primary">{formatPrice(order.taxPrice || 0)}</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-primary/70 font-medium">Shipping</span>
                <span className={order.shippingPrice === 0 ? 'text-brand font-bold' : 'font-bold text-primary'}>
                  {order.shippingPrice === 0 ? 'Complimentary' : formatPrice(order.shippingPrice)}
                </span>
              </div>
              {(order.discount || 0) > 0 && (
                <div className="flex justify-between text-[14px] text-brand">
                  <span className="font-medium">Discount Applied</span>
                  <span className="font-bold">-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between items-end text-primary border-t border-border/80 pt-6 mt-4">
                <span className="font-bold text-[12px] uppercase tracking-[0.2em] text-primary/70 mb-1">Grand Total</span>
                <span className="font-heading text-4xl font-extrabold">{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons - Hidden in Print */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end print:hidden">
          <Link to="/profile" className="btn-secondary justify-center !px-8">
            Return to Dashboard
          </Link>
          <button onClick={handlePrint} className="btn-primary justify-center flex items-center gap-3 !px-8">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0v3.398c0 .596.406 1.08 1 1.08h8.5c.594 0 1-.484 1-1.08V11.23z" /></svg>
            Download Invoice
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderDetails;
