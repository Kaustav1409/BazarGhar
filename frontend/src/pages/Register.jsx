import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const getPasswordStrength = (password) => {
  if (!password) return { level: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  const levels = [
    { level: 1, label: 'Weak', color: 'bg-red-400' },
    { level: 2, label: 'Fair', color: 'bg-amber-400' },
    { level: 3, label: 'Good', color: 'bg-blue-400' },
    { level: 4, label: 'Strong', color: 'bg-emerald-400' },
  ];
  return levels[Math.min(score, 4) - 1] || { level: 0, label: '', color: '' };
};

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const strength = getPasswordStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.register(form);
      login(data);
      toast.success('Account created! Welcome to BazarGhar 🎉', {
        style: { background: '#111827', color: '#fff', borderRadius: '12px' },
        iconTheme: { primary: '#D4AF37', secondary: '#111827' },
        duration: 4000,
      });
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.', {
        style: { background: '#111827', color: '#fff', borderRadius: '12px' },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" id="main-content">
      {/* ── Left Brand Panel ─────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary">
        <img
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop&q=80"
          alt="BazarGhar Fashion"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-ink/80" aria-hidden="true" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gold/10 rounded-full blur-[80px]" aria-hidden="true" />

        <div className="relative z-10 flex flex-col justify-between p-14 w-full">
          <Link to="/" className="flex flex-col leading-none w-fit" aria-label="BazarGhar homepage">
            <span className="font-display text-3xl font-semibold text-white tracking-tight">BazarGhar</span>
            <span className="text-[10px] tracking-[0.22em] text-white/30 uppercase mt-0.5">Har Zaroorat Ek Jagah</span>
          </Link>

          <div>
            <div className="w-10 h-0.5 bg-gold mb-8" aria-hidden="true" />
            <h2 className="font-display text-5xl font-semibold text-white leading-tight tracking-tight mb-5">
              Join<br />BazarGhar.
            </h2>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Create your account and unlock access to premium curated products, exclusive offers, and seamless order tracking.
            </p>

            <ul className="mt-10 space-y-4">
              {[
                'Free account, forever',
                'Exclusive early access to deals',
                'Track orders in real-time',
                'One-click reorder',
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-white/50">
                  <div className="w-5 h-5 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <svg className="w-3 h-3 text-gold" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[{ val: '50K+', label: 'Members' }, { val: '2K+', label: 'Products' }, { val: '4.9★', label: 'Rating' }].map((s) => (
              <div key={s.label} className="bg-white/6 border border-white/8 rounded-xl p-4 text-center">
                <p className="font-display text-2xl font-semibold text-white">{s.val}</p>
                <p className="text-[11px] text-white/30 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Form ───────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-16 bg-cream">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile brand header */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="font-display text-3xl font-semibold text-primary">BazarGhar</Link>
          </div>

          <h1 className="font-display text-3xl font-semibold text-primary mb-2">Create Account</h1>
          <p className="text-muted text-sm mb-8">
            Already a member?{' '}
            <Link to="/login" className="font-semibold text-primary hover:text-gold transition-colors">Sign in instead</Link>
          </p>

          {/* Google placeholder */}
          <button
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 border border-border bg-white rounded-xl text-sm font-medium text-ink hover:border-primary/30 hover:shadow-soft transition-all mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            type="button"
            id="google-register-btn"
            aria-label="Register with Google (coming soon)"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Register with Google
            <span className="ml-auto text-[10px] text-muted font-medium bg-border/50 px-2 py-0.5 rounded-full">Soon</span>
          </button>

          <div className="relative flex items-center gap-4 mb-6" role="separator">
            <div className="flex-1 h-px bg-border" aria-hidden="true" />
            <span className="text-xs text-muted font-medium tracking-wide">or register with email</span>
            <div className="flex-1 h-px bg-border" aria-hidden="true" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate aria-label="Create account form">
            {/* Full Name */}
            <div>
              <label htmlFor="reg-name" className="block text-xs font-bold text-muted tracking-wide uppercase mb-1.5">Full Name</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                </div>
                <input id="reg-name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" className="input-field pl-11" required autoComplete="name" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="block text-xs font-bold text-muted tracking-wide uppercase mb-1.5">Email Address</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                </div>
                <input id="reg-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="input-field pl-11" required autoComplete="email" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="reg-phone" className="block text-xs font-bold text-muted tracking-wide uppercase mb-1.5">Phone <span className="text-muted font-normal normal-case tracking-normal">(optional)</span></label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                </div>
                <input id="reg-phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="9876543210" className="input-field pl-11" autoComplete="tel" />
              </div>
            </div>

            {/* Password + Strength */}
            <div>
              <label htmlFor="reg-password" className="block text-xs font-bold text-muted tracking-wide uppercase mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden="true">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                </div>
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="At least 8 characters"
                  className="input-field pl-11 pr-12"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors focus-visible:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                  ) : (
                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {form.password && (
                <div className="mt-2.5">
                  <div className="flex gap-1 mb-1.5" aria-label={`Password strength: ${strength.label}`}>
                    {[1, 2, 3, 4].map((lvl) => (
                      <div
                        key={lvl}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          lvl <= (strength.level || 0) ? strength.color : 'bg-border'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  {strength.label && (
                    <p className={`text-xs font-semibold ${
                      strength.level === 4 ? 'text-emerald-600' :
                      strength.level === 3 ? 'text-blue-600' :
                      strength.level === 2 ? 'text-amber-600' : 'text-red-500'
                    }`}>
                      {strength.label} password
                    </p>
                  )}
                </div>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={!loading ? { scale: 0.98 } : {}}
              id="register-submit-btn"
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
                  Creating Account...
                </span>
              ) : 'Create Free Account'}
            </motion.button>

            <p className="text-center text-[11px] text-muted mt-2">
              By registering, you agree to our{' '}
              <a href="#" className="underline hover:text-primary transition-colors">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="underline hover:text-primary transition-colors">Privacy Policy</a>.
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
