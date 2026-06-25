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
    <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 grid-bg">
      <div className="max-w-md w-full space-y-8 glass p-8 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800/80 transition-all duration-300">
        <div>
          <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-tr from-primary-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
            <UserPlus size={24} />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
            Sign up to build your personal product collection
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 bg-white/50 dark:bg-slate-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-sm ${
                    errors.name
                      ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-slate-200 dark:border-slate-800 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:border-primary-400'
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 bg-white/50 dark:bg-slate-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-sm ${
                    errors.email
                      ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-slate-200 dark:border-slate-800 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:border-primary-400'
                  }`}
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Mobile Field */}
            <div>
              <label htmlFor="mobile" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mobile Number
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone size={18} />
                </div>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  required
                  value={formData.mobile}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 bg-white/50 dark:bg-slate-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-sm ${
                    errors.mobile
                      ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-slate-200 dark:border-slate-800 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:border-primary-400'
                  }`}
                  placeholder="9876543210"
                />
              </div>
              {errors.mobile && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.mobile}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 bg-white/50 dark:bg-slate-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-sm ${
                    errors.password
                      ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-slate-200 dark:border-slate-800 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:border-primary-400'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Confirm Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <KeyRound size={18} />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-2 bg-white/50 dark:bg-slate-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-sm ${
                    errors.confirmPassword
                      ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-slate-200 dark:border-slate-800 focus:ring-primary-500/20 focus:border-primary-500 dark:focus:border-primary-400'
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-lg shadow-primary-600/10 hover:shadow-xl hover:shadow-primary-600/20 disabled:opacity-50 transition-all duration-200 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5 text-white" />
              ) : (
                'Sign Up'
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-600 dark:text-primary-400 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
