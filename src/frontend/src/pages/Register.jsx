import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Mail,
  Building2,
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

export default function Register() {
  const navigate = useNavigate();

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Eye Toggle State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // UI State
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [registerNotice, setRegisterNotice] = useState(null);

  // Validation Handler
  const validateForm = () => {
    const newErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Full Name must be at least 2 characters';
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms & Privacy Policy';
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
    setRegisterNotice(null);

    try {
      const result = await authService.register({
        name: fullName,
        email,
        organization,
        password
      });

      if (result.success) {
        navigate('/login', {
          state: { message: 'Account created successfully. Please log in.' }
        });
      }
    } catch (err) {
      setErrors({ submit: err.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
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
        <div className="relative z-10 space-y-6 max-w-2xl animate-float-slow">
          <div className="flex items-center space-x-4">
            <img 
              src="/assets/supplyguard-logo.png" 
              alt="SupplyGuard AI Logo" 
              className="h-28 sm:h-36 lg:h-40 w-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]" 
            />
          </div>
          <div className="space-y-3">
            <p className="text-emerald-300 font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight font-heading drop-shadow-lg leading-tight">
              Smarter Supply Chains. A Safer Tomorrow.
            </p>
            <p className="text-white text-base sm:text-lg lg:text-xl font-medium leading-relaxed drop-shadow-md max-w-xl bg-black/20 backdrop-blur-xs p-4 rounded-2xl border border-white/10">
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
      {/* RIGHT PANEL: 42% DESKTOP WIDTH — LIGHT CLEAN REGISTRATION FORM SECTION */}
      {/* ========================================================================= */}
      <div className="relative lg:w-[42%] w-full bg-slate-50 flex flex-col justify-between p-6 sm:p-10 lg:p-12 min-h-screen">
        
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

        {/* Top Spacer */}
        <div className="w-full" />

        {/* Form Container (Max 480px width) */}
        <div className="relative z-10 w-full max-w-md mx-auto my-auto space-y-6">
          
          {/* Header */}
          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B192C] font-heading tracking-tight">
              Create Your Account
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm font-normal">
              Join SupplyGuard AI to manage smarter, safer supply chains.
            </p>
          </div>

          {/* Notice Banner */}
          {registerNotice && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center space-x-2 animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{registerNotice}</span>
            </div>
          )}

          {errors.submit && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center space-x-2 animate-fadeIn">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errors.submit}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            
            {/* 1. Full Name */}
            <div className="space-y-1">
              <label htmlFor="fullname-input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="fullname-input"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className={`w-full pl-10 pr-4 py-3 bg-white border ${
                    errors.fullName ? 'border-rose-400 focus:ring-rose-500/20' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                  } rounded-xl text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:ring-4 transition-all shadow-sm`}
                />
              </div>
              {errors.fullName && (
                <p className="text-[11px] text-rose-500 font-medium pt-0.5">{errors.fullName}</p>
              )}
            </div>

            {/* 2. Email Address */}
            <div className="space-y-1">
              <label htmlFor="email-input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className={`w-full pl-10 pr-4 py-3 bg-white border ${
                    errors.email ? 'border-rose-400 focus:ring-rose-500/20' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                  } rounded-xl text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:ring-4 transition-all shadow-sm`}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-rose-500 font-medium pt-0.5">{errors.email}</p>
              )}
            </div>

            {/* 3. Organization (Optional) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="org-input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Organization / Company
                </label>
                <span className="text-[10px] font-medium text-slate-400 uppercase">Optional</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <input
                  id="org-input"
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="Enter organization name (Optional)"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:ring-4 transition-all shadow-sm"
                />
              </div>
            </div>

            {/* 4 & 5. Password & Confirm Password (Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Password */}
              <div className="space-y-1">
                <label htmlFor="password-input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className={`w-full pl-9 pr-9 py-3 bg-white border ${
                      errors.password ? 'border-rose-400' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                    } rounded-xl text-slate-900 placeholder:text-slate-400 text-xs font-medium focus:outline-none focus:ring-4 transition-all shadow-sm`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[10px] text-rose-500 font-medium pt-0.5">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label htmlFor="confirm-password-input" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="confirm-password-input"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm"
                    className={`w-full pl-9 pr-9 py-3 bg-white border ${
                      errors.confirmPassword ? 'border-rose-400' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                    } rounded-xl text-slate-900 placeholder:text-slate-400 text-xs font-medium focus:outline-none focus:ring-4 transition-all shadow-sm`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[10px] text-rose-500 font-medium pt-0.5">{errors.confirmPassword}</p>
                )}
              </div>

            </div>

            {/* Terms Checkbox */}
            <div className="pt-1">
              <label className="flex items-start space-x-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-slate-600 font-medium text-xs leading-tight">
                  I agree to the <span className="text-sky-600 font-semibold">Terms of Service</span> & <span className="text-sky-600 font-semibold">Privacy Policy</span>
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="text-[11px] text-rose-500 font-medium pt-1">{errors.agreeTerms}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl text-white font-semibold text-sm bg-gradient-to-r from-[#22c55e] via-[#10b981] to-[#0284c7] hover:from-[#16a34a] hover:to-[#0369a1] active:scale-[0.99] transition-all duration-200 shadow-md shadow-emerald-500/20 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed group cursor-pointer"
            >
              <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>

          </form>

          {/* Login Prompt */}
          <div className="text-center pt-1">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-semibold text-sky-600 hover:text-sky-700 transition-colors underline-offset-4 hover:underline"
              >
                Login
              </Link>
            </p>
          </div>

        </div>

        {/* Footer info */}
        <div className="w-full text-center text-xs text-slate-400 pt-4">
          © {new Date().getFullYear()} SupplyGuard AI. All rights reserved.
        </div>

      </div>
    </div>
  );
}
