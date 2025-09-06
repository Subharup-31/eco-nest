const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: [1, 'Quantity must be at least 1']
  },
  priceAtTime: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalAmount: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate total amount before saving
cartSchema.pre('save', function(next) {
  this.totalAmount = this.items.reduce((total, item) => {
    return total + (item.priceAtTime * item.quantity);
  }, 0);
  this.lastUpdated = new Date();
  next();
});

// Virtual for item count
cartSchema.virtual('itemCount').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Populate product details
cartSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'items.product',
    select: 'title price images category status seller'
  });
  next();
});

module.exports = mongoose.model('Cart', cartSchema);