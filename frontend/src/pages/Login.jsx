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
 toast.success('Welcome back to BazarGhar.', {
 style: { 
 background: 'rgba(255, 255, 255, 0.05)', 
 backdropFilter: 'blur(10px)',
 border: '1px solid rgba(255, 255, 255, 0.1)',
 color: '#fff', 
 borderRadius: '16px',
 boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
 },
 iconTheme: { primary: '#fff', secondary: '#000' },
 });
 navigate('/');
 } catch (err) {
 toast.error(err.response?.data?.message || 'Authentication failed. Please check your credentials.', {
 style: { 
 background: 'rgba(20, 20, 20, 0.8)', 
 backdropFilter: 'blur(10px)',
 border: '1px solid rgba(255, 50, 50, 0.2)',
 color: '#fff', 
 borderRadius: '16px',
 },
 iconTheme: { primary: '#ff4b4b', secondary: '#fff' },
 });
 } finally {
 setLoading(false);
 }
 };

 return (
 <div className="min-h-screen flex items-center justify-center bg-surface relative overflow-hidden"id="main-content">
 
 {/* ── Premium Background Ambient Glow ─────────────────────── */}
 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none"aria-hidden="true"/>
 <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[100px] pointer-events-none"aria-hidden="true"/>
 <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] pointer-events-none"aria-hidden="true"/>

 {/* ── Centered Card ───────────────────────────── */}
 <motion.div
 initial={{ opacity: 0, scale: 0.95, y: 10 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
 className="w-full max-w-[440px] px-6 relative z-10"
 >
 <div className="bg-primary/5 backdrop-blur-xl border border-primary/30 p-8 sm:p-12 rounded-[2rem] shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)]">
 
 <div className="text-center mb-10">
 <Link to="/"className="inline-block focus-visible:outline-none">
 <span className="font-heading text-3xl font-bold text-primary tracking-tighter">BazarGhar.</span>
 </Link>
 <h1 className="font-heading text-2xl font-bold text-primary mt-6 mb-2">Welcome back</h1>
 <p className="text-primary/70 text-[13px] font-medium">Enter your credentials to continue</p>
 </div>

 {/* Social Sign In */}
 <button
 className="btn-outline w-full mb-8 group"
 type="button"
 id="google-signin-btn"
 >
 <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300"viewBox="0 0 24 24"aria-hidden="true">
 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"fill="currentColor"/>
 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"fill="currentColor"/>
 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"fill="currentColor"/>
 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"fill="currentColor"/>
 </svg>
 Continue with Google
 </button>

 <div className="relative flex items-center gap-4 mb-8">
 <div className="flex-1 h-px bg-primary/10"aria-hidden="true"/>
 <span className="text-[10px] uppercase tracking-widest text-primary/70 font-bold">Or Email</span>
 <div className="flex-1 h-px bg-primary/10"aria-hidden="true"/>
 </div>

 <form onSubmit={handleSubmit} className="space-y-5"noValidate>
 
 {/* Email Input (Floating Label) */}
 <div className="relative">
 <input
 id="login-email"
 type="email"
 value={form.email}
 onChange={(e) => setForm({ ...form, email: e.target.value })}
 className="input-base"
 placeholder="Email Address"
 required
 autoComplete="email"
 />
 <label 
 htmlFor="login-email"
 className="absolute left-5 top-2 text-[10px] font-bold tracking-widest text-primary/60 uppercase transition-all peer-placeholder-shown:text-[13px] peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:text-[10px] peer-focus:top-2 peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-primary/70 pointer-events-none"
 >
 Email Address
 </label>
 </div>

 {/* Password Input (Floating Label) */}
 <div className="relative">
 <input
 id="login-password"
 type={showPassword ? 'text' : 'password'}
 value={form.password}
 onChange={(e) => setForm({ ...form, password: e.target.value })}
 className="input-base pr-12"
 placeholder="Password"
 required
 autoComplete="current-password"
 />
 <label 
 htmlFor="login-password"
 className="absolute left-5 top-2 text-[10px] font-bold tracking-widest text-primary/60 uppercase transition-all peer-placeholder-shown:text-[13px] peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:text-[10px] peer-focus:top-2 peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-primary/70 pointer-events-none"
 >
 Password
 </label>
 
 <button
 type="button"
 onClick={() => setShowPassword(!showPassword)}
 className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/70 hover:text-primary transition-colors focus-visible:outline-none"
 aria-label={showPassword ? 'Hide password' : 'Show password'}
 >
 {showPassword ? (
 <svg className="w-5 h-5"fill="none"viewBox="0 0 24 24"strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round"strokeLinejoin="round"d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>
) : (
 <svg className="w-5 h-5"fill="none"viewBox="0 0 24 24"strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round"strokeLinejoin="round"d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path strokeLinecap="round"strokeLinejoin="round"d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
)}
 </button>
 </div>

 <div className="flex justify-end pb-2">
 <a href="#"className="text-[11px] font-bold tracking-widest text-primary/70 hover:text-primary transition-colors uppercase">Forgot Password?</a>
 </div>

 <motion.button
 type="submit"
 disabled={loading}
 whileTap={!loading ? { scale: 0.98 } : {}}
 id="login-submit-btn"
 className={`btn-primary w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
 aria-busy={loading}
 >
 {loading ? (
 <span className="flex items-center justify-center gap-2">
 <motion.div
 className="w-4 h-4 border-2 border-surface/20 border-t-surface rounded-full"
 animate={{ rotate: 360 }}
 transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
 aria-hidden="true"
 />
 Authenticating...
 </span>
) : 'Sign In'}
 </motion.button>
 </form>

 <p className="text-center mt-8 text-[12px] font-medium text-primary/60">
 Don't have an account?{' '}
 <Link to="/register"className="text-primary hover:text-primary/80 transition-colors font-bold border-b border-primary/30 pb-0.5">Create one</Link>
 </p>
 </div>
 
 {/* Decorative elements */}
 <div className="absolute top-1/2 left-0 -translate-x-12 w-24 h-px bg-gradient-to-r from-transparent to-primary/20"/>
 <div className="absolute top-1/2 right-0 translate-x-12 w-24 h-px bg-gradient-to-l from-transparent to-primary/20"/>
 </motion.div>
 </div>
);
};

export default Login;
