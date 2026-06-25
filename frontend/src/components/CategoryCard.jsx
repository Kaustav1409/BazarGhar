import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const categoryData = {
  Electronics: {
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&auto=format&fit=crop&q=70',
    color: 'from-blue-900/80',
    count: '240+',
  },
  Fashion: {
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&auto=format&fit=crop&q=70',
    color: 'from-rose-900/80',
    count: '380+',
  },
  Books: {
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&auto=format&fit=crop&q=70',
    color: 'from-amber-900/80',
    count: '520+',
  },
  Furniture: {
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&auto=format&fit=crop&q=70',
    color: 'from-stone-900/80',
    count: '180+',
  },
  Lifestyle: {
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&auto=format&fit=crop&q=70',
    color: 'from-emerald-900/80',
    count: '290+',
  },
  Accessories: {
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=70',
    color: 'from-violet-900/80',
    count: '150+',
  },
};

const categoryIcons = {
  Electronics: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
  ),
  Fashion: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
  ),
  Books: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  ),
  Furniture: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h10.5m-10.5 6h10.5m-10.5 6h10.5" />
  ),
  Lifestyle: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.974 0-5.699-.5-8.15-1.378" />
  ),
  Accessories: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  ),
};

const CategoryCard = ({ category, index, count }) => {
  const data = categoryData[category] || categoryData.Accessories;
  const icon = categoryIcons[category] || categoryIcons.Accessories;
  const displayCount = count !== undefined ? `${count}+` : data.count;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <Link
        to={`/products?category=${category}`}
        className="group flex flex-col overflow-hidden rounded-3xl border border-border/60 hover:border-primary/20 hover:shadow-card-hover transition-all duration-400 relative h-full min-h-[220px]"
        id={`category-${category.toLowerCase()}`}
        aria-label={`Browse ${category} — ${data.count} products`}
      >
        {/* Background Image */}
        <img
          src={data.image}
          alt={category}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t ${data.color} via-black/40 to-transparent`} />
        <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/0 transition-colors duration-300" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-end flex-1 p-6">
          {/* Icon */}
          <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center text-white mb-3 group-hover:bg-gold group-hover:text-primary transition-all duration-300 border border-white/20">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              {icon}
            </svg>
          </div>

          {/* Text */}
          <h3 className="font-display text-lg font-semibold text-white leading-tight mb-1">
            {category}
          </h3>
          <p className="text-[11px] text-white/60 font-medium tracking-wide">{displayCount} items</p>

          {/* Arrow */}
          <div className="mt-3 flex items-center gap-1.5 text-gold text-xs font-semibold tracking-wide opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <span>Shop now</span>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
