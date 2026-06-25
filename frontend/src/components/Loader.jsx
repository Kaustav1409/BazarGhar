import React from 'react';
import { motion } from 'framer-motion';

/* ─────────────────────────────────────────────────────────
   LOADER SPINNER
───────────────────────────────────────────────────────── */
const Loader = ({ size = 'md', text = '', fullPage = false }) => {
  const sizes = {
    sm: 'w-6 h-6 border-[2px]',
    md: 'w-10 h-10 border-[2.5px]',
    lg: 'w-14 h-14 border-[3px]',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        {/* Track ring */}
        <div className={`${sizes[size]} rounded-full border-grey/40`} style={{ border: 'inherit' }} />
        {/* Spinning arc */}
        <motion.div
          className={`absolute inset-0 ${sizes[size]} rounded-full`}
          style={{
            border: '2.5px solid transparent',
            borderTopColor: '#2F80ED',
            borderRightColor: 'rgba(47,128,237,0.3)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      {text && (
        <p className="text-sm text-grey-dark font-medium animate-pulse-slow">{text}</p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20">
      {spinner}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   SKELETON CARD  (matches ProductCard 4/5 aspect)
───────────────────────────────────────────────────────── */
export const SkeletonCard = () => (
  <div className="bg-white border border-grey/60 rounded-3xl overflow-hidden">
    {/* Image area */}
    <div className="aspect-[4/5] skeleton" />
    {/* Content area */}
    <div className="p-6 space-y-3">
      {/* Category pill */}
      <div className="h-3 skeleton w-1/4" />
      {/* Title */}
      <div className="h-4 skeleton w-4/5" />
      <div className="h-4 skeleton w-3/5" />
      {/* Stars */}
      <div className="h-3 skeleton w-1/3 mt-1" />
      {/* Price + action */}
      <div className="flex items-center justify-between pt-3 border-t border-grey/40 mt-2">
        <div className="h-5 skeleton w-1/4" />
        <div className="h-5 skeleton w-1/5 rounded-full" />
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────
   SKELETON PRODUCT DETAIL  (two-column layout)
───────────────────────────────────────────────────────── */
export const SkeletonProductDetail = () => (
  <div className="min-h-screen pt-20 pb-20 bg-surface">
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-10">
        <div className="h-3 skeleton w-10 rounded" />
        <div className="h-3 skeleton w-1 rounded" />
        <div className="h-3 skeleton w-16 rounded" />
        <div className="h-3 skeleton w-1 rounded" />
        <div className="h-3 skeleton w-24 rounded" />
      </div>

      <div className="grid lg:grid-cols-2 gap-16 items-start">
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/5] skeleton rounded-3xl" />
          <div className="grid grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/5] skeleton rounded-xl" />
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="pt-4 space-y-5">
          <div className="h-6 skeleton w-4/5 rounded-lg" />
          <div className="h-6 skeleton w-3/5 rounded-lg" />
          <div className="h-4 skeleton w-1/3 rounded" />
          <div className="h-8 skeleton w-1/4 rounded-lg mt-2" />
          <div className="divider mt-6" />
          <div className="space-y-2 mt-4">
            <div className="h-3 skeleton w-full rounded" />
            <div className="h-3 skeleton w-5/6 rounded" />
            <div className="h-3 skeleton w-4/6 rounded" />
          </div>
          <div className="flex gap-4 mt-6">
            <div className="h-14 skeleton w-36 rounded-2xl" />
            <div className="h-14 skeleton flex-1 rounded-2xl" />
            <div className="h-14 w-14 skeleton rounded-2xl" />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="h-16 skeleton rounded-2xl" />
            <div className="h-16 skeleton rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────
   SKELETON ORDER ITEM  (profile orders list)
───────────────────────────────────────────────────────── */
export const SkeletonOrderItem = () => (
  <div className="border border-grey/60 rounded-2xl overflow-hidden">
    {/* Header */}
    <div className="bg-surface/50 px-6 py-4 flex justify-between items-center border-b border-grey/40">
      <div className="flex gap-8">
        <div className="space-y-1.5">
          <div className="h-2.5 skeleton w-20" />
          <div className="h-4 skeleton w-24" />
        </div>
        <div className="space-y-1.5">
          <div className="h-2.5 skeleton w-10" />
          <div className="h-4 skeleton w-16" />
        </div>
      </div>
      <div className="h-6 skeleton w-20 rounded-full" />
    </div>
    {/* Body */}
    <div className="p-6 space-y-4">
      {[0, 1].map((i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="w-16 h-16 skeleton rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 skeleton w-3/4" />
            <div className="h-3 skeleton w-1/3" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Loader;
