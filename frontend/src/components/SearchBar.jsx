import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-0 max-w-xl mx-auto">
      <div className="relative flex-1">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-grey-dark">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products..."
          className="w-full pl-11 pr-4 py-3.5 bg-white border border-grey rounded-l-xl text-sm text-charcoal placeholder:text-grey-dark outline-none transition-all duration-200 focus:border-blue focus:ring-2 focus:ring-blue/8"
          id="search-input"
        />
      </div>
      <button
        type="submit"
        id="search-submit"
        className="px-6 py-3.5 bg-blue text-white text-sm font-medium rounded-r-xl hover:bg-charcoal transition-colors duration-200"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
