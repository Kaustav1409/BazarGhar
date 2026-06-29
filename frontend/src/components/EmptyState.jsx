import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const EmptyState = ({ 
 icon, 
 title, 
 description, 
 actionLabel ="Discover Collections", 
 actionLink ="/products"
}) => {
 return (
 <motion.div 
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
 className="flex flex-col items-center justify-center py-20 px-6 text-center"
 >
 <div className="w-20 h-20 mb-8 rounded-full bg-surface-white flex items-center justify-center text-primary shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
 {icon || (
 <svg className="w-8 h-8 opacity-60"fill="none"viewBox="0 0 24 24"strokeWidth={1} stroke="currentColor">
 <path strokeLinecap="round"strokeLinejoin="round"d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
 </svg>
)}
 </div>
 
 <h3 className="font-heading text-3xl font-bold text-primary mb-3 tracking-tight">{title}</h3>
 <p className="text-primary/70 text-sm max-w-sm mb-10 leading-relaxed">
 {description}
 </p>

 <Link 
 to={actionLink}
 className="btn-primary"
 >
 {actionLabel}
 </Link>
 </motion.div>
);
};

export default EmptyState;
