import React from 'react';
import { motion } from 'framer-motion';

const shimmer = {
  initial: { opacity: 0.5 },
  animate: { 
    opacity: [0.5, 0.8, 0.5],
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
  }
};

export const SkeletonCard = () => (
  <motion.div 
    variants={shimmer} 
    initial="initial" 
    animate="animate" 
    className="flex flex-col gap-4"
  >
    <div className="w-full h-[400px] lg:h-[480px] bg-border/50 rounded-[20px]" />
    <div className="flex justify-between items-start px-2">
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-border/50 rounded-full w-3/4" />
        <div className="h-3 bg-border/50 rounded-full w-1/4" />
      </div>
      <div className="h-4 bg-border/50 rounded-full w-16 ml-4" />
    </div>
  </motion.div>
);

export const SkeletonDetails = () => (
  <div className="container-padding">
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
      <motion.div 
        variants={shimmer} 
        initial="initial" 
        animate="animate" 
        className="lg:w-2/3 h-[60vh] lg:h-[85vh] bg-border/50 rounded-[30px]"
      />
      <motion.div 
        variants={shimmer} 
        initial="initial" 
        animate="animate"
        className="lg:w-1/3 space-y-6 pt-10"
      >
        <div className="h-3 bg-border/50 rounded-full w-1/4" />
        <div className="h-10 bg-border/50 rounded-full w-3/4" />
        <div className="h-6 bg-border/50 rounded-full w-1/3" />
        <div className="space-y-3 pt-6 border-t border-border/50">
          <div className="h-3 bg-border/50 rounded-full w-full" />
          <div className="h-3 bg-border/50 rounded-full w-5/6" />
          <div className="h-3 bg-border/50 rounded-full w-4/6" />
        </div>
        <div className="h-14 bg-border/50 rounded-[18px] w-full mt-10" />
      </motion.div>
    </div>
  </div>
);
