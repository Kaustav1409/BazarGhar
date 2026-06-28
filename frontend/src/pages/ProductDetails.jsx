import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { productAPI } from '../services/api';
import { SkeletonDetails } from '../components/Skeletons';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import toast from 'react-hot-toast';

const StarRating = ({ rating, count }) => (
  <div className="flex items-center gap-3">
    <div className="flex items-center gap-1" aria-label={`${rating?.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-4 h-4 ${s <= Math.round(rating) ? 'text-primary' : 'text-border'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
    {count && <span className="text-[13px] text-primary/60 font-medium tracking-wide">({count} Reviews)</span>}
  </div>
);

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  
  const { addToCart, isInCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  
  const inCart = product ? isInCart(product._id) : false;
  const wishlisted = product ? isWishlisted(product._id) : false;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await productAPI.getById(id);
        setProduct(data);
        const relatedRes = await productAPI.getAll({ category: data.category, limit: 5 });
        setRelatedProducts(relatedRes.data.products?.filter((p) => p._id !== data._id).slice(0, 4) || []);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const handleAddToCart = async () => {
    if (inCart || addingToCart) return;
    setAddingToCart(true);
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart`, {
      style: { background: '#03110D', color: '#FDFCF8', borderRadius: '12px' },
    });
    setTimeout(() => setAddingToCart(false), 1000);
  };

  const handleBuyNow = () => {
    if (!inCart) {
      addToCart(product, quantity);
    }
    navigate('/checkout');
  };

  const handleWishlist = () => {
    toggleWishlist(product);
    toast.success(wishlisted ? 'Removed from Wishlist' : 'Added to Wishlist', {
      style: { background: '#03110D', color: '#FDFCF8', borderRadius: '12px' },
    });
  };

  if (loading) return <SkeletonDetails />;

  if (!product) return (
    <div className="pt-32 text-center min-h-screen flex flex-col items-center justify-center gap-6 bg-surface">
      <div className="w-24 h-24 bg-surface-white rounded-full border border-border shadow-soft flex items-center justify-center">
        <svg className="w-10 h-10 text-primary/20" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <h2 className="font-heading text-2xl font-bold text-primary mb-2">Product not found</h2>
        <p className="text-[15px] text-primary/60 mb-6 font-medium">This product may have been removed or is temporarily unavailable.</p>
        <Link to="/products" className="btn-secondary">Back to Products</Link>
      </div>
    </div>
  );

  // Stacked Gallery Images (Using unsplash for missing angles)
  const galleryImages = [
    product.image,
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&auto=format&fit=crop&q=80',
  ];

  const originalPrice = product.originalPrice || (product.price > 500 ? Math.round(product.price * 1.12) : null);
  const discountPct = originalPrice ? Math.round(((originalPrice - product.price) / originalPrice) * 100) : null;
  const stockPct = product.stock > 0 ? Math.min(100, (product.stock / 20) * 100) : 0;

  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-32 bg-surface" id="main-content">
      <SEO title={product.name} description={product.description} />
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-primary/50 mb-12" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
          <span aria-hidden="true">/</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-primary transition-colors">{product.category}</Link>
        </nav>

        {/* ── Main Product Grid ─────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

          {/* LEFT: Stacked Gallery (Scrolls with page) */}
          <div className="w-full lg:w-[55%]">
            
            {/* Desktop Vertical Stack */}
            <div className="hidden lg:flex flex-col gap-6">
              {galleryImages.map((img, idx) => (
                <div key={idx} className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden bg-surface-white border border-border shadow-soft group">
                  <img 
                    src={img} 
                    alt={`${product.name} view ${idx + 1}`} 
                    loading={idx === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[0.25,1,0.25,1] group-hover:scale-105" 
                  />
                  {idx === 0 && discountPct && (
                    <div className="absolute top-6 left-6 z-10 px-3 py-1.5 bg-brand text-surface-white text-[11px] tracking-widest font-bold uppercase rounded-lg shadow-sm">
                      {discountPct}% OFF
                    </div>
                  )}
                  {idx === 0 && (
                    <button
                      onClick={handleWishlist}
                      className="absolute top-6 right-6 z-10 w-12 h-12 glass-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-soft"
                      aria-label="Wishlist"
                    >
                      <svg className={`w-5 h-5 ${wishlisted ? 'text-error fill-error' : 'text-primary'}`} fill={wishlisted ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={wishlisted ? 0 : 1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Horizontal Snap Scroll */}
            <div className="flex lg:hidden overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-6 px-6 no-scrollbar">
              {galleryImages.map((img, idx) => (
                <div key={idx} className="relative w-[85vw] shrink-0 snap-center aspect-[4/5] rounded-3xl overflow-hidden bg-surface-white border border-border shadow-soft">
                  <img src={img} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  {idx === 0 && discountPct && (
                    <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-brand text-surface-white text-[10px] tracking-widest font-bold uppercase rounded-lg shadow-sm">
                      {discountPct}% OFF
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Sticky Purchase Info */}
          <div className="w-full lg:w-[45%] lg:sticky lg:top-32 flex flex-col space-y-10">
            
            {/* Header Area */}
            <div>
              <p className="label-editorial mb-4">{product.category}</p>
              <h1 className="font-heading text-4xl lg:text-5xl font-extrabold text-primary leading-[1.1] tracking-tight mb-6 text-balance">
                {product.name}
              </h1>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <StarRating rating={product.rating || 0} count={product.reviews || 128} />
                <span className={`text-[11px] font-bold tracking-widest px-4 py-2 rounded-xl uppercase border ${
                  product.stock > 0
                    ? 'text-primary bg-primary/5 border-primary/10'
                    : 'text-error bg-error/5 border-error/20'
                }`}>
                  {product.stock > 0 ? `In Stock` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <div className="flex items-end gap-4 mb-2">
                <p className="font-heading text-4xl font-extrabold text-primary leading-none">{formatPrice(product.price)}</p>
                {originalPrice && (
                  <p className="text-xl text-primary/40 line-through font-semibold leading-none">{formatPrice(originalPrice)}</p>
                )}
              </div>
              <p className="text-[12px] text-primary/50 font-medium tracking-wide">Inclusive of all taxes · Free delivery on luxury orders</p>
            </div>

            {/* Description */}
            <div className="text-[15px] text-primary/70 leading-relaxed font-medium">
              <p>{product.description}</p>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 pt-8 border-t border-border/50">
              {[
                { label: 'Material', value: 'Premium Grade' },
                { label: 'Brand', value: 'BazarGhar Exclusive' },
                { label: 'Warranty', value: '1 Year International' },
                { label: 'Origin', value: 'Imported' }
              ].map((spec, i) => (
                <div key={i}>
                  <p className="label-editorial mb-1 text-primary/40">{spec.label}</p>
                  <p className="text-sm font-bold text-primary">{spec.value}</p>
                </div>
              ))}
            </div>

            {/* Stock Warning */}
            {product.stock > 0 && product.stock <= 20 && (
              <div className="card-premium p-5 !rounded-2xl border-secondary/20 bg-secondary/5 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold tracking-widest text-primary uppercase">Limited Availability</p>
                  <p className="text-xs text-primary/60 font-semibold">{product.stock} units left</p>
                </div>
                <div className="w-full h-1 bg-border/50 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${100 - stockPct}%` }} />
                </div>
              </div>
            )}

            {/* Purchase Actions */}
            <div className="pt-8 border-t border-border/50 space-y-4">
              {product.stock > 0 ? (
                <>
                  <div className="flex gap-4">
                    {/* Quantity */}
                    <div className="flex items-center border border-border bg-surface-white rounded-2xl p-1.5 w-fit shadow-soft h-[60px]" role="group" aria-label="Quantity selector">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-12 h-full flex items-center justify-center text-xl text-primary/50 hover:text-primary hover:bg-surface rounded-xl transition-all"
                        disabled={quantity <= 1}
                      >−</button>
                      <span className="w-10 text-center font-bold text-primary text-lg">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-12 h-full flex items-center justify-center text-xl text-primary/50 hover:text-primary hover:bg-surface rounded-xl transition-all"
                        disabled={quantity >= product.stock}
                      >+</button>
                    </div>

                    {/* Add to Cart */}
                    <motion.button
                      onClick={handleAddToCart}
                      disabled={inCart}
                      whileTap={!inCart ? { scale: 0.98 } : {}}
                      className={`flex-1 h-[60px] rounded-2xl text-[12px] font-bold tracking-[0.15em] uppercase transition-all duration-300 ${
                        inCart
                          ? 'bg-success/10 text-success border border-success/20 cursor-default'
                          : 'btn-outline border-border bg-surface-white text-primary hover:border-primary'
                      }`}
                    >
                      {inCart ? 'Added to Cart' : 'Add to Bag'}
                    </motion.button>
                  </div>

                  {/* Buy Now Button */}
                  <motion.button
                    onClick={handleBuyNow}
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-[60px] btn-primary rounded-2xl text-[12px] tracking-[0.15em] shadow-card flex justify-center items-center gap-3"
                  >
                    Buy It Now
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                    </svg>
                  </motion.button>
                </>
              ) : (
                <div className="h-[60px] flex items-center justify-center bg-error/5 border border-error/20 rounded-2xl text-[12px] tracking-[0.15em] uppercase text-error font-bold">
                  Sold Out
                </div>
              )}
            </div>

            {/* Delivery / Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12', text: 'Complimentary Shipping' },
                { icon: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99', text: 'Free 14-Day Returns' },
                { icon: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z', text: 'Secure Checkout' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-primary/40 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                  <p className="text-[11px] font-bold tracking-wide text-primary/70">{item.text}</p>
                </div>
              ))}
            </div>
            
          </div>
        </div>

        <div className="w-full h-px bg-border my-24" />

        {/* ── Customer Reviews ─────────────────────── */}
        <section className="mb-32">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            
            <div className="w-full lg:w-1/3">
              <p className="label-editorial mb-4">Feedback</p>
              <h2 className="font-heading text-4xl font-bold text-primary mb-8">Client Reviews</h2>
              
              <div className="flex flex-col gap-6 mb-10">
                <div className="flex items-baseline gap-3">
                  <span className="font-heading text-5xl font-extrabold text-primary">{(product.rating || 4.8).toFixed(1)}</span>
                  <span className="text-lg text-primary/50 font-medium">out of 5</span>
                </div>
                <StarRating rating={product.rating || 0} count={product.reviews || 128} />
              </div>

              <div className="space-y-3">
                {[
                  { stars: 5, pct: 75 },
                  { stars: 4, pct: 15 },
                  { stars: 3, pct: 5 },
                  { stars: 2, pct: 3 },
                  { stars: 1, pct: 2 },
                ].map(({ stars, pct }) => (
                  <div key={stars} className="flex items-center gap-4 text-sm">
                    <span className="text-primary/70 font-bold w-12 text-right">{stars} ★</span>
                    <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                    <span className="text-primary/50 font-medium w-8 text-right">{pct}%</span>
                  </div>
                ))}
              </div>
              
              <button className="btn-outline w-full mt-10 !py-4 text-[11px]">Write a Review</button>
            </div>

            <div className="w-full lg:w-2/3 space-y-6">
              {[
                { name: 'Arjun Mehta', date: 'October 12, 2025', rating: 5, text: 'Absolutely stunning quality. The attention to detail is evident right out of the box. Highly recommended!', verified: true },
                { name: 'Priya Desai', date: 'September 28, 2025', rating: 5, text: 'Exceeded my expectations. Fast delivery, luxurious packaging, and the product works flawlessly.', verified: true },
                { name: 'Vikram Singh', date: 'August 14, 2025', rating: 4, text: 'Very premium feel. The craftsmanship is excellent although delivery took a bit longer than expected.', verified: true }
              ].map((review, i) => (
                <div key={i} className="card-premium p-8 !rounded-[2rem]">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-surface text-primary rounded-full flex items-center justify-center font-heading font-bold text-lg border border-border">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[15px] font-bold text-primary">{review.name}</p>
                        <p className="text-[11px] text-primary/50 tracking-wide font-medium mt-0.5">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <StarRating rating={review.rating} />
                      {review.verified && (
                        <span className="text-[9px] font-bold uppercase tracking-widest text-primary/60 flex items-center gap-1.5">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-[15px] text-primary/70 leading-relaxed font-medium">"{review.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Related Products ─────────────────────── */}
        {relatedProducts.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="label-editorial mb-4">Curated For You</p>
                <h2 className="font-heading text-4xl font-bold text-primary">Related Pieces</h2>
              </div>
              <Link
                to={`/products?category=${product.category}`}
                className="btn-outline hidden sm:flex text-[11px]"
              >
                View Collection
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rp) => (
                <ProductCard key={rp._id} product={rp} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;
