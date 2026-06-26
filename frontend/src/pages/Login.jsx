import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: 'abhinash@gmail.com', password: 'avinash' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    
    if (!formData.email) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      toast.success('Successfully logged in!');
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
              <LogIn size={28} />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Welcome Back
            </h2>
            <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
              Sign in to start exploring products
            </p>
          </div>

          <form className="mt-8 space-y-6 relative z-10" onSubmit={handleSubmit} noValidate>
            <div className="space-y-5">
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
                    className={`block w-full pl-11 pr-3 py-3 bg-white/50 dark:bg-slate-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-sm ${
                      errors.email
                        ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-primary-500/20 focus:border-primary-500 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                    placeholder="name@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-500 font-medium animate-fade-in">{errors.email}</p>
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
                    className={`block w-full pl-11 pr-3 py-3 bg-white/50 dark:bg-slate-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-sm ${
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
            </div>

            <div className="flex items-center justify-end text-sm font-semibold">
              <Link to="/forgot-password" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                Forgot password?
              </Link>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-lg shadow-primary-600/25 hover:shadow-xl hover:shadow-primary-600/40 disabled:opacity-50 transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5 text-white" />
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          <div className="text-center relative z-10 mt-6">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Right Column - Decorative */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-slate-900 border-l border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 via-slate-900 to-indigo-900/40 z-0"></div>
        
        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative z-10 flex flex-col justify-center items-center w-full h-full text-center px-12 xl:px-24 animate-fade-in">
          <div className="mb-10 w-24 h-24 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl">
            <LogIn size={40} className="text-white opacity-80" />
          </div>
          <h2 className="text-4xl xl:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
            Welcome back to the <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">Marketplace</span>
          </h2>
          <p className="text-lg text-slate-300 max-w-md mx-auto leading-relaxed">
            Sign in to discover premium products, connect with top creators, and build your perfect collection.
          </p>
          
          <div className="mt-16 flex items-center justify-center space-x-4 text-slate-400">
            <div className="h-px w-12 bg-slate-700"></div>
            <span className="text-sm font-medium uppercase tracking-wider">Trusted by thousands</span>
            <div className="h-px w-12 bg-slate-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
