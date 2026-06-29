import React, { useEffect, useState } from 'react';
import CategoryCard from '../components/CategoryCard';
import { productAPI } from '../services/api';
import SEO from '../components/SEO';

const CATEGORIES = ['Electronics', 'Fashion', 'Books', 'Furniture', 'Lifestyle', 'Accessories'];

const Categories = () => {
 const [categoryCounts, setCategoryCounts] = useState({});

 useEffect(() => {
 const fetchData = async () => {
 try {
 const countsRes = await productAPI.getCategoryCounts().catch(() => ({ data: {} }));
 setCategoryCounts(countsRes.data || {});
 } catch (err) {
 // Silently handle
 }
 };
 fetchData();
 }, []);

 return (
 <div className="min-h-screen pt-24 lg:pt-32 pb-32 bg-surface"id="main-content">
 <SEO title="Categories"description="Explore all categories at BazarGhar."/>
 <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
 <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 lg:mb-24 gap-6">
 <div>
 <p className="label-editorial text-secondary mb-4">Shop By Category</p>
 <h1 className="font-heading text-4xl lg:text-5xl font-bold text-primary tracking-tight">All Collections</h1>
 </div>
 </div>
 
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
 {CATEGORIES.map((cat, i) => (
 <CategoryCard key={cat} category={cat} index={i} count={categoryCounts[cat]} />
))}
 </div>
 </div>
 </div>
);
};

export default Categories;
