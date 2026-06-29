import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import premiumFallback from '../assets/images/premium_fallback.jpg';

const StarRating = ({ rating }) => (
 <div className="flex items-center gap-1 mt-1"aria-label={`${rating.toFixed(1)} out of 5 stars`}>
 {[1, 2, 3, 4, 5].map((star) => (
 <svg
 key={star}
 className={`w-2.5 h-2.5 ${star <= Math.round(rating) ? 'text-primary' : 'text-primary/70'}`}
 fill="currentColor"
 viewBox="0 0 20 20"
 aria-hidden="true"
 >
 <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
 </svg>
))}
 <span className="ml-1 text-[10px] text-primary/60 font-medium">{rating.toFixed(1)}</span>
 </div>
);

const ProductCard = ({ product }) => {
 const [imgLoaded, setImgLoaded] = useState(false);
 const [imgError, setImgError] = useState(false);
 const [addingToCart, setAddingToCart] = useState(false);
 
 const { addToCart, isInCart } = useCart();
 const { isWishlisted, toggleWishlist } = useWishlist();
 
 const inCart = isInCart(product._id);
 const wishlisted = isWishlisted(product._id);

 const formatPrice = (price) =>
 new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

 const handleAddToCart = async (e) => {
 e.preventDefault();
 e.stopPropagation();
 if (inCart || addingToCart || product.stock === 0) return;
 setAddingToCart(true);
 addToCart(product);
 setTimeout(() => setAddingToCart(false), 800);
 };

 const handleWishlist = (e) => {
 e.preventDefault();
 e.stopPropagation();
 toggleWishlist(product);
 };

 const discountPercent = product.discount || 0;
 const originalPrice = product.originalPrice || null;

 return (
 <motion.article
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: '-50px' }}
 transition={{ duration: 0.6, ease: [0.25, 1, 0.25, 1] }}
 className="group flex flex-col h-full card-premium relative"
 id={`product-card-${product._id}`}
 >
 <Link to={`/product/${product._id}`} className="flex flex-col h-full relative z-10"aria-label={`View ${product.name}`}>
 
 {/* ── Image Container (Strict 4:5 Ratio) ─────────────────────────── */}
 <div className="relative w-full aspect-[4/5] bg-surface-dark overflow-hidden">
 {/* Skeleton */}
 {!imgLoaded && !imgError && (
 <div className="absolute inset-0 skeleton"/>
)}

 {/* Image */}
 <img
 src={imgError ? premiumFallback : (product.image || premiumFallback)}
 alt={product.name}
 loading="lazy"
 decoding="async"
 className={`w-full h-full object-cover transition-transform duration-[1.5s] ease-luxury group-hover:scale-[1.02] ${
 imgLoaded ? 'opacity-100' : 'opacity-0'
 }`}
 onLoad={() => setImgLoaded(true)}
 onError={() => { setImgError(true); setImgLoaded(true); }}
 />

 {/* Minimal Hover Overlay */}
 <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"/>

 {/* Wishlist Button (Glass) */}
 <button
 onClick={handleWishlist}
 className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center glass-dark rounded-full border border-border/60 shadow-sm transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 z-20"
 aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
 >
 <svg
 className={`w-[18px] h-[18px] transition-colors duration-300 ${wishlisted ? 'text-error fill-error' : 'text-primary fill-none'}`}
 viewBox="0 0 24 24"
 stroke="currentColor"
 strokeWidth={wishlisted ? 0 : 1.5}
 >
 <path strokeLinecap="round"strokeLinejoin="round"d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"/>
 </svg>
 </button>

 {/* Quick Add Button */}
 <div className="absolute inset-x-0 bottom-0 p-3 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1] z-20">
 <button
 onClick={handleAddToCart}
 disabled={product.stock === 0}
 className={`w-full py-3 text-[10px] font-semibold font-body tracking-[0.15em] uppercase rounded-xl transition-all duration-300 backdrop-blur-md border ${
 inCart
 ? 'bg-primary/90 text-surface-white border-primary cursor-default'
 : product.stock === 0
 ? 'bg-surface-white/90 text-primary/60 border-border cursor-not-allowed'
 : 'bg-surface-white/95 text-primary border-surface-white/50 hover:bg-primary hover:text-surface-white hover:border-primary shadow-sm'
 }`}
 >
 {inCart ? 'In Cart' : product.stock === 0 ? 'Out of Stock' : 'Quick Add'}
 </button>
 </div>

 {/* Unified Badge Container */}
 <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5 z-20">
 {/* Category */}
 <span className="badge-neutral glass-dark backdrop-blur-md">
 {product.category}
 </span>

 {/* Trending */}
 {product.rating >= 4.8 && (
 <span className="badge-brand">
 Trending
 </span>
)}

 {/* Discount */}
 {discountPercent > 0 && (
 <span className="badge-danger">
 -{discountPercent}%
 </span>
)}
 </div>
 </div>

 {/* ── Content Area ────────────────────────────── */}
 <div className="p-4 sm:p-5 flex flex-col flex-1 bg-surface-white justify-between">
 <div className="mb-3">
 <h3 className="font-heading text-[14px] font-bold text-primary leading-snug line-clamp-2 group-hover:text-primary/70 transition-colors duration-300">
 {product.name}
 </h3>
 {product.rating > 0 && <StarRating rating={product.rating} />}
 </div>

 <div className="flex items-end justify-between mt-auto pt-4 border-t border-border/60">
 <div className="flex flex-col">
 {originalPrice && (
 <span className="text-[11px] text-primary/60 font-medium line-through mb-0.5">
 {formatPrice(originalPrice)}
 </span>
)}
 <span className="font-heading text-[16px] font-extrabold text-primary">
 {formatPrice(product.price)}
 </span>
 </div>

 {product.stock <= 5 && product.stock > 0 && (
 <span className="label-editorial text-secondary">
 Only {product.stock} left
 </span>
)}
 </div>
 </div>
 
 </Link>
 </motion.article>
);
};

export default React.memo(ProductCard);
