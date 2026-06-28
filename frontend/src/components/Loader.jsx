import React from 'react';
import { motion } from 'framer-motion';

/* ─────────────────────────────────────────────────────────
   LOADER SPINNER (Premium)
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
        <div className={`${sizes[size]} rounded-full border-border/30`} style={{ border: 'inherit' }} />
        <motion.div
          className={`absolute inset-0 ${sizes[size]} rounded-full`}
          style={{
            border: '2.5px solid transparent',
            borderTopColor: '#390517', // Brand Color
            borderRightColor: 'rgba(57,5,23,0.2)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      {text && (
        <p className="label-editorial animate-pulse-slow">{text}</p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-white/80 backdrop-blur-md">
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
   SKELETON CARD  (matches new luxury ProductCard)
───────────────────────────────────────────────────────── */
export const SkeletonCard = () => (
  <div className="flex flex-col h-full bg-surface-white rounded-[1.25rem] overflow-hidden border border-border/30">
    <div className="relative w-full aspect-[4/5] bg-surface-secondary overflow-hidden skeleton" />
    <div className="p-4 sm:p-5 flex flex-col flex-1 bg-surface-white justify-between">
      <div className="mb-3">
        <div className="h-4 bg-surface-secondary rounded-sm w-3/4 mb-2 skeleton" />
        <div className="h-3 bg-surface-secondary rounded-sm w-1/4 skeleton" />
      </div>
      <div className="mt-auto pt-4 border-t border-border/30 flex justify-between items-end">
        <div className="h-5 bg-surface-secondary rounded-sm w-1/3 skeleton" />
        <div className="h-3 bg-surface-secondary rounded-sm w-1/5 skeleton" />
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────
   SKELETON PRODUCT DETAIL  (luxury layout)
───────────────────────────────────────────────────────── */
export const SkeletonProductDetail = () => (
  <div className="page-container pb-20">
    <div className="section-container pt-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-10">
        <div className="h-2 skeleton w-10 rounded-sm" />
        <div className="h-2 skeleton w-1 rounded-sm" />
        <div className="h-2 skeleton w-16 rounded-sm" />
        <div className="h-2 skeleton w-1 rounded-sm" />
        <div className="h-2 skeleton w-24 rounded-sm" />
      </div>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/5] skeleton rounded-[1.5rem]" />
          <div className="grid grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/5] skeleton rounded-xl" />
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="pt-4 space-y-6">
          <div className="space-y-4">
            <div className="h-8 skeleton w-4/5 rounded-md" />
            <div className="h-8 skeleton w-3/5 rounded-md" />
          </div>
          <div className="h-4 skeleton w-1/3 rounded-sm" />
          <div className="h-10 skeleton w-1/4 rounded-md mt-4" />
          <div className="divider mt-8" />
          <div className="space-y-3 mt-6">
            <div className="h-3 skeleton w-full rounded-sm" />
            <div className="h-3 skeleton w-5/6 rounded-sm" />
            <div className="h-3 skeleton w-4/6 rounded-sm" />
          </div>
          <div className="flex gap-4 mt-10">
            <div className="h-[52px] skeleton w-32 rounded-xl" />
            <div className="h-[52px] skeleton flex-1 rounded-xl" />
            <div className="h-[52px] w-[52px] skeleton rounded-xl flex-shrink-0" />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="h-16 skeleton rounded-xl" />
            <div className="h-16 skeleton rounded-xl" />
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
  <div className="card-premium">
    {/* Header */}
    <div className="bg-surface/50 px-6 py-5 flex justify-between items-center border-b border-border/40">
      <div className="flex gap-8">
        <div className="space-y-2">
          <div className="h-2 skeleton w-16 rounded-sm" />
          <div className="h-3 skeleton w-20 rounded-sm" />
        </div>
        <div className="space-y-2">
          <div className="h-2 skeleton w-12 rounded-sm" />
          <div className="h-3 skeleton w-14 rounded-sm" />
        </div>
      </div>
      <div className="h-6 skeleton w-20 rounded-md" />
    </div>
    {/* Body */}
    <div className="p-6 space-y-5">
      {[0, 1].map((i) => (
        <div key={i} className="flex items-center gap-5">
          <div className="w-16 h-16 skeleton rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2.5">
            <div className="h-3 skeleton w-3/4 rounded-sm" />
            <div className="h-2.5 skeleton w-1/3 rounded-sm" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Loader;

