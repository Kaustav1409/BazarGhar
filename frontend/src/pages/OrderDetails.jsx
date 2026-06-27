import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen pt-32 lg:pt-40 pb-32 bg-surface print:bg-surface-white print:pt-10 print:pb-0" id="main-content">
      <div className="max-w-4xl mx-auto px-6 lg:px-10">
        
        {/* Breadcrumb - Hidden in print */}
        <div className="mb-8 flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-primary/50 print:hidden">
          <Link to="/profile" className="hover:text-primary transition-colors">Profile</Link>
          <span>/</span>
          <Link to="/profile" className="hover:text-primary transition-colors">Orders</Link>
          <span>/</span>
          <span className="text-primary">#{order._id.slice(-8).toUpperCase()}</span>
        </div>

        {/* Invoice Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface-white rounded-[2rem] border border-border p-8 lg:p-12 shadow-soft mb-8 print:shadow-none print:border-none print:p-0">
          <div className="flex flex-col md:flex-row justify-between gap-8 mb-12 pb-8 border-b border-border/50">
            <div>
              <h1 className="font-heading text-4xl font-bold text-primary mb-2">Invoice</h1>
              <p className="text-primary/60 text-sm font-medium">#{order._id.toUpperCase()}</p>
            </div>
            <div className="text-left md:text-right">
              <h2 className="font-heading text-2xl font-bold text-primary mb-1 tracking-tight">BazarGhar.</h2>
              <p className="text-primary/60 text-xs font-medium leading-relaxed">
                123 Luxury Avenue, Design District<br/>
                Mumbai, Maharashtra 400001<br/>
                contact@bazarghar.com
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
            <div>
              <p className="text-[10px] font-bold text-primary/50 uppercase tracking-[0.2em] mb-3">Billed To</p>
              <h3 className="font-bold text-primary text-base mb-1">{order.shippingAddress?.fullName}</h3>
              <p className="text-[13px] text-primary/70 font-medium leading-relaxed mb-3">
                {order.shippingAddress?.address}<br/>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
              </p>
              <p className="text-[13px] text-primary/70 font-medium flex items-center gap-2">
                <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                {order.shippingAddress?.phone}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-bold text-primary/50 uppercase tracking-[0.2em] mb-1.5">Order Date</p>
                <p className="font-semibold text-[13px] text-primary">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-primary/50 uppercase tracking-[0.2em] mb-1.5">Payment Method</p>
                <p className="font-semibold text-[13px] text-primary">{order.paymentMethod}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-primary/50 uppercase tracking-[0.2em] mb-1.5">Status</p>
                <span className={`px-2.5 py-1 rounded border text-[10px] font-bold uppercase tracking-widest inline-block ${statusColors[order.status] || 'bg-surface text-primary/60 border-border'}`}>
                  {order.status}
                </span>
              </div>
              {order.deliveryInstructions && (
                <div className="col-span-2">
                  <p className="text-[10px] font-bold text-primary/50 uppercase tracking-[0.2em] mb-1.5">Delivery Instructions</p>
                  <p className="font-medium text-[13px] text-primary/80 bg-surface px-4 py-2 rounded-lg border border-border inline-block">
                    "{order.deliveryInstructions}"
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full mb-8 text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-border/50 text-[10px] font-bold tracking-[0.2em] uppercase text-primary/50">
                  <th className="py-4 font-bold">Item</th>
                  <th className="py-4 text-center font-bold">Qty</th>
                  <th className="py-4 text-right font-bold">Price</th>
                  <th className="py-4 text-right font-bold">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.products?.map((item, i) => (
                  <tr key={i} className="border-b border-border/20 last:border-0">
                    <td className="py-5">
                      <div className="flex items-center gap-4">
                        <img src={item.productId?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'} alt={item.productId?.name} className="w-12 h-16 object-cover rounded-lg bg-surface border border-border" />
                        <span className="font-semibold text-[13px] text-primary line-clamp-1">{item.productId?.name || 'Product unavailable'}</span>
                      </div>
                    </td>
                    <td className="py-5 text-center text-[13px] font-medium text-primary/80">{item.quantity}</td>
                    <td className="py-5 text-right text-[13px] font-medium text-primary/80">{formatPrice(item.price)}</td>
                    <td className="py-5 text-right font-bold text-[14px] text-primary">{formatPrice(item.quantity * item.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-end md:items-start gap-8 pt-8 border-t border-border/50">
            <div className="w-full md:w-1/2 text-left print:hidden">
              <p className="text-[10px] font-bold text-primary/50 uppercase tracking-[0.2em] mb-3">Thank you for your business</p>
              <p className="text-xs text-primary/60 leading-relaxed max-w-sm">
                If you have any questions about this invoice, please contact our support team at support@bazarghar.com or call 1800-123-4567.
              </p>
            </div>
            <div className="w-full md:w-1/2 max-w-sm space-y-3">
              <div className="flex justify-between text-[13px]">
                <span className="text-primary/70 font-medium">Subtotal</span>
                <span className="font-semibold text-primary">{formatPrice(order.totalPrice || 0)}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-primary/70 font-medium">Tax (18% GST)</span>
                <span className="font-semibold text-primary">{formatPrice(order.taxPrice || 0)}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-primary/70 font-medium">Shipping</span>
                <span className={order.shippingPrice === 0 ? 'text-brand font-bold' : 'font-semibold text-primary'}>
                  {order.shippingPrice === 0 ? 'Free' : formatPrice(order.shippingPrice)}
                </span>
              </div>
              {(order.discount || 0) > 0 && (
                <div className="flex justify-between text-[13px] text-brand">
                  <span className="font-medium">Discount</span>
                  <span className="font-semibold">-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-primary border-t border-border pt-4 mt-2">
                <span className="font-bold text-[11px] uppercase tracking-widest text-primary/70">Grand Total</span>
                <span className="font-heading text-2xl font-extrabold">{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons - Hidden in Print */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end print:hidden">
          <Link to="/profile" className="btn-secondary border border-border bg-surface text-primary hover:border-secondary hover:text-secondary justify-center">
            Back to Orders
          </Link>
          <button onClick={handlePrint} className="btn-primary justify-center flex items-center gap-3">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0v3.398c0 .596.406 1.08 1 1.08h8.5c.594 0 1-.484 1-1.08V11.23z" /></svg>
            Download / Print Invoice
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderDetails;
