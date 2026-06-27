import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? 'text-secondary' : 'text-border'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
    <span className="ml-1.5 text-[11px] text-primary/70 font-semibold">{rating.toFixed(1)}</span>
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
    if (inCart || addingToCart) return;
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.25, 1, 0.25, 1] }}
      className="group bg-surface-white border border-border rounded-[1.5rem] overflow-hidden shadow-soft hover:shadow-card-hover hover:border-secondary/40 transition-all duration-500 cursor-pointer flex flex-col h-full relative"
      id={`product-card-${product._id}`}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-surface/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <Link to={`/product/${product._id}`} className="block flex-1 flex flex-col relative z-10" aria-label={`View ${product.name}`}>
        {/* ── Image Container ─────────────────────────── */}
        <div className="relative overflow-hidden aspect-[4/5] bg-surface">
          {/* Loading skeleton behind image */}
          {!imgLoaded && !imgError && (
            <div className="absolute inset-0 skeleton" />
          )}

          {!imgError ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImgLoaded(true)}
              onError={() => { setImgError(true); setImgLoaded(true); }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-surface gap-3">
              <svg className="w-10 h-10 text-border" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs text-primary/40 font-medium">No image available</span>
            </div>
          )}

          {/* Glass overlay on hover */}
          <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Top gradient overlay */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Wishlist Button */}
          <motion.button
            onClick={handleWishlist}
            whileTap={{ scale: 0.9 }}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center glass-white rounded-full shadow-soft transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 border border-secondary/20"
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <motion.svg
              className={`w-5 h-5 transition-colors ${wishlisted ? 'text-error' : 'text-primary'}`}
              animate={{ scale: wishlisted ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.4 }}
              fill={wishlisted ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={wishlisted ? 0 : 1.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </motion.svg>
          </motion.button>

          {/* Quick Add — slides up from bottom with Apple-like interaction */}
          <div className="absolute inset-x-0 bottom-0 px-4 pb-4 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-500 ease-[0.25,1,0.25,1]">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full py-3.5 text-[11px] font-bold tracking-[0.2em] uppercase rounded-xl transition-all duration-300 ${
                inCart
                  ? 'glass text-surface-white border border-secondary cursor-default shadow-md'
                  : product.stock === 0
                  ? 'bg-surface/90 text-primary/50 cursor-not-allowed border border-border'
                  : 'bg-surface-white text-primary hover:bg-brand hover:text-surface-white shadow-soft hover:shadow-card'
              }`}
              aria-label={inCart ? 'Already in cart' : `Add ${product.name} to cart`}
            >
              {inCart ? '✓ In Cart' : product.stock === 0 ? 'Out of Stock' : 'Quick Add'}
            </button>
          </div>

          {/* Top Left Badge Container */}
          <div className="absolute top-4 left-4 flex flex-col items-start gap-2 z-10">
            {/* Category pill */}
            <span className="px-3 py-1.5 glass-white text-[9px] font-bold text-primary tracking-[0.2em] uppercase rounded-lg shadow-sm border border-secondary/20">
              {product.category}
            </span>

            {/* Trending badge */}
            {product.rating >= 4.8 && (
              <span className="px-2.5 py-1 bg-brand text-surface-white text-[9px] font-bold tracking-widest uppercase rounded-md shadow-sm border border-brand-hover">
                Trending
              </span>
            )}

            {/* Discount badge */}
            {discountPercent > 0 && (
              <span className="px-2.5 py-1 bg-error text-surface-white text-[10px] font-bold tracking-widest rounded-md shadow-sm">
                -{discountPercent}%
              </span>
            )}
          </div>
        </div>

        {/* ── Card Content ────────────────────────────── */}
        <div className="p-6 flex-1 flex flex-col bg-surface-white relative">
          <div className="flex-1">
            <h3 className="font-heading text-[15px] font-bold text-primary leading-snug line-clamp-2 mb-3 group-hover:text-secondary transition-colors duration-400">
              {product.name}
            </h3>
            <StarRating rating={product.rating || 0} />
          </div>

          <div className="flex items-end justify-between mt-5 pt-5 border-t border-border">
            <div>
              <span className="font-heading text-xl font-extrabold text-primary">
                {formatPrice(product.price)}
              </span>
              {originalPrice && (
                <span className="ml-2 text-xs text-primary/40 font-medium line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
            <div className="text-right">
              {product.stock <= 5 && product.stock > 0 && (
                <span className="text-[10px] font-bold tracking-widest text-secondary bg-secondary/10 border border-secondary/20 px-2.5 py-1 rounded-full uppercase">
                  {product.stock} left
                </span>
              )}
              {product.stock === 0 && (
                <span className="text-[10px] font-bold tracking-widest text-error bg-error/10 border border-error/20 px-2.5 py-1 rounded-full uppercase">
                  Sold out
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

export default ProductCard;
