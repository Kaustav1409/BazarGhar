import React, { useEffect, useState, useCallback, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from './components/ErrorBoundary';
import SplashScreen from './components/SplashScreen';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import Loader from './components/Loader';
import PageWrapper from './components/PageWrapper';
import CartDrawer from './components/CartDrawer';

const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Categories = lazy(() => import('./pages/Categories'));
const About = lazy(() => import('./pages/About'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Profile = lazy(() => import('./pages/Profile'));
const OrderDetails = lazy(() => import('./pages/OrderDetails'));
const NotFound = lazy(() => import('./pages/NotFound'));

const ScrollToTop = () => {
 const { pathname, hash } = useLocation();

 useEffect(() => {
 if (hash) {
 const scroll = () => {
 const element = document.getElementById(hash.substring(1));
 if (element) {
 element.scrollIntoView({ behavior: 'smooth' });
 } else {
 setTimeout(() => {
 const el = document.getElementById(hash.substring(1));
 if (el) el.scrollIntoView({ behavior: 'smooth' });
 }, 300);
 }
 };
 requestAnimationFrame(scroll);
 } else {
 window.scrollTo(0, 0);
 }
 }, [pathname, hash]);

 return null;
};

const AnimatedRoutes = () => {
 const location = useLocation();
 const navigate = useNavigate();

 useEffect(() => {
 const handleUnauthorized = () => navigate('/login');
 window.addEventListener('auth:unauthorized', handleUnauthorized);
 return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
 }, [navigate]);

 return (
 <AnimatePresence mode="wait">
 <Routes location={location} key={location.pathname}>
 <Route path="/"element={<PageWrapper><Home /></PageWrapper>} />
 <Route path="/products"element={<PageWrapper><Products /></PageWrapper>} />
 <Route path="/categories"element={<PageWrapper><Categories /></PageWrapper>} />
 <Route path="/about"element={<PageWrapper><About /></PageWrapper>} />
 <Route path="/product/:id"element={<PageWrapper><ProductDetails /></PageWrapper>} />
 <Route path="/login"element={<PageWrapper><Login /></PageWrapper>} />
 <Route path="/register"element={<PageWrapper><Register /></PageWrapper>} />
 <Route path="/cart"element={<PageWrapper><Cart /></PageWrapper>} />
 <Route path="/checkout"element={<ProtectedRoute element={<PageWrapper><Checkout /></PageWrapper>} />} />
 <Route path="/profile"element={<ProtectedRoute element={<PageWrapper><Profile /></PageWrapper>} />} />
 <Route path="/order/:id"element={<ProtectedRoute element={<PageWrapper><OrderDetails /></PageWrapper>} />} />
 <Route path="*"element={<PageWrapper><NotFound /></PageWrapper>} />
 </Routes>
 </AnimatePresence>
);
};

function App() {
 const [showSplash, setShowSplash] = useState(true);

 const handleSplashFinish = useCallback(() => {
 setShowSplash(false);
 }, []);

 return (
 <HelmetProvider>
 <ErrorBoundary>
 <AuthProvider>
 <CartProvider>
 <WishlistProvider>
 {showSplash && <SplashScreen onFinish={handleSplashFinish} />}

 <Router>
 <ScrollToTop />
 <Toaster position="top-center"/>
 <Navbar />
 <main className="min-h-screen">
 <AnimatedRoutes />
 </main>
 <Footer />
 <CartDrawer />
 </Router>
 </WishlistProvider>
 </CartProvider>
 </AuthProvider>
 </ErrorBoundary>
 </HelmetProvider>
);
}

export default App;
