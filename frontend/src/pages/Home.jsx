import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import ImageSlider from '../components/ImageSlider';
import { 
  Heart, 
  Edit2, 
  Trash2, 
  Search, 
  SlidersHorizontal,
  ChevronDown,
  Loader2,
  AlertCircle
} from 'lucide-react';

const Home = () => {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  const [activeCategory, setActiveCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'All',
    "Men's Clothing",
    "Women's Clothing",
    'Books & Stationery',
    'Others'
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 8 };
      if (search) params.search = search;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (sort) params.sort = sort;
      if (activeCategory) params.category = activeCategory;

      const res = await api.get('/products', { params });
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast.error('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300); // Debounce search changes

    return () => clearTimeout(delayDebounceFn);
  }, [search, minPrice, maxPrice, sort, activeCategory, page]);

  const handleLikeToggle = async (productId) => {
    if (!user) {
      toast.error('Please log in to like products');
      navigate('/login');
      return;
    }

    try {
      const res = await api.post(`/products/like/${productId}`);
      toast.success(res.data.message);
      refreshProfile(); // Refresh AuthContext user details (likedProducts list)
      
      // Optimitic local update
      setProducts(prevProducts => 
        prevProducts.map(p => {
          if (p._id === productId) {
            // Nothing to change on the product itself since likes list is on User model,
            // but we trigger a state update to re-render.
            return { ...p };
          }
          return p;
        })
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update like status');
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${productId}`);
        toast.success('Product deleted successfully');
        setProducts(products.filter(p => p._id !== productId));
        refreshProfile();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  const isLiked = (productId) => {
    return user?.likedProducts?.includes(productId);
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
      {/* Hero Section */}
      <div className="text-center py-10 sm:py-14 bg-gradient-to-br from-primary-500/10 to-indigo-500/5 dark:from-primary-500/5 dark:to-indigo-500/1 rounded-3xl mb-8 relative overflow-hidden border border-slate-200/50 dark:border-slate-800/20">
        <div className="absolute inset-0 grid-bg opacity-40"></div>
        <div className="relative z-10 max-w-2xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
            Find Your Next <span className="bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 bg-clip-text text-transparent">Favorite Item</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
            A minimalist marketplace to list, browse, and save products. Explore deals or upload your own listings.
          </p>
        </div>
      </div>

      {/* Control Panel: Search & Filters */}
      <div className="glass rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-4 mb-8 shadow-sm transition-colors duration-300">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search products by title or description..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
            />
          </div>

          <div className="flex gap-2">
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-semibold transition-all duration-200 ${
                showFilters 
                  ? 'bg-primary-50 dark:bg-primary-950/20 border-primary-500 text-primary-600 dark:text-primary-400' 
                  : 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>

            {/* Sort Dropdown */}
            <div className="relative flex items-center">
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="appearance-none pl-4 pr-10 py-2.5 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-3.5 pointer-events-none text-slate-400" size={16} />
            </div>
          </div>
        </div>

        {/* Extended Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 animate-slide-up">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Min Price ($)
              </label>
              <input
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3.5 py-2 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Max Price ($)
              </label>
              <input
                type="number"
                placeholder="No max"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3.5 py-2 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* Category Selection Pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 -mx-4 px-4 sm:mx-0 sm:px-0">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              activeCategory === cat
                ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary-500 h-10 w-10 mb-4" />
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading products catalog...</span>
        </div>
      ) : products.length === 0 ? (
        <div className="glass rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-md mx-auto animate-fade-in">
          <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 dark:text-slate-500 mx-auto mb-4">
            <AlertCircle size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No products found</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Try adjusting your search query, sorting order, or filters.
          </p>
          {user && (
            <button
              onClick={() => navigate('/add-product')}
              className="mt-5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-bold shadow-md shadow-primary-600/10 transition-all cursor-pointer"
            >
              Add New Product
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
          {products.map((product) => {
            const isOwner = user && product.owner?._id === user._id;

            return (
              <div 
                key={product._id} 
                className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 flex flex-col h-[400px]"
              >
                {/* Product Image Slider */}
                <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-950 overflow-hidden flex-shrink-0">
                  <ImageSlider images={product.imageUrls} />
                  {/* Like Button */}
                  <button
                    onClick={() => handleLikeToggle(product._id)}
                    className="absolute top-3.5 right-3.5 p-2 bg-white/95 dark:bg-slate-900/95 border border-slate-100 dark:border-slate-800 hover:scale-110 rounded-xl shadow-md transition-all z-10 cursor-pointer"
                    aria-label="Like product"
                  >
                    <Heart
                      size={18}
                      className={`transition-colors duration-200 ${
                        isLiked(product._id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-slate-500 dark:text-slate-400 hover:text-red-500'
                      }`}
                    />
                  </button>
                </div>

                {/* Info Content */}
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {product.name}
                      </h3>
                      <span className="font-extrabold text-sm text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/30 px-2.5 py-0.5 rounded-full shrink-0">
                        ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="flex justify-between items-center gap-2 mb-1">
                      <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                        By {product.owner?.name || 'Unknown'}
                      </p>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md">
                        {product.category || 'Others'}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 overflow-hidden text-ellipsis mb-4">
                      {product.description}
                    </p>
                  </div>

                  {/* Actions (Edit/Delete for owner) */}
                  {isOwner && (
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 shrink-0">
                      <button
                        onClick={() => navigate(`/edit-product/${product._id}`)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 border border-slate-200 dark:border-slate-800 hover:border-primary-500 dark:hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                      >
                        <Edit2 size={13} />
                        Edit Details
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-2 border border-slate-200 dark:border-slate-800 hover:border-red-500 dark:hover:border-red-500 hover:text-red-500 rounded-xl text-slate-500 transition-all cursor-pointer"
                        aria-label="Delete product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                page === p
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              {p}
            </button>
          ))}
          
          <button
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
