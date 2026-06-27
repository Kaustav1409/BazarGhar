import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { wishlistAPI } from '../services/api';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};

export const WishlistProvider = ({ children }) => {
  // Initialize from localStorage
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem('wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [synced, setSynced] = useState(false);
  const { isAuthenticated, token } = useAuth();

  // Persist to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Sync with backend when user logs in
  const syncWithBackend = useCallback(async () => {
    if (!isAuthenticated || synced) return;
    try {
      const { data } = await wishlistAPI.get();
      const backendItems = data.items || [];
      // Merge: backend is source of truth, but add any local items not yet synced
      const localIds = wishlistItems.map(i => i._id);
      const backendIds = backendItems.map(i => i._id);
      const newLocalItems = wishlistItems.filter(i => !backendIds.includes(i._id));
      // Add new local items to backend
      for (const item of newLocalItems) {
        try { await wishlistAPI.add(item._id); } catch {}
      }
      // Fetch fresh list from backend
      const { data: fresh } = await wishlistAPI.get();
      setWishlistItems(fresh.items || []);
      setSynced(true);
    } catch {
      // Backend unavailable — keep local state
    }
  }, [isAuthenticated, synced]);

  useEffect(() => {
    if (isAuthenticated) {
      syncWithBackend();
    } else {
      setSynced(false);
    }
  }, [isAuthenticated]);

  const isWishlisted = (productId) =>
    wishlistItems.some(item => item._id === productId);

  const toggleWishlist = async (product) => {
    const already = isWishlisted(product._id);
    if (already) {
      // Remove
      setWishlistItems(prev => prev.filter(i => i._id !== product._id));
      if (isAuthenticated) {
        try { await wishlistAPI.remove(product._id); } catch {}
      }
    } else {
      // Add
      setWishlistItems(prev => [...prev, product]);
      if (isAuthenticated) {
        try { await wishlistAPI.add(product._id); } catch {}
      }
    }
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    localStorage.removeItem('wishlist');
  };

  const getWishlistCount = () => wishlistItems.length;

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      isWishlisted,
      toggleWishlist,
      clearWishlist,
      getWishlistCount,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
