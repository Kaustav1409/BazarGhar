import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((star) => (
      <svg
        key={star}
        className={`w-3 h-3 ${star <= Math.round(rating) ? 'text-blue' : 'text-grey-light'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
    <span className="ml-1.5 text-[11px] text-grey-dark font-medium">{rating.toFixed(1)}</span>
  </div>
);

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(product._id);

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
    setIsWishlisted((prev) => !prev);
  };

  const discountPercent = product.discount || 0;
  const originalPrice = product.originalPrice || null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group bg-surface border border-grey rounded-2xl overflow-hidden hover:shadow-lg hover:border-blue transition-all duration-400 cursor-pointer flex flex-col h-full"
      id={`product-card-${product._id}`}
    >
      <Link to={`/product/${product._id}`} className="block flex-1 flex flex-col" aria-label={`View ${product.name}`}>
        {/* ── Image Container ─────────────────────────── */}
        <div className="relative overflow-hidden aspect-[4/5] bg-grey-light">
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
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.06] ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImgLoaded(true)}
              onError={() => { setImgError(true); setImgLoaded(true); }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-grey-light gap-3">
              <svg className="w-10 h-10 text-grey" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs text-grey-dark">No image available</span>
            </div>
          )}

          {/* Top gradient overlay */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Wishlist Button */}
          <motion.button
            onClick={handleWishlist}
            whileTap={{ scale: 0.85 }}
            className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-surface/95 backdrop-blur-sm rounded-full shadow-sm transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/30"
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <motion.svg
              className={`w-4 h-4 transition-colors ${isWishlisted ? 'text-red-500' : 'text-charcoal/50'}`}
              animate={{ scale: isWishlisted ? [1, 1.4, 1] : 1 }}
              transition={{ duration: 0.3 }}
              fill={isWishlisted ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={isWishlisted ? 0 : 1.8}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </motion.svg>
          </motion.button>

          {/* Quick Add — slides up from bottom */}
          <div className="absolute inset-x-0 bottom-0 px-3 pb-3 translate-y-full group-hover:translate-y-0 transition-transform duration-350 ease-out">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full py-3 text-xs font-bold tracking-wider uppercase rounded-xl transition-all duration-300 ${
                inCart
                  ? 'bg-green/10 text-green border border-green/20 cursor-default'
                  : product.stock === 0
                  ? 'bg-grey-light text-grey-dark cursor-not-allowed border border-grey'
                  : 'bg-blue text-white hover:bg-blue-hover shadow-sm hover:shadow-md'
              }`}
              aria-label={inCart ? 'Already in cart' : `Add ${product.name} to cart`}
            >
              {inCart ? '✓ In Cart' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          {/* Category pill */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 bg-surface/95 backdrop-blur-sm text-[10px] font-bold text-charcoal/70 tracking-wider uppercase rounded-lg shadow-sm">
              {product.category}
            </span>
          </div>

          {/* Discount badge */}
          {discountPercent > 0 && (
            <div className="absolute top-10 left-3 mt-1">
              <span className="px-2 py-0.5 bg-red-500 text-white text-[9px] font-bold tracking-wide rounded-md">
                -{discountPercent}%
              </span>
            </div>
          )}
        </div>

        {/* ── Card Content ────────────────────────────── */}
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-charcoal leading-snug line-clamp-2 mb-2.5 group-hover:text-blue transition-colors duration-300">
              {product.name}
            </h3>
            <StarRating rating={product.rating || 0} />
          </div>

          <div className="flex items-end justify-between mt-4 pt-4 border-t border-grey">
            <div>
              <span className="font-display text-xl font-semibold text-green">
                {formatPrice(product.price)}
              </span>
              {originalPrice && (
                <span className="ml-2 text-xs text-grey-dark line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
            <div className="text-right">
              {product.stock <= 5 && product.stock > 0 && (
                <span className="text-[10px] font-semibold text-green bg-green/10 border border-green/20 px-2 py-0.5 rounded-full">
                  {product.stock} left
                </span>
              )}
              {product.stock === 0 && (
                <span className="text-[10px] font-semibold text-error bg-error/10 border border-error/20 px-2.5 py-0.5 rounded-full">
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
