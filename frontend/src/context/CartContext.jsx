import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
 const context = useContext(CartContext);
 if (!context) throw new Error('useCart must be used within CartProvider');
 return context;
};

export const CartProvider = ({ children }) => {
 const [isCartOpen, setIsCartOpen] = useState(false);
 const [cartItems, setCartItems] = useState(() => {
 try {
 const saved = localStorage.getItem('cart');
 return saved ? JSON.parse(saved) : [];
 } catch {
 return [];
 }
 });

 // Persist cart to localStorage
 useEffect(() => {
 localStorage.setItem('cart', JSON.stringify(cartItems));
 }, [cartItems]);

 const addToCart = (product, qty = 1) => {
 setCartItems((prev) => {
 const existing = prev.find((item) => item._id === product._id);
 if (existing) {
 return prev.map((item) =>
 item._id === product._id
 ? { ...item, quantity: item.quantity + qty }
 : item
);
 }
 return [...prev, { ...product, quantity: qty }];
 });
 setIsCartOpen(true); // Open drawer on add
 };

 const removeFromCart = (productId) => {
 setCartItems((prev) => prev.filter((item) => item._id !== productId));
 };

 const updateQuantity = (productId, quantity) => {
 if (quantity < 1) {
 removeFromCart(productId);
 return;
 }
 setCartItems((prev) =>
 prev.map((item) =>
 item._id === productId ? { ...item, quantity } : item
)
);
 };

 const clearCart = () => setCartItems([]);

 const getItemCount = () => (cartItems || []).reduce((sum, item) => sum + (item?.quantity || 1), 0);

 const getTotalPrice = () =>
 (cartItems || []).reduce((total, item) => total + (item?.price || 0) * (item?.quantity || 1), 0);

 const isInCart = (productId) => cartItems.some((item) => item._id === productId);

 return (
 <CartContext.Provider
 value={{
 cartItems,
 addToCart,
 removeFromCart,
 updateQuantity,
 clearCart,
 getItemCount,
 getTotalPrice,
 isInCart,
 isCartOpen,
 setIsCartOpen,
 openCart: () => setIsCartOpen(true),
 closeCart: () => setIsCartOpen(false)
 }}
 >
 {children}
 </CartContext.Provider>
);
};

export default CartContext;
