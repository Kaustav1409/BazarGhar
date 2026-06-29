import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
 { level: 1, label: 'Weak', color: 'bg-red-500', text: 'text-red-500' },
 { level: 2, label: 'Fair', color: 'bg-amber-500', text: 'text-amber-500' },
 { level: 3, label: 'Good', color: 'bg-blue', text: 'text-blue' },
 { level: 4, label: 'Strong', color: 'bg-green', text: 'text-green' },
 ];
 return levels[Math.min(score, 4) - 1] || { level: 0, label: '', color: '', text: '' };
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
 toast.success('Account created successfully.', {
 style: { 
 background: 'rgba(255, 255, 255, 0.05)', 
 backdropFilter: 'blur(10px)',
 border: '1px solid rgba(255, 255, 255, 0.1)',
 color: '#fff', 
 borderRadius: '16px',
 boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
 },
 iconTheme: { primary: '#fff', secondary: '#000' },
 duration: 4000,
 });
 navigate('/');
 } catch (err) {
 toast.error(err.response?.data?.message || 'Registration failed. Please verify your details.', {
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
 className="w-full max-w-[440px] px-6 relative z-10 py-12"
 >
 <div className="bg-primary/5 backdrop-blur-xl border border-primary/30 p-8 sm:p-12 rounded-[2rem] shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)]">
 
 <div className="text-center mb-10">
 <Link to="/"className="inline-block focus-visible:outline-none">
 <span className="font-heading text-3xl font-bold text-primary tracking-tighter">BazarGhar.</span>
 </Link>
 <h1 className="font-heading text-2xl font-bold text-primary mt-6 mb-2">Create Account</h1>
 <p className="text-primary/70 text-[13px] font-medium">Join our premium community</p>
 </div>

 <form onSubmit={handleSubmit} className="space-y-4"noValidate>
 
 {/* Name Input */}
 <div className="relative">
 <input
 id="reg-name"
 type="text"
 value={form.name}
 onChange={(e) => setForm({ ...form, name: e.target.value })}
 className="input-base"
 placeholder="Full Name"
 required
 autoComplete="name"
 />
 <label 
 htmlFor="reg-name"
 className="absolute left-5 top-2 text-[10px] font-bold tracking-widest text-primary/60 uppercase transition-all peer-placeholder-shown:text-[13px] peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:text-[10px] peer-focus:top-2 peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-primary/70 pointer-events-none"
 >
 Full Name
 </label>
 </div>

 {/* Email Input */}
 <div className="relative">
 <input
 id="reg-email"
 type="email"
 value={form.email}
 onChange={(e) => setForm({ ...form, email: e.target.value })}
 className="input-base"
 placeholder="Email Address"
 required
 autoComplete="email"
 />
 <label 
 htmlFor="reg-email"
 className="absolute left-5 top-2 text-[10px] font-bold tracking-widest text-primary/60 uppercase transition-all peer-placeholder-shown:text-[13px] peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:text-[10px] peer-focus:top-2 peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-primary/70 pointer-events-none"
 >
 Email Address
 </label>
 </div>

 {/* Phone Input */}
 <div className="relative">
 <input
 id="reg-phone"
 type="tel"
 value={form.phone}
 onChange={(e) => setForm({ ...form, phone: e.target.value })}
 className="input-base"
 placeholder="Phone (Optional)"
 autoComplete="tel"
 />
 <label 
 htmlFor="reg-phone"
 className="absolute left-5 top-2 text-[10px] font-bold tracking-widest text-primary/60 uppercase transition-all peer-placeholder-shown:text-[13px] peer-placeholder-shown:top-4 peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:text-[10px] peer-focus:top-2 peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-primary/70 pointer-events-none"
 >
 Phone <span className="normal-case tracking-normal opacity-50">(Optional)</span>
 </label>
 </div>

 {/* Password Input */}
 <div className="relative">
 <input
 id="reg-password"
 type={showPassword ? 'text' : 'password'}
 value={form.password}
 onChange={(e) => setForm({ ...form, password: e.target.value })}
 className="input-base pr-12"
 placeholder="Password"
 required
 autoComplete="new-password"
 />
 <label 
 htmlFor="reg-password"
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

 {/* Premium Password Strength */}
 <AnimatePresence>
 {form.password.length > 0 && (
 <motion.div 
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: 'auto' }}
 exit={{ opacity: 0, height: 0 }}
 className="px-2 pt-2 pb-4 overflow-hidden"
 >
 <div className="flex gap-1.5 mb-2.5">
 {[1, 2, 3, 4].map((lvl) => (
 <div
 key={lvl}
 className={`h-1 flex-1 rounded-full transition-all duration-500 ${
 lvl <= (strength.level || 0) ? strength.color : 'bg-primary/10'
 }`}
 aria-hidden="true"
 />
))}
 </div>
 <div className="flex items-center justify-between">
 <p className={`text-[10px] font-bold tracking-widest uppercase transition-colors duration-300 ${strength.text || 'text-primary/70'}`}>
 {strength.label ? `${strength.label} Security` : 'Checking...'}
 </p>
 <p className="text-[10px] text-primary/70 font-medium">8+ characters, 1 number</p>
 </div>
 </motion.div>
)}
 </AnimatePresence>

 <motion.button
 type="submit"
 disabled={loading}
 whileTap={!loading ? { scale: 0.98 } : {}}
 id="register-submit-btn"
 className={`w-full bg-primary text-surface py-4 rounded-2xl text-[12px] font-bold tracking-[0.2em] uppercase transition-all mt-4 ${loading ? 'opacity-80 cursor-not-allowed' : 'hover:bg-primary/90 shadow-[0_0_20px_rgba(255,255,255,0.2)]'}`}
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
 Creating...
 </span>
) : 'Register'}
 </motion.button>
 </form>

 <p className="text-center mt-8 text-[12px] font-medium text-primary/60">
 Already a member?{' '}
 <Link to="/login"className="text-primary hover:text-primary/80 transition-colors font-bold border-b border-primary/30 pb-0.5">Sign in</Link>
 </p>

 <p className="text-center mt-6 text-[10px] text-primary/70">
 By registering, you agree to our <a href="#"className="underline hover:text-primary/70">Terms</a> and <a href="#"className="underline hover:text-primary/70">Privacy</a>.
 </p>
 </div>
 </motion.div>
 </div>
);
};

export default Register;
