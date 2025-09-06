const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      message: 'Server error fetching profile'
    });
  }
});

// Update user profile
router.put('/profile', [
  body('username')
    .optional()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('profile.firstName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('First name cannot exceed 50 characters'),
  body('profile.lastName')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Last name cannot exceed 50 characters'),
  body('profile.bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  body('profile.location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location cannot exceed 100 characters'),
  body('profile.phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number')
], auth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { username, email, profile } = req.body;

    // Check if username or email already exists (excluding current user)
    if (username || email) {
      const existingUser = await User.findOne({
        _id: { $ne: req.user._id },
        $or: [
          ...(username ? [{ username }] : []),
          ...(email ? [{ email }] : [])
        ]
      });

      if (existingUser) {
        return res.status(400).json({
          message: existingUser.email === email 
            ? 'Email already in use' 
            : 'Username already taken'
        });
      }
    }

    // Update user
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (profile) {
      updateData.profile = { ...req.user.profile, ...profile };
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      message: 'Server error updating profile'
    });
  }
});

// Get user's purchase history
router.get('/orders', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    const filter = { buyer: req.user._id };
    if (status) {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('items.product', 'title images category')
        .populate('items.seller', 'username profile.firstName profile.lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(filter)
    ]);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalOrders: total
      }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      message: 'Server error fetching orders'
    });
  }
});

// Get single order
router.get('/orders/:orderId', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      buyer: req.user._id
    })
    .populate('items.product', 'title images category')
    .populate('items.seller', 'username profile.firstName profile.lastName');

    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    res.json({ order });

  } catch (error) {
    console.error('Get order error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid order ID'
      });
    }
    res.status(500).json({
      message: 'Server error fetching order'
    });
  }
});

// Get user's sales
router.get('/sales', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    const filter = { 'items.seller': req.user._id };
    if (status) {
      filter.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('buyer', 'username profile.firstName profile.lastName')
        .populate('items.product', 'title images category')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(filter)
    ]);

    // Filter items to only show those sold by current user
    const filteredOrders = orders.map(order => ({
      ...order.toObject(),
      items: order.items.filter(item => 
        item.seller.toString() === req.user._id.toString()
      )
    }));

    res.json({
      orders: filteredOrders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalOrders: total
      }
    });

  } catch (error) {
    console.error('Get sales error:', error);
    res.status(500).json({
      message: 'Server error fetching sales'
    });
  }
});

// Get user dashboard statistics
router.get('/dashboard', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      activeListings,
      totalSales,
      totalPurchases,
      recentActivity
    ] = await Promise.all([
      Product.countDocuments({ seller: userId, status: 'available' }),
      Order.countDocuments({ 'items.seller': userId }),
      Order.countDocuments({ buyer: userId }),
      Order.find({
        $or: [
          { buyer: userId },
          { 'items.seller': userId }
        ]
      })
      .populate('items.product', 'title images')
      .sort({ createdAt: -1 })
      .limit(5)
    ]);

    // Calculate total earnings
    const salesOrders = await Order.find({ 'items.seller': userId });
    const totalEarnings = salesOrders.reduce((total, order) => {
      const userItems = order.items.filter(item => 
        item.seller.toString() === userId.toString()
      );
      return total + userItems.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );
    }, 0);

    res.json({
      stats: {
        activeListings,
        totalSales,
        totalPurchases,
        totalEarnings: Math.round(totalEarnings * 100) / 100
      },
      recentActivity
    });

  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      message: 'Server error fetching dashboard data'
    });
  }
});

// Get user's favorite products
router.get('/favorites', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
      Product.find({ 
        favorites: req.user._id,
        status: 'available'
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
      Product.countDocuments({ 
        favorites: req.user._id,
        status: 'available'
      })
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
    console.error('Get favorites error:', error);
    res.status(500).json({
      message: 'Server error fetching favorites'
    });
  }
});

module.exports = router;