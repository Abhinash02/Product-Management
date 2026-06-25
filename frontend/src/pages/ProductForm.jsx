import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { 
  Package, 
  DollarSign, 
  FileText, 
  Image as ImageIcon, 
  Upload, 
  Link as LinkIcon,
  ArrowLeft, 
  Loader2,
  ChevronDown,
  Trash2,
  Plus
} from 'lucide-react';

const ProductForm = () => {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: "Men's Clothing",
  });
  
  const [imageType, setImageType] = useState('upload'); // 'upload' or 'url'
  
  // Multiple files upload states
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  
  // Multiple URLs states
  const [urlInputs, setUrlInputs] = useState(['']);
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(isEditMode);

  // Guard: Must be authenticated
  useEffect(() => {
    if (!user) {
      toast.error('Authentication required to access this page');
      navigate('/login');
    }
  }, [user, navigate]);

  // Load product details in edit mode
  useEffect(() => {
    if (isEditMode) {
      const loadProduct = async () => {
        try {
          const res = await api.get(`/products/${id}`);
          // Verify ownership
          if (res.data.owner._id !== user?._id) {
            toast.error('You are not authorized to edit this product');
            navigate('/');
            return;
          }
          
          setFormData({
            name: res.data.name,
            price: res.data.price,
            description: res.data.description,
            category: res.data.category || 'Others',
          });
          
          const urls = res.data.imageUrls || [];
          
          // Determine if they were uploaded files or external URLs
          const hasLocalFallback = urls.some(url => url.startsWith('/uploads'));
          
          if (hasLocalFallback) {
            setImageType('upload');
            // Build absolute URLs for preview
            const previews = urls.map(url => 
              url.startsWith('/uploads')
                ? `${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000'}${url}`
                : url
            );
            setFilePreviews(previews);
            // In edit mode, we store existing URLs in a temp place or inside urlInputs in case they switch
            setUrlInputs(urls);
          } else {
            setImageType('url');
            setUrlInputs(urls.length > 0 ? urls : ['']);
            setFilePreviews(urls);
          }
        } catch (err) {
          toast.error('Failed to load product details');
          navigate('/');
        } finally {
          setFetchingData(false);
        }
      };
      
      if (user) {
        loadProduct();
      }
    }
  }, [id, isEditMode, user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  // Files Upload Handlers
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Check limit (Max 4 images)
    if (selectedFiles.length + files.length > 4) {
      toast.error('You can upload a maximum of 4 images');
      return;
    }

    const validFiles = [];
    const newPreviews = [];

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return;
      }
      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
    setFilePreviews(prev => [...prev, ...newPreviews]);
    
    if (errors.images) {
      setErrors(prev => ({ ...prev, images: '' }));
    }
  };

  const removeFile = (index) => {
    // If it's a newly selected file
    const fileIndexToRemove = index - (filePreviews.length - selectedFiles.length);
    
    if (fileIndexToRemove >= 0) {
      const newFiles = [...selectedFiles];
      newFiles.splice(fileIndexToRemove, 1);
      setSelectedFiles(newFiles);
    }
    
    const newPreviews = [...filePreviews];
    newPreviews.splice(index, 1);
    setFilePreviews(newPreviews);
  };

  // URL Input Handlers
  const handleUrlInputChange = (index, value) => {
    const newUrls = [...urlInputs];
    newUrls[index] = value;
    setUrlInputs(newUrls);
    if (errors.images) {
      setErrors(prev => ({ ...prev, images: '' }));
    }
  };

  const addUrlField = () => {
    if (urlInputs.length >= 4) {
      toast.error('You can add a maximum of 4 image URLs');
      return;
    }
    setUrlInputs([...urlInputs, '']);
  };

  const removeUrlField = (index) => {
    if (urlInputs.length === 1) {
      setUrlInputs(['']);
      return;
    }
    const newUrls = [...urlInputs];
    newUrls.splice(index, 1);
    setUrlInputs(newUrls);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.price) {
      newErrors.price = 'Product price is required';
    } else if (Number(formData.price) < 0) {
      newErrors.price = 'Price must be a positive number';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required';
    }

    if (!formData.category) {
      newErrors.category = 'Product category is required';
    }

    if (imageType === 'url') {
      const activeUrls = urlInputs.filter(url => url.trim());
      if (activeUrls.length === 0) {
        newErrors.images = 'At least one product image URL is required';
      }
    } else {
      // In upload mode, must have either selected new files or have existing previews (in edit mode)
      if (selectedFiles.length === 0 && filePreviews.length === 0) {
        newErrors.images = 'Please select at least one image to upload';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix validation errors');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('price', formData.price);
      data.append('description', formData.description);
      data.append('category', formData.category);

      if (imageType === 'upload') {
        // Append all files
        selectedFiles.forEach(file => {
          data.append('images', file);
        });

        // In edit mode, if they kept some existing images, we send remaining URLs
        if (isEditMode) {
          // Identify existing images (the ones that start with '/uploads' or are absolute paths, not object URLs)
          const remainingUrls = filePreviews.filter(preview => !preview.startsWith('blob:'));
          // Convert back to relative paths for local uploads
          const relativeUrls = remainingUrls.map(url => {
            if (url.includes('/uploads/')) {
              return '/uploads/' + url.split('/uploads/')[1];
            }
            return url;
          });
          data.append('imageUrls', JSON.stringify(relativeUrls));
        }
      } else {
        const activeUrls = urlInputs.filter(url => url.trim());
        data.append('imageUrls', JSON.stringify(activeUrls));
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      if (isEditMode) {
        await api.put(`/products/${id}`, data, config);
        toast.success('Product updated successfully!');
      } else {
        await api.post('/products', data, config);
        toast.success('Product created successfully!');
      }

      refreshProfile();
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary-500 h-10 w-10 mb-4" />
        <span className="text-sm font-semibold text-slate-500">Retrieving product record...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 grid-bg">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="glass rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl p-6 sm:p-8 animate-slide-up">
        <div className="flex items-center gap-3.5 mb-8">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Package size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-none">
              {isEditMode ? 'Edit Product Details' : 'Create New Listing'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Provide features and upload up to 4 images to slide.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Col: Info details */}
            <div className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Product Title
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Package size={18} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3.5 py-2.5 bg-white/50 dark:bg-slate-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-sm ${
                      errors.name ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 dark:border-slate-800 focus:ring-primary-500/20 focus:border-primary-500'
                    }`}
                    placeholder="Premium Wireless Headphones"
                  />
                </div>
                {errors.name && <p className="mt-1 text-xs text-red-500 font-medium">{errors.name}</p>}
              </div>

              {/* Category Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Product Category
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`block w-full px-3.5 py-2.5 bg-white/50 dark:bg-slate-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-sm appearance-none cursor-pointer ${
                      errors.category ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 dark:border-slate-800 focus:ring-primary-500/20 focus:border-primary-500'
                    }`}
                  >
              
                    <option value="Men's Clothing">Men's Clothing</option>
                    <option value="Women's Clothing">Women's Clothing</option>
                    <option value="Books & Stationery">Books & Stationery</option>
                    <option value="Others">Others</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <ChevronDown size={16} />
                  </div>
                </div>
                {errors.category && <p className="mt-1 text-xs text-red-500 font-medium">{errors.category}</p>}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Listing Price ($)
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <DollarSign size={18} />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3.5 py-2.5 bg-white/50 dark:bg-slate-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                      errors.price ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 dark:border-slate-800 focus:ring-primary-500/20 focus:border-primary-500'
                    }`}
                    placeholder="99.99"
                  />
                </div>
                {errors.price && <p className="mt-1 text-xs text-red-500 font-medium">{errors.price}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Product Description
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute left-3.5 top-3.5 pointer-events-none text-slate-400">
                    <FileText size={18} />
                  </div>
                  <textarea
                    rows="5"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3.5 py-2.5 bg-white/50 dark:bg-slate-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-sm ${
                      errors.description ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 dark:border-slate-800 focus:ring-primary-500/20 focus:border-primary-500'
                    }`}
                    placeholder="Describe product details, condition, specifications..."
                  />
                </div>
                {errors.description && <p className="mt-1 text-xs text-red-500 font-medium">{errors.description}</p>}
              </div>
            </div>

            {/* Right Col: Multiple image options & previews */}
            <div className="flex flex-col space-y-4">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Product Image Slides (Up to 4)
              </label>

              {/* Toggle upload vs URL */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
                <button
                  type="button"
                  onClick={() => setImageType('upload')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    imageType === 'upload'
                      ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Upload size={14} />
                  Upload Images
                </button>
                <button
                  type="button"
                  onClick={() => setImageType('url')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    imageType === 'url'
                      ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <LinkIcon size={14} />
                  Paste URLs
                </button>
              </div>

              {/* Image Input Container */}
              {imageType === 'upload' ? (
                <div className="space-y-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  
                  {filePreviews.length < 4 && (
                    <div
                      onClick={() => fileInputRef.current.click()}
                      className={`h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-slate-50/50 dark:hover:bg-slate-950/20 ${
                        errors.images ? 'border-red-400 bg-red-50/10' : 'border-slate-300 dark:border-slate-800'
                      }`}
                    >
                      <Upload className="text-slate-400 mb-1.5 animate-bounce" size={22} />
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                        Select files to upload
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1">Select multiple (Remaining: {4 - filePreviews.length})</span>
                    </div>
                  )}

                  {/* Previews grid */}
                  {filePreviews.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Selected Images Slider Previews:</span>
                      <div className="grid grid-cols-2 gap-3">
                        {filePreviews.map((preview, index) => (
                          <div key={index} className="relative h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 group/item">
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity cursor-pointer shadow"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* URL Mode */
                <div className="space-y-3">
                  {urlInputs.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="relative flex-1 rounded-xl shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <ImageIcon size={16} />
                        </div>
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => handleUrlInputChange(index, e.target.value)}
                          className={`block w-full pl-9 pr-3 py-2 bg-white/50 dark:bg-slate-900/50 border rounded-xl focus:outline-none focus:ring-2 transition-all text-xs ${
                            errors.images ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 dark:border-slate-800 focus:ring-primary-500/20 focus:border-primary-500'
                          }`}
                          placeholder={`Image URL ${index + 1}`}
                        />
                      </div>
                      
                      {urlInputs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeUrlField(index)}
                          className="p-2 border border-red-200 dark:border-red-950/40 text-red-500 hover:bg-red-50 rounded-xl cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}

                  {urlInputs.length < 4 && (
                    <button
                      type="button"
                      onClick={addUrlField}
                      className="flex items-center justify-center gap-1.5 w-full py-2 border border-dashed border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      <Plus size={14} />
                      Add URL Field
                    </button>
                  )}
                </div>
              )}
              {errors.images && <p className="mt-1 text-xs text-red-500 font-medium">{errors.images}</p>}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold shadow-md shadow-primary-600/10 hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  Saving details...
                </>
              ) : (
                isEditMode ? 'Update Listing' : 'Publish Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
