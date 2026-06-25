const Product = require('../models/Product');
const User = require('../models/User');
const { uploadToCloudinary } = require('../config/cloudinary');
const fs = require('fs');

/**
 * @desc    Get all products with search, sorting, and filter functionality
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
  try {
    const { search, minPrice, maxPrice, sort, category } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    let query = {};

    // Search by product name or description (case insensitive)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Get total matching count for pagination metadata
    const totalProducts = await Product.countDocuments(query);

    let apiQuery = Product.find(query)
      .populate('owner', 'name email')
      .skip(skip)
      .limit(limit);

    // Sorting
    if (sort) {
      if (sort === 'priceAsc') {
        apiQuery = apiQuery.sort({ price: 1 });
      } else if (sort === 'priceDesc') {
        apiQuery = apiQuery.sort({ price: -1 });
      } else if (sort === 'newest') {
        apiQuery = apiQuery.sort({ createdAt: -1 });
      }
    } else {
      apiQuery = apiQuery.sort({ createdAt: -1 }); // Default to newest
    }

    const products = await apiQuery;
    
    res.json({
      products,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      totalProducts
    });
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ message: 'Server error retrieving products' });
  }
};

/**
 * @desc    Get a single product details
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('owner', 'name email');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error retrieving product:', error.message);
    res.status(500).json({ message: 'Server error retrieving product details' });
  }
};

/**
 * @desc    Create a product (supports multiple image uploads to Cloudinary/local fallback or direct URLs)
 * @route   POST /api/products
 * @access  Private
 */
const createProduct = async (req, res) => {
  const { name, price, description, imageUrls, category } = req.body;

  try {
    console.log('DEBUG - req.body:', req.body);
    console.log('DEBUG - req.files:', req.files);

    if (!name || !price || !description) {
      // Clean up uploaded files if validation fails
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        });
      }
      return res.status(400).json({ message: 'Name, price, and description are required' });
    }

    let finalImageUrls = [];
    let uploadErrors = [];

    // 1. Process local files uploaded via Multer
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const url = await uploadToCloudinary(file.path);
          if (url) finalImageUrls.push(url);
        } catch (uploadErr) {
          console.error('File upload failed:', uploadErr.message);
          uploadErrors.push(uploadErr.message);
        }
      }
    }

    // 2. Process imageUrls passed as text
    if (imageUrls) {
      let urlArray = [];
      try {
        urlArray = JSON.parse(imageUrls);
        if (!Array.isArray(urlArray)) {
          urlArray = [urlArray];
        }
      } catch (e) {
        urlArray = imageUrls.split(',').map(url => url.trim()).filter(Boolean);
      }
      finalImageUrls = [...finalImageUrls, ...urlArray];
    }

    if (finalImageUrls.length === 0) {
      const errMsg = uploadErrors.length > 0 
        ? `Image upload failed: ${uploadErrors.join(', ')}`
        : 'At least one product image URL or file upload is required';
      return res.status(400).json({ message: errMsg });
    }

    const product = new Product({
      name,
      price: Number(price),
      description,
      imageUrls: finalImageUrls,
      category: category || 'Others',
      owner: req.user._id
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error.message);
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
    }
    res.status(500).json({ message: error.message || 'Server error creating product' });
  }
};

/**
 * @desc    Update an existing product details
 * @route   PUT /api/products/:id
 * @access  Private
 */
const updateProduct = async (req, res) => {
  const { name, price, description, imageUrls, category } = req.body;

  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        });
      }
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check ownership
    if (product.owner.toString() !== req.user._id.toString()) {
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        });
      }
      return res.status(403).json({ message: 'You are not authorized to edit this product' });
    }

    let finalImageUrls = [];
    let uploadErrors = [];

    // 1. Process files uploaded via Multer
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const url = await uploadToCloudinary(file.path);
          if (url) finalImageUrls.push(url);
        } catch (uploadErr) {
          console.error('File upload failed:', uploadErr.message);
          uploadErrors.push(uploadErr.message);
        }
      }
    }

    // 2. Process imageUrls passed as text
    if (imageUrls) {
      let urlArray = [];
      try {
        urlArray = JSON.parse(imageUrls);
        if (!Array.isArray(urlArray)) {
          urlArray = [urlArray];
        }
      } catch (e) {
        urlArray = imageUrls.split(',').map(url => url.trim()).filter(Boolean);
      }
      finalImageUrls = [...finalImageUrls, ...urlArray];
    }

    // If no new images uploaded or provided, keep existing product images
    if (finalImageUrls.length === 0) {
      finalImageUrls = product.imageUrls;
    }

    product.name = name || product.name;
    product.price = price !== undefined ? Number(price) : product.price;
    product.description = description || product.description;
    product.imageUrls = finalImageUrls;
    product.category = category || product.category;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error.message);
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
    }
    res.status(500).json({ message: 'Server error updating product' });
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check ownership
    if (product.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this product' });
    }

    await Product.findByIdAndDelete(req.params.id);

    // Also remove this product from all users' liked lists
    await User.updateMany(
      { likedProducts: req.params.id },
      { $pull: { likedProducts: req.params.id } }
    );

    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    console.error('Error deleting product:', error.message);
    res.status(500).json({ message: 'Server error deleting product' });
  }
};

/**
 * @desc    Toggle product like status
 * @route   POST /api/products/like/:id
 * @access  Private
 */
const toggleLikeProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(req.user._id);
    const isLiked = user.likedProducts.includes(req.params.id);

    if (isLiked) {
      // Unlike product
      user.likedProducts = user.likedProducts.filter(
        (id) => id.toString() !== req.params.id.toString()
      );
    } else {
      // Like product
      user.likedProducts.push(req.params.id);
    }

    await user.save();

    res.json({
      message: isLiked ? 'Product unliked' : 'Product liked',
      liked: !isLiked,
      likedProductsCount: user.likedProducts.length
    });
  } catch (error) {
    console.error('Error toggling like:', error.message);
    res.status(500).json({ message: 'Server error updating like status' });
  }
};

/**
 * @desc    Get user's liked products
 * @route   GET /api/products/liked
 * @access  Private
 */
const getLikedProducts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'likedProducts',
      populate: { path: 'owner', select: 'name email' }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter out any null liked products (e.g. if deleted but not removed from array)
    const validLikedProducts = user.likedProducts.filter((product) => product !== null);

    res.json(validLikedProducts);
  } catch (error) {
    console.error('Error fetching liked products:', error.message);
    res.status(500).json({ message: 'Server error retrieving liked products' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleLikeProduct,
  getLikedProducts
};
