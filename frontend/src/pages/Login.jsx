import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.login(form);
      login(data);
      toast.success('Welcome back!', {
        style: { background: '#1E1E1E', color: '#fff', borderRadius: '12px' },
        iconTheme: { primary: '#2F80ED', secondary: '#1E1E1E' },
      });
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password', {
        style: { background: '#1E1E1E', color: '#fff', borderRadius: '12px' },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" id="main-content">
      {/* ── Left Brand Panel ─────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-charcoal">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=70"
          alt=""
          role="presentation"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal/90 via-charcoal/70 to-ink/80" aria-hidden="true" />
        {/* Blue blob */}
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue/10 rounded-full blur-[80px]" aria-hidden="true" />
        <div className="absolute top-20 -left-10 w-40 h-40 bg-blue/5 rounded-full blur-[60px]" aria-hidden="true" />

        <div className="relative z-10 flex flex-col justify-between p-14 w-full">
          {/* Brand */}
          <Link to="/" className="flex flex-col leading-none w-fit" aria-label="BazarGhar homepage">
            <span className="font-display text-3xl font-semibold text-white tracking-tight">BazarGhar</span>
            <span className="text-[10px] tracking-[0.22em] text-white/30 uppercase mt-0.5">Har Zaroorat Ek Jagah</span>
          </Link>

          {/* Main content */}
          <div>
            <div className="w-10 h-0.5 bg-blue mb-8" aria-hidden="true" />
            <h2 className="font-display text-5xl font-semibold text-white leading-tight tracking-tight mb-5">
              Welcome<br />back.
            </h2>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Sign in to access your orders, wishlist, and personalized recommendations.
            </p>

            {/* Feature list */}
            <ul className="mt-10 space-y-4">
              {['Curated product collection', 'Secure & fast checkout', 'Easy returns & 24/7 support'].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-white/50">
                  <div className="w-5 h-5 bg-blue/20 rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <svg className="w-3 h-3 text-blue" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Testimonial */}
          <div className="bg-white/6 border border-white/10 rounded-2xl p-6">
            <div className="flex gap-1 mb-3" aria-label="5 stars">
              {[1,2,3,4,5].map(s => <svg key={s} className="w-4 h-4 text-blue" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
            </div>
            <p className="text-white/60 text-sm italic leading-relaxed">"BazarGhar is my favourite place to shop. Quality products, fast delivery, and flawless service every time."</p>
            <p className="text-white/35 text-xs mt-3 font-semibold">— Ananya Singh, Mumbai</p>
          </div>
        </div>
      </div>

      {/* ── Right: Form ───────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-16 bg-surface">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile brand header */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="font-display text-3xl font-semibold text-charcoal">BazarGhar</Link>
          </div>

          <h1 className="font-display text-3xl font-semibold text-charcoal mb-2">Sign In</h1>
          <p className="text-grey-dark text-sm mb-8">Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-charcoal hover:text-blue transition-colors">
              Create one free
            </Link>
          </p>

          {/* Social Sign In placeholder */}
          <button
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 border border-grey bg-white rounded-xl text-sm font-medium text-ink hover:border-charcoal/30 hover:shadow-sm transition-all mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal/30"
            type="button"
            id="google-signin-btn"
            aria-label="Continue with Google (coming soon)"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
            <span className="ml-auto text-[10px] text-grey-dark font-medium bg-grey/50 px-2 py-0.5 rounded-full">Soon</span>
          </button>

          <div className="relative flex items-center gap-4 mb-6" role="separator" aria-label="Or sign in with email">
            <div className="flex-1 h-px bg-grey" aria-hidden="true" />
            <span className="text-xs text-grey-dark font-medium tracking-wide">or continue with email</span>
            <div className="flex-1 h-px bg-grey" aria-hidden="true" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate aria-label="Sign in form">
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-xs font-bold text-grey-dark tracking-wide uppercase mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-grey-dark" aria-hidden="true">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                </div>
                <input
                  id="login-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="input-field pl-11"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="text-xs font-bold text-grey-dark tracking-wide uppercase">Password</label>
                <a href="#" className="text-xs font-semibold text-blue hover:text-blue-hover transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-grey-dark" aria-hidden="true">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Your password"
                  className="input-field pl-11 pr-12"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-grey-dark hover:text-charcoal transition-colors focus-visible:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                  ) : (
                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={!loading ? { scale: 0.98 } : {}}
              id="login-submit-btn"
              className={`btn-primary w-full py-4 text-sm mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              aria-busy={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    aria-hidden="true"
                  />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </motion.button>
          </form>

          <p className="text-center mt-6 text-xs text-grey-dark">
            New to BazarGhar?{' '}
            <Link to="/register" className="font-bold text-charcoal hover:text-blue transition-colors">Create an account →</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
