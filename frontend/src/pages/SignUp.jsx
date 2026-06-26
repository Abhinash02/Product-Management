import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Lock, KeyRound, UserPlus, Loader2 } from 'lucide-react';

const SignUp = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!phoneRegex.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be a valid 10-digit number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear validation error on change
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please correct the validation errors');
      return;
    }

    setLoading(true);
    const result = await register(
      formData.name,
      formData.email,
      formData.mobile,
      formData.password,
      formData.confirmPassword
    );
    setLoading(false);

    if (result.success) {
      toast.success('Account created successfully!');
      navigate('/');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="flex-1 min-h-[calc(100vh-4rem)] flex grid-bg">
      {/* Left Column - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8 glass p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800/80 transition-all duration-300 animate-slide-up relative overflow-hidden">
          {/* Subtle glow effect behind form */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-tr from-primary-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/30 transform transition-transform hover:scale-105 duration-300">
              <UserPlus size={28} />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Create Account
            </h2>
            <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
              Sign up to build your personal product collection
            </p>
          </div>

          <form className="mt-8 space-y-4 relative z-10" onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative rounded-xl shadow-sm group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`block w-full pl-11 pr-3 py-2.5 bg-white/50 dark:bg-slate-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-sm ${
                      errors.name
                        ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-primary-500/20 focus:border-primary-500 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-500 font-medium animate-fade-in">{errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative rounded-xl shadow-sm group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full pl-11 pr-3 py-2.5 bg-white/50 dark:bg-slate-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-sm ${
                      errors.email
                        ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-primary-500/20 focus:border-primary-500 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-500 font-medium animate-fade-in">{errors.email}</p>
                )}
              </div>

              {/* Mobile Field */}
              <div>
                <label htmlFor="mobile" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Mobile Number
                </label>
                <div className="relative rounded-xl shadow-sm group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                    <Phone size={18} />
                  </div>
                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={handleChange}
                    className={`block w-full pl-11 pr-3 py-2.5 bg-white/50 dark:bg-slate-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-sm ${
                      errors.mobile
                        ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-primary-500/20 focus:border-primary-500 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                    placeholder="9876543210"
                  />
                </div>
                {errors.mobile && (
                  <p className="mt-1.5 text-xs text-red-500 font-medium animate-fade-in">{errors.mobile}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative rounded-xl shadow-sm group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`block w-full pl-11 pr-3 py-2.5 bg-white/50 dark:bg-slate-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-sm ${
                      errors.password
                        ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-primary-500/20 focus:border-primary-500 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-500 font-medium animate-fade-in">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative rounded-xl shadow-sm group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                    <KeyRound size={18} />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full pl-11 pr-3 py-2.5 bg-white/50 dark:bg-slate-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-sm ${
                      errors.confirmPassword
                        ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-primary-500/20 focus:border-primary-500 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-500 font-medium animate-fade-in">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-600/40 disabled:opacity-50 transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5 text-white" />
                ) : (
                  'Sign Up'
                )}
              </button>
            </div>
          </form>

          <div className="text-center relative z-10 mt-6">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Right Column - Decorative */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-slate-900 border-l border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-primary-900/40 z-0"></div>
        
        {/* Glow effects */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative z-10 flex flex-col justify-center items-center w-full h-full text-center px-12 xl:px-24 animate-fade-in">
          <div className="mb-10 w-24 h-24 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl">
            <UserPlus size={40} className="text-white opacity-80" />
          </div>
          <h2 className="text-4xl xl:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
            Join the <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-primary-400">Community</span>
          </h2>
          <p className="text-lg text-slate-300 max-w-md mx-auto leading-relaxed">
            Create an account to unlock premium features, save your favorite products, and connect with other users.
          </p>
          
          <div className="mt-16 flex flex-col items-center justify-center space-y-4">
            <div className="flex -space-x-4">
              <div className="w-12 h-12 rounded-full border-2 border-slate-900 bg-primary-400 flex items-center justify-center font-bold text-white shadow-md z-30">A</div>
              <div className="w-12 h-12 rounded-full border-2 border-slate-900 bg-indigo-400 flex items-center justify-center font-bold text-white shadow-md z-20">B</div>
              <div className="w-12 h-12 rounded-full border-2 border-slate-900 bg-purple-400 flex items-center justify-center font-bold text-white shadow-md z-10">C</div>
            </div>
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Join 10,000+ members</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
