import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import ImageSlider from '../components/ImageSlider';
import { Heart, Loader2, HeartCrack, ChevronRight } from 'lucide-react';

const LikedProducts = () => {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [likedList, setLikedList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auth Guard
  useEffect(() => {
    if (!user) {
      toast.error('Please login to view liked products');
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchLikedProducts = async () => {
    try {
      const res = await api.get('/products/user/liked');
      setLikedList(res.data);
    } catch (err) {
      toast.error('Failed to load liked products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchLikedProducts();
    }
  }, [user]);

  const handleUnlike = async (productId) => {
    try {
      await api.post(`/products/like/${productId}`);
      toast.success('Product removed from liked list');
      setLikedList(likedList.filter((item) => item._id !== productId));
      refreshProfile(); // Refresh AuthContext so other pages are updated
    } catch (err) {
      toast.error('Failed to unlike product');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary-500 h-10 w-10 mb-4" />
        <span className="text-sm font-semibold text-slate-500">Loading your saved items...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors duration-300">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-200/50 dark:border-slate-800/50 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none">
            Liked Products
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Manage your personal wishlist and liked items.
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 hover:border-primary-500 text-sm font-semibold rounded-xl text-slate-700 dark:text-slate-300 transition-all self-start md:self-auto cursor-pointer"
        >
          Explore Catalog
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Liked list cards */}
      {likedList.length === 0 ? (
        <div className="glass rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-md mx-auto animate-fade-in mt-10">
          <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 dark:text-slate-500 mx-auto mb-4">
            <HeartCrack size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your wishlist is empty</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Browse through the products and click the heart icon on any card to save it here.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold shadow-md shadow-primary-600/10 transition-all cursor-pointer"
          >
            Start Liking Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
          {likedList.map((product) => {
            return (
              <div 
                key={product._id} 
                className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 flex flex-col h-[350px]"
              >
                {/* Image Slider */}
                <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-950 overflow-hidden flex-shrink-0">
                  <ImageSlider images={product.imageUrls} />
                  {/* Unlike Button */}
                  <button
                    onClick={() => handleUnlike(product._id)}
                    className="absolute top-3 right-3 p-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl hover:scale-110 shadow-md transition-all z-10 cursor-pointer"
                    title="Unlike product"
                  >
                    <Heart size={18} className="fill-red-500 text-red-500" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 truncate">
                        {product.name}
                      </h3>
                      <span className="font-extrabold text-sm text-primary-600 dark:text-primary-400 shrink-0">
                        ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-2 truncate">
                      Listed by {product.owner?.name || 'Unknown'}
                    </p>

                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 overflow-hidden text-ellipsis mb-4">
                      {product.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LikedProducts;
