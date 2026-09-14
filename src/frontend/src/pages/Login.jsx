import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Truck,
  ShieldCheck,
  Cpu,
  Snowflake,
  Brain,
  TrendingUp,
  AlertTriangle,
  Thermometer,
  Check,
  ArrowRight
} from 'lucide-react';
import { authService } from '../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // UI State
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginNotice, setLoginNotice] = useState(location.state?.message || null);

  // Validation Handler
  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    setLoginNotice(null);

    try {
      const result = await authService.login({ email, password, rememberMe });
      if (result.success) {
        if (result.isMock) {
          setLoginNotice('Signed in with Demo Credentials. Redirecting...');
        }
        setTimeout(() => {
          navigate('/dashboard');
        }, 600);
      }
    } catch (err) {
      setErrors({ submit: err.message || 'Login failed. Please check your credentials.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setLoginNotice('Google OAuth provider integration prepared for backend connection.');
    setTimeout(() => setLoginNotice(null), 4000);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setLoginNotice('Password reset instruction sent to registered email address if account exists.');
    setTimeout(() => setLoginNotice(null), 4000);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-900 overflow-x-hidden font-sans">
      {/* ========================================================================= */}
      {/* LEFT PANEL: 58% DESKTOP WIDTH — BRANDING & SUPPLY CHAIN VISUAL */}
      {/* ========================================================================= */}
      <div className="relative lg:w-[58%] w-full min-h-[480px] lg:min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-hidden select-none">
        
        {/* Background Image & Ambient Gradients */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url('/assets/supply-bg.jpg')` }}
        />
        {/* Rich Blue/Green Gradient Overlay matching reference image */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#061826]/90 via-[#0B253A]/75 to-[#0D4B66]/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.25),transparent_60%)]" />

        {/* Global Route Line Accents (SVG Overlay) */}
        <svg className="absolute inset-0 w-full h-full opacity-35 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 100 200 Q 300 150 500 280 T 900 220" fill="none" stroke="url(#routeGrad1)" strokeWidth="2" strokeDasharray="6 6" />
          <path d="M 200 450 Q 450 350 700 480" fill="none" stroke="url(#routeGrad2)" strokeWidth="1.5" strokeDasharray="4 4" />
          <defs>
            <linearGradient id="routeGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="routeGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>

        {/* ----------------------------------------------------------------------- */}
        {/* TOP BRANDING AREA */}
        {/* ----------------------------------------------------------------------- */}
        <div className="relative z-10 space-y-4 max-w-xl animate-float-slow">
          <div className="flex items-center space-x-4">
            <img 
              src="/assets/supplyguard-logo.png" 
              alt="SupplyGuard AI Logo" 
              className="h-16 sm:h-20 w-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]" 
            />
          </div>
          <div>
            <p className="text-emerald-400 font-semibold text-lg sm:text-xl tracking-tight font-heading">
              Smarter Supply Chains. A Safer Tomorrow.
            </p>
            <p className="text-slate-200 text-sm sm:text-base mt-2 font-normal leading-relaxed text-shadow-sm max-w-md">
              AI-powered insights for resilient supply chains, optimized fleet operations and safer cargo.
            </p>
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* BOTTOM FEATURE HIGHLIGHT ROW */}
        {/* ----------------------------------------------------------------------- */}
        <div className="relative z-10 pt-6 border-t border-white/15">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
            
            {/* Feature 1 */}
            <div className="flex flex-col items-center space-y-1.5 group">
              <div className="p-2.5 rounded-xl bg-white/10 text-white group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-xs text-slate-200 font-medium leading-tight">
                Track<br />Shipments
              </span>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center space-y-1.5 group border-l border-white/10 pl-2 sm:pl-0 sm:border-l-0">
              <div className="p-2.5 rounded-xl bg-white/10 text-white group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xs text-slate-200 font-medium leading-tight">
                Handle<br />Disruptions
              </span>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center space-y-1.5 group border-t sm:border-t-0 pt-2 sm:pt-0">
              <div className="p-2.5 rounded-xl bg-white/10 text-white group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-xs text-slate-200 font-medium leading-tight">
                Optimize<br />Fleet
              </span>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-center space-y-1.5 group border-l border-white/10 pl-2 sm:pl-0 border-t sm:border-t-0 pt-2 sm:pt-0">
              <div className="p-2.5 rounded-xl bg-white/10 text-white group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors">
                <Snowflake className="w-5 h-5" />
              </div>
              <span className="text-xs text-slate-200 font-medium leading-tight">
                Monitor<br />Cold Chain
              </span>
            </div>

            {/* Feature 5 */}
            <div className="col-span-2 sm:col-span-1 flex flex-col items-center space-y-1.5 group border-t sm:border-t-0 pt-2 sm:pt-0">
              <div className="p-2.5 rounded-xl bg-white/10 text-emerald-400 group-hover:bg-emerald-500/30 transition-colors">
                <Brain className="w-5 h-5" />
              </div>
              <span className="text-xs text-slate-200 font-medium leading-tight">
                AI-Powered<br /><span className="text-emerald-400 font-semibold">with IBM Bob</span>
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* RIGHT PANEL: 42% DESKTOP WIDTH — LIGHT CLEAN FORM SECTION */}
      {/* ========================================================================= */}
      <div className="relative lg:w-[42%] w-full bg-slate-50 flex flex-col justify-between p-6 sm:p-12 lg:p-16 min-h-screen">
        
        {/* Subtle Decorative Background Shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

        {/* Decorative Green Leaf Graphic (Bottom Right matching reference image) */}
        <div className="absolute bottom-4 right-4 opacity-75 pointer-events-none">
          <svg className="w-16 h-16 text-emerald-500/40" viewBox="0 0 100 100" fill="currentColor">
            <path d="M 20 80 Q 20 20 80 20 Q 80 80 20 80 Z" />
            <path d="M 30 70 Q 50 30 70 30" fill="none" stroke="currentColor" strokeWidth="4" />
          </svg>
        </div>

        {/* Top Spacer / Optional header */}
        <div className="w-full" />

        {/* Form Container (Max 480px width) */}
        <div className="relative z-10 w-full max-w-md mx-auto my-auto space-y-8">
          
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B192C] font-heading tracking-tight">
              Welcome Back
            </h1>
            <p className="text-slate-500 text-sm sm:text-base font-normal">
              Sign in to your SupplyGuard AI account
            </p>
          </div>

          {/* Toast / Notification Banner */}
          {loginNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium flex items-center space-x-2 animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{loginNotice}</span>
            </div>
          )}

          {errors.submit && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-medium flex items-center space-x-2 animate-fadeIn">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errors.submit}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email-input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className={`w-full pl-11 pr-4 py-3.5 bg-white border ${
                    errors.email ? 'border-rose-400 focus:ring-rose-500/20' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                  } rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-4 transition-all shadow-sm`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-500 font-medium pt-0.5">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="password-input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className={`w-full pl-11 pr-11 py-3.5 bg-white border ${
                    errors.password ? 'border-rose-400 focus:ring-rose-500/20' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                  } rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-4 transition-all shadow-sm`}
                />
                {/* Show / Hide Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-500 font-medium pt-0.5">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm pt-1">
              <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-slate-600 font-medium text-xs sm:text-sm">Remember me</span>
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs sm:text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors focus:outline-none underline-offset-4 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-xl text-white font-semibold text-base bg-gradient-to-r from-[#22c55e] via-[#10b981] to-[#0284c7] hover:from-[#16a34a] hover:to-[#0369a1] active:scale-[0.99] transition-all duration-200 shadow-md shadow-emerald-500/20 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed group cursor-pointer"
            >
              <span>{loading ? 'Signing in...' : 'Login'}</span>
              {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>

          </form>

          {/* OR Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="w-full border-t border-slate-200" />
            <span className="absolute bg-slate-50 px-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">
              OR
            </span>
          </div>

          {/* Continue with Google Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full py-3.5 px-4 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center space-x-3 cursor-pointer"
          >
            {/* Google Multi-colored G Logo */}
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Registration Prompt */}
          <div className="text-center pt-2">
            <p className="text-xs sm:text-sm text-slate-500">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="font-semibold text-sky-600 hover:text-sky-700 transition-colors underline-offset-4 hover:underline"
              >
                Register
              </Link>
            </p>
          </div>

        </div>

        {/* Footer info */}
        <div className="w-full text-center text-xs text-slate-400 pt-6">
          © {new Date().getFullYear()} SupplyGuard AI. All rights reserved.
        </div>

      </div>
    </div>
  );
}
