const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleLikeProduct,
  getLikedProducts
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes
router.post('/', protect, upload.array('images', 4), createProduct);
router.put('/:id', protect, upload.array('images', 4), updateProduct);
router.delete('/:id', protect, deleteProduct);
router.post('/like/:id', protect, toggleLikeProduct);
router.get('/user/liked', protect, getLikedProducts);

module.exports = router;
