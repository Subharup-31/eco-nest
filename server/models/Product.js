const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Clothing', 'Electronics', 'Home', 'Books', 'Toys', 'Furniture', 'Other']
  },
  condition: {
    type: String,
    required: [true, 'Condition is required'],
    enum: ['Like New', 'Excellent', 'Very Good', 'Good', 'Fair']
  },
  images: [{
    type: String,
    required: [true, 'At least one image is required']
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'reserved', 'inactive'],
    default: 'available'
  },
  location: {
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  shipping: {
    available: {
      type: Boolean,
      default: true
    },
    cost: {
      type: Number,
      default: 0
    },
    methods: [{
      type: String,
      enum: ['pickup', 'standard', 'express', 'overnight']
    }]
  },
  tags: [String],
  views: {
    type: Number,
    default: 0
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isPromoted: {
    type: Boolean,
    default: false
  },
  promotedUntil: Date
}, {
  timestamps: true
});

// Indexes for better performance
productSchema.index({ seller: 1 });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ title: 'text', description: 'text' });

// Virtual for favorite count
productSchema.virtual('favoriteCount').get(function() {
  return this.favorites.length;
});

// Populate seller info by default
productSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'seller',
    select: 'username profile.firstName profile.lastName ratings'
  });
  next();
});

module.exports = mongoose.model('Product', productSchema);