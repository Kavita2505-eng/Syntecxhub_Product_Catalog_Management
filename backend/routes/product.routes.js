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

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Retrieve a list of products with filters, search, sorting and pagination
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search query matching name, SKU, or description
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter products by category
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: stockStatus
 *         schema:
 *           type: string
 *           enum: [in-stock, out-of-stock, low-stock]
 *         description: Filter by availability status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, price, stock, createdAt]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sorting direction
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 totalCount:
 *                   type: integer
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get('/', getProducts);

/**
 * @swagger
 * /api/products/stats:
 *   get:
 *     summary: Get aggregate dashboard metrics for products catalog
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Statistics generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalProducts:
 *                       type: integer
 *                     averagePrice:
 *                       type: number
 *                     highestPrice:
 *                       type: number
 *                     lowestPrice:
 *                       type: number
 *                     totalInventoryValue:
 *                       type: number
 *                     totalStock:
 *                       type: integer
 *                     lowStockCount:
 *                       type: integer
 *                     categoryDistribution:
 *                       type: array
 *                       items:
 *                         type: object
 */
router.get('/stats', getProductStats);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get details of a single product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product database Object ID
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
router.get('/:id', getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - sku
 *               - price
 *               - category
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 example: Wireless Mechanical Keyboard
 *               sku:
 *                 type: string
 *                 example: KB-MECH-87
 *               description:
 *                 type: string
 *                 example: Tenkeyless mechanical keyboard with brown switches.
 *               price:
 *                 type: number
 *                 example: 79.99
 *               category:
 *                 type: string
 *                 example: Electronics
 *               stock:
 *                 type: integer
 *                 example: 25
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid input or duplicate SKU
 *       401:
 *         description: Unauthorized
 */
router.post('/', protect, validateProduct, createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update an existing product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               sku:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.put('/:id', protect, validateProduct, updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product from catalog
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.delete('/:id', protect, deleteProduct);

module.exports = router;
