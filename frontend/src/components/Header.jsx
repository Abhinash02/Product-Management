import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingBag, 
  PlusCircle, 
  Heart, 
  User, 
  LogOut, 
  Sun, 
  Moon, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const linkClass = (path) => {
    return `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive(path)
        ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
    }`;
  };

  return (
    <nav className="sticky top-0 z-40 w-full glass border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-gradient-to-tr from-primary-500 to-indigo-600 rounded-xl text-white shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform duration-200">
                <ShoppingBag size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Marketplace
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link to="/" className={linkClass('/')}>
                  <span>Products</span>
                </Link>
                <Link to="/add-product" className={linkClass('/add-product')}>
                  <PlusCircle size={16} />
                  <span>Add Product</span>
                </Link>
                <Link to="/liked-products" className={linkClass('/liked-products')}>
                  <Heart size={16} className={isActive('/liked-products') ? 'fill-current' : ''} />
                  <span>Liked Products</span>
                </Link>
              </>
            ) : (
              <span className="text-xs text-slate-400 dark:text-slate-500 mr-2">Login to manage products</span>
            )}
          </div>

          {/* User Controls / Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-400 to-indigo-500 text-white flex items-center justify-center font-bold text-sm uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 px-1">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-0" 
                      onClick={() => setProfileDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl py-1 z-10 animate-slide-up">
                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <User size={16} />
                        Profile Page
                      </Link>
                      <hr className="border-slate-100 dark:border-slate-800" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold shadow-md shadow-primary-600/10 hover:shadow-lg hover:shadow-primary-600/20 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Controls */}
          <div className="flex items-center md:hidden gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden glass border-b border-slate-200 dark:border-slate-800 animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user ? (
              <>
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-base font-medium ${
                    isActive('/') ? 'bg-primary-500 text-white' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Products
                </Link>
                <Link
                  to="/add-product"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium ${
                    isActive('/add-product') ? 'bg-primary-500 text-white' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <PlusCircle size={18} />
                  Add Product
                </Link>
                <Link
                  to="/liked-products"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium ${
                    isActive('/liked-products') ? 'bg-primary-500 text-white' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Heart size={18} />
                  Liked Products
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium ${
                    isActive('/profile') ? 'bg-primary-500 text-white' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <User size={18} />
                  Profile Page
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 p-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
