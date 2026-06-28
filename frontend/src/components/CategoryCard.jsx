import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const categoryData = {
  Electronics: {
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop&q=80',
    count: '240+',
  },
  Fashion: {
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80',
    count: '500+',
  },
  Books: {
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&auto=format&fit=crop&q=80',
    count: '300+',
  },
  Furniture: {
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80',
    count: '120+',
  },
  Lifestyle: {
    image: 'https://images.unsplash.com/photo-1515378960530-7c0da6229674?w=600&auto=format&fit=crop&q=80',
    count: '200+',
  },
  Accessories: {
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    count: '150+',
  },
};

const CategoryCard = ({ category, index, count }) => {
  const data = categoryData[category] || categoryData.Accessories;
  const displayCount = count !== undefined ? `${count}+` : data.count;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="h-[400px] lg:h-[480px]"
    >
      <Link
        to={`/products?category=${category}`}
        className="group relative block w-full h-full overflow-hidden bg-surface"
        aria-label={`Browse ${category} — ${data.count} products`}
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={data.image}
            alt={`${category} category collection`}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-[2s] ease-[0.16,1,0.3,1] group-hover:scale-110"
          />
          {/* Subtle gradient overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent transition-opacity duration-700 group-hover:opacity-90" />
        </div>

        {/* Content Area */}
        <div className="absolute inset-0 p-8 lg:p-10 flex flex-col justify-end">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-[0.16,1,0.3,1]">
            <p className="text-[10px] font-bold tracking-[0.3em] text-surface-white/60 uppercase mb-3">
              {displayCount} Curated Items
            </p>
            <h3 className="font-heading text-3xl font-bold text-surface-white leading-tight">
              {category}
            </h3>
            
            {/* Animated Underline */}
            <div className="w-0 h-[1px] bg-surface-white/40 mt-6 group-hover:w-full transition-all duration-700 ease-[0.16,1,0.3,1]" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default React.memo(CategoryCard);
