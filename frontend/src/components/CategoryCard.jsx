import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import heroBannerImg from '../assets/images/hero-banner.jpg';
import techImg from '../assets/images/electronics.jpg';
import fashionImg from '../assets/images/fashion.jpg';
import groceryImg from '../assets/images/grocery.jpg';

const categoryData = {
 Electronics: {
 image: techImg,
 count: '240+',
 },
 Fashion: {
 image: fashionImg,
 count: '500+',
 },
 Books: {
 image: heroBannerImg,
 count: '300+',
 },
 Furniture: {
 image: heroBannerImg,
 count: '120+',
 },
 Lifestyle: {
 image: groceryImg,
 count: '200+',
 },
 Accessories: {
 image: fashionImg,
 count: '150+',
 },
};

const CategoryCard = ({ category, index, count }) => {
 const data = categoryData[category] || categoryData.Accessories;
 const displayCount = count !== undefined ? (count > 0 ? `${count}+` : '0') : data.count;

 return (
 <motion.div
 initial={{ opacity: 0, y: 30 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: '-40px' }}
 transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 1, 0.25, 1] }}
 className="w-full aspect-[4/5] lg:aspect-[3/4]"
 >
 <Link
 to={`/products?category=${encodeURIComponent(category)}`}
 className="group relative block w-full h-full overflow-hidden bg-surface lg:"
 aria-label={`Browse ${category} — ${displayCount} products`}
 >
 {/* Background Image */}
 <div className="absolute inset-0">
 <img
 src={data.image}
 alt={`${category} category collection`}
 loading="lazy"
 decoding="async"
 className="w-full h-full object-cover transition-transform duration-[1.5s] ease-luxury group-hover:scale-[1.02]"
 />
 {/* Subtle gradient overlay to ensure text readability */}
 <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-surface/30 to-transparent transition-opacity duration-700 group-hover:opacity-90"/>
 </div>

 {/* Content Area */}
 <div className="absolute inset-0 p-8 lg:p-10 flex flex-col justify-end">
 <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-luxury">
 <p className="text-[10px] font-bold tracking-[0.3em] text-primary/60 uppercase mb-3">
 {displayCount} Curated Items
 </p>
 <h3 className="font-heading text-3xl font-bold text-primary leading-tight">
 {category}
 </h3>
 
 {/* Animated Underline */}
 <div className="w-0 h-[1px] bg-primary/40 mt-6 group-hover:w-full transition-all duration-700 ease-luxury"/>
 </div>
 </div>
 </Link>
 </motion.div>
);
};

export default React.memo(CategoryCard);
