const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Product = require('../models/Product');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all products with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category').optional().isIn(['Clothing', 'Electronics', 'Home', 'Books', 'Toys', 'Furniture', 'Other']),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be positive'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be positive'),
  query('condition').optional().isIn(['Like New', 'Excellent', 'Very Good', 'Good', 'Fair']),
  query('sortBy').optional().isIn(['newest', 'oldest', 'price-low', 'price-high', 'popular']),
], optionalAuth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      page = 1,
      limit = 20,
      search,
      category,
      minPrice,
      maxPrice,
      condition,
      sortBy = 'newest'
    } = req.query;

    // Build filter object
    const filter = { status: 'available' };

    if (search) {
      filter.$text = { $search: search };
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (condition) {
      filter.condition = condition;
    }

    // Build sort object
    let sort = {};
    switch (sortBy) {
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'price-low':
        sort = { price: 1 };
        break;
      case 'price-high':
        sort = { price: -1 };
        break;
      case 'popular':
        sort = { views: -1, favorites: -1 };
        break;
      default: // newest
        sort = { createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Product.countDocuments(filter)
    ]);

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProducts: total,
        hasNext: skip + parseInt(limit) < total,
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      message: 'Server error fetching products'
    });
  }
});

// Get single product by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    // Increment view count
    await Product.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json({ product });

  } catch (error) {
    console.error('Get product error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid product ID'
      });
    }
    res.status(500).json({
      message: 'Server error fetching product'
    });
  }
});

// Create new product
router.post('/', [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Description must be between 1 and 1000 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .isIn(['Clothing', 'Electronics', 'Home', 'Books', 'Toys', 'Furniture', 'Other'])
    .withMessage('Invalid category'),
  body('condition')
    .isIn(['Like New', 'Excellent', 'Very Good', 'Good', 'Fair'])
    .withMessage('Invalid condition'),
  body('images')
    .isArray({ min: 1 })
    .withMessage('At least one image is required')
], auth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const productData = {
      ...req.body,
      seller: req.user._id
    };

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      message: 'Product created successfully',
      product
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      message: 'Server error creating product'
    });
  }
});

// Update product
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 1, max: 100 }),
  body('description').optional().trim().isLength({ min: 1, max: 1000 }),
  body('price').optional().isFloat({ min: 0 }),
  body('category').optional().isIn(['Clothing', 'Electronics', 'Home', 'Books', 'Toys', 'Furniture', 'Other']),
  body('condition').optional().isIn(['Like New', 'Excellent', 'Very Good', 'Good', 'Fair']),
  body('status').optional().isIn(['available', 'sold', 'reserved', 'inactive'])
], auth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    // Check if user owns the product
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not authorized to update this product'
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Update product error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid product ID'
      });
    }
    res.status(500).json({
      message: 'Server error updating product'
    });
  }
});

// Delete product
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    // Check if user owns the product
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not authorized to delete this product'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid product ID'
      });
    }
    res.status(500).json({
      message: 'Server error deleting product'
    });
  }
});

// Get user's products
router.get('/user/my-listings', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    const filter = { seller: req.user._id };
    if (status) {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Product.countDocuments(filter)
    ]);

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProducts: total
      }
    });

  } catch (error) {
    console.error('Get user products error:', error);
    res.status(500).json({
      message: 'Server error fetching your products'
    });
  }
});

// Toggle favorite
router.post('/:id/favorite', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    const isFavorited = product.favorites.includes(req.user._id);
    
    if (isFavorited) {
      product.favorites.pull(req.user._id);
    } else {
      product.favorites.push(req.user._id);
    }

    await product.save();

    res.json({
      message: isFavorited ? 'Removed from favorites' : 'Added to favorites',
      isFavorited: !isFavorited,
      favoriteCount: product.favorites.length
    });

  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({
      message: 'Server error toggling favorite'
    });
  }
});

module.exports = router;