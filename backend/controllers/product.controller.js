const Product = require('../models/Product');

/**
 * @desc    Get all products (with search, filter, sort, pagination)
 * @route   GET /api/products
 * @access  Public
 */
exports.getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      minPrice,
      maxPrice,
      stockStatus,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Convert page and limit to integers
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skipNum = (pageNum - 1) * limitNum;

    // Build query object
    const query = {};

    // Global Search (checks name, SKU, or description)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by Category
    if (category) {
      query.category = category;
    }

    // Filter by Price Range
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && minPrice !== '') {
        query.price.$gte = parseFloat(minPrice);
      }
      if (maxPrice !== undefined && maxPrice !== '') {
        query.price.$lte = parseFloat(maxPrice);
      }
    }

    // Filter by Stock Status
    if (stockStatus) {
      if (stockStatus === 'in-stock') {
        query.stock = { $gt: 0 };
      } else if (stockStatus === 'out-of-stock') {
        query.stock = 0;
      } else if (stockStatus === 'low-stock') {
        query.stock = { $gt: 0, $lt: 10 }; // Low stock threshold is less than 10
      }
    }

    // Build sort object
    const sort = {};
    const validSortFields = ['name', 'price', 'stock', 'createdAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const direction = sortOrder === 'asc' ? 1 : -1;
    sort[sortField] = direction;

    // Execute query with pagination and population
    const products = await Product.find(query)
      .populate('createdBy', 'username email')
      .sort(sort)
      .skip(skipNum)
      .limit(limitNum);

    // Get total count of matching products
    const totalCount = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limitNum);

    res.status(200).json({
      success: true,
      count: products.length,
      totalPages,
      currentPage: pageNum,
      totalCount,
      products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product details
 * @route   GET /api/products/:id
 * @access  Public
 */
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('createdBy', 'username email');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private
 */
exports.createProduct = async (req, res, next) => {
  try {
    const { name, sku, description, price, category, stock } = req.body;

    // Check if SKU already exists
    const skuExists = await Product.findOne({ sku: sku.toUpperCase() });
    if (skuExists) {
      return res.status(400).json({
        success: false,
        error: `Product with SKU '${sku.toUpperCase()}' already exists`,
      });
    }

    // Create product and associate with logged in user
    const product = await Product.create({
      name,
      sku: sku.toUpperCase(),
      description,
      price,
      category,
      stock,
      createdBy: req.user.id,
    });

    const populatedProduct = await Product.findById(product._id).populate('createdBy', 'username email');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: populatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing product
 * @route   PUT /api/products/:id
 * @access  Private
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const { name, sku, description, price, category, stock } = req.body;

    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    // Check if SKU is changing and check for uniqueness
    if (sku && sku.toUpperCase() !== product.sku) {
      const skuExists = await Product.findOne({ sku: sku.toUpperCase() });
      if (skuExists) {
        return res.status(400).json({
          success: false,
          error: `Product with SKU '${sku.toUpperCase()}' already exists`,
        });
      }
      product.sku = sku.toUpperCase();
    }

    // Update fields
    if (name) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (category) product.category = category;
    if (stock !== undefined) product.stock = stock;

    await product.save();
    
    const updatedProduct = await Product.findById(product._id).populate('createdBy', 'username email');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    // Delete the product using deleteOne
    await Product.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard metrics & aggregation stats
 * @route   GET /api/products/stats
 * @access  Public (or Private depending on needs, standard for dashboard)
 */
exports.getProductStats = async (req, res, next) => {
  try {
    const stats = await Product.aggregate([
      {
        $facet: {
          overall: [
            {
              $group: {
                _id: null,
                totalProducts: { $sum: 1 },
                averagePrice: { $avg: '$price' },
                highestPrice: { $max: '$price' },
                lowestPrice: { $min: '$price' },
                totalInventoryValue: { $sum: { $multiply: ['$price', '$stock'] } },
                totalStock: { $sum: '$stock' },
              },
            },
          ],
          lowStock: [
            { $match: { stock: { $lt: 10 } } },
            { $count: 'count' },
          ],
          categoryDistribution: [
            {
              $group: {
                _id: '$category',
                count: { $sum: 1 },
                avgPrice: { $avg: '$price' },
                totalStock: { $sum: '$stock' },
                inventoryValue: { $sum: { $multiply: ['$price', '$stock'] } },
              },
            },
            { $sort: { count: -1 } },
          ],
        },
      },
    ]);

    const overallStats = stats[0].overall[0] || {
      totalProducts: 0,
      averagePrice: 0,
      highestPrice: 0,
      lowestPrice: 0,
      totalInventoryValue: 0,
      totalStock: 0,
    };

    const lowStockCount = stats[0].lowStock[0] ? stats[0].lowStock[0].count : 0;
    const categoryStats = stats[0].categoryDistribution || [];

    res.status(200).json({
      success: true,
      data: {
        totalProducts: overallStats.totalProducts,
        averagePrice: Math.round(overallStats.averagePrice * 100) / 100,
        highestPrice: overallStats.highestPrice || 0,
        lowestPrice: overallStats.lowestPrice || 0,
        totalInventoryValue: Math.round(overallStats.totalInventoryValue * 100) / 100,
        totalStock: overallStats.totalStock,
        lowStockCount,
        categoryDistribution: categoryStats.map((cat) => ({
          category: cat._id,
          count: cat.count,
          avgPrice: Math.round(cat.avgPrice * 100) / 100,
          totalStock: cat.totalStock,
          inventoryValue: Math.round(cat.inventoryValue * 100) / 100,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};
