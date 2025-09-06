const express = require('express');
const { body, validationResult } = require('express-validator');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
      await cart.save();
    }

    res.json({ cart });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      message: 'Server error fetching cart'
    });
  }
});

// Add item to cart
router.post('/add', [
  body('productId')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer')
], auth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { productId, quantity = 1 } = req.body;

    // Check if product exists and is available
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    if (product.status !== 'available') {
      return res.status(400).json({
        message: 'Product is not available for purchase'
      });
    }

    // Can't add your own product to cart
    if (product.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: 'Cannot add your own product to cart'
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if item already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        priceAtTime: product.price
      });
    }

    await cart.save();

    res.json({
      message: 'Item added to cart successfully',
      cart
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      message: 'Server error adding item to cart'
    });
  }
});

// Update cart item quantity
router.put('/update/:itemId', [
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer')
], auth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { quantity } = req.body;
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        message: 'Cart not found'
      });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        message: 'Item not found in cart'
      });
    }

    item.quantity = quantity;
    await cart.save();

    res.json({
      message: 'Cart updated successfully',
      cart
    });

  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      message: 'Server error updating cart'
    });
  }
});

// Remove item from cart
router.delete('/remove/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        message: 'Cart not found'
      });
    }

    cart.items.pull(itemId);
    await cart.save();

    res.json({
      message: 'Item removed from cart successfully',
      cart
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      message: 'Server error removing item from cart'
    });
  }
});

// Clear entire cart
router.delete('/clear', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        message: 'Cart not found'
      });
    }

    cart.items = [];
    await cart.save();

    res.json({
      message: 'Cart cleared successfully',
      cart
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      message: 'Server error clearing cart'
    });
  }
});

// Checkout - convert cart to order
router.post('/checkout', [
  body('shipping')
    .optional()
    .isObject()
    .withMessage('Shipping info must be an object'),
  body('paymentMethod')
    .optional()
    .isIn(['cash', 'card', 'digital_wallet', 'bank_transfer'])
    .withMessage('Invalid payment method')
], auth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { shipping, paymentMethod = 'cash' } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: 'Cart is empty'
      });
    }

    // Verify all products are still available
    const productIds = cart.items.map(item => item.product);
    const products = await Product.find({ 
      _id: { $in: productIds }, 
      status: 'available' 
    });

    if (products.length !== cart.items.length) {
      return res.status(400).json({
        message: 'Some items in your cart are no longer available'
      });
    }

    // Create order items
    const orderItems = cart.items.map(item => {
      const product = products.find(p => p._id.toString() === item.product.toString());
      return {
        product: item.product,
        seller: product.seller,
        quantity: item.quantity,
        price: item.priceAtTime
      };
    });

    // Create order
    const order = new Order({
      buyer: req.user._id,
      items: orderItems,
      totalAmount: cart.totalAmount,
      shipping,
      payment: {
        method: paymentMethod
      }
    });

    await order.save();

    // Mark products as sold/reserved
    await Product.updateMany(
      { _id: { $in: productIds } },
      { status: 'reserved' }
    );

    // Clear cart
    cart.items = [];
    await cart.save();

    res.json({
      message: 'Order placed successfully',
      order
    });

  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({
      message: 'Server error during checkout'
    });
  }
});

module.exports = router;