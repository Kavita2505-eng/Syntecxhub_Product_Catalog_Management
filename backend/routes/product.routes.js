const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
} = require('../controllers/product.controller');
const { validateProduct } = require('../validators/product.validator');
const { protect } = require('../middleware/auth.middleware');

// Public routes
router.get('/', getProducts);
router.get('/stats', getProductStats);
router.get('/:id', getProductById);

// Protected routes (require authorization token)
router.post('/', protect, validateProduct, createProduct);
router.put('/:id', protect, validateProduct, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
