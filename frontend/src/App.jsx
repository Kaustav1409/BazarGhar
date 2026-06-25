import React, { useEffect, useState, useCallback, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import SplashScreen from './components/SplashScreen';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Loader from './components/Loader';

const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));
import CartDrawer from './components/CartDrawer';
import { useAuth } from './context/AuthContext';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  
  useEffect(() => {
    if (hash) {
      // Use timeout to ensure the DOM element is rendered before scrolling,
      // especially when navigating from a different page.
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  
  return null;
};

function App() {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('splashShown');
  });

  const handleSplashFinish = useCallback(() => {
    sessionStorage.setItem('splashShown', 'true');
    setShowSplash(false);
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        {/* Splash screen — shown once on app load */}
        <AnimatePresence>
          {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
        </AnimatePresence>

        <Router>
          <ScrollToTop />
          <Toaster position="top-center" />
          <Navbar />
          <main className="min-h-screen">
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<ProtectedRoute element={<Checkout />} />} />
                <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <CartDrawer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
