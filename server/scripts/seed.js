const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Product = require('../models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecofinds';

const sampleUsers = [
  {
    username: 'sarah_eco',
    email: 'sarah@example.com',
    password: 'password123',
    profile: {
      firstName: 'Sarah',
      lastName: 'Miller',
      bio: 'Passionate about sustainable fashion and reducing waste. Selling quality pre-loved items!',
      location: 'San Francisco, CA'
    }
  },
  {
    username: 'tech_guru',
    email: 'techstore@example.com',
    password: 'password123',
    profile: {
      firstName: 'Mike',
      lastName: 'Johnson',
      bio: 'Certified refurbished electronics specialist. All items tested and guaranteed.',
      location: 'Austin, TX'
    }
  },
  {
    username: 'green_living',
    email: 'green@example.com',
    password: 'password123',
    profile: {
      firstName: 'Emma',
      lastName: 'Green',
      bio: 'Home decor enthusiast specializing in eco-friendly and vintage pieces.',
      location: 'Portland, OR'
    }
  }
];

const sampleProducts = [
  {
    title: 'Vintage Leather Jacket',
    description: 'Genuine leather jacket from the 90s in excellent condition. Classic brown color with brass zippers. Perfect for fall and winter. Size Medium.',
    price: 89,
    category: 'Clothing',
    condition: 'Excellent',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop'],
    tags: ['vintage', 'leather', 'jacket', 'brown', 'medium']
  },
  {
    title: 'MacBook Air 2020',
    description: 'Apple MacBook Air 13-inch with M1 chip, 8GB RAM, 256GB SSD. Includes original charger and box. Minor wear on corners, screen perfect.',
    price: 750,
    category: 'Electronics',
    condition: 'Good',
    images: ['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop'],
    tags: ['apple', 'macbook', 'laptop', 'm1', 'computer']
  },
  {
    title: 'Ceramic Plant Pot Set',
    description: 'Beautiful handmade ceramic planters in earth tones. Set of 3 different sizes with drainage holes. Perfect for succulents or small plants.',
    price: 35,
    category: 'Home',
    condition: 'Like New',
    images: ['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop'],
    tags: ['ceramic', 'planters', 'handmade', 'succulents', 'home-decor']
  },
  {
    title: 'Classic Literature Collection',
    description: 'Collection of 20 classic novels including Dickens, Austen, and Hemingway. All books in good condition with minimal wear. Great for students or book lovers.',
    price: 45,
    category: 'Books',
    condition: 'Good',
    images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop'],
    tags: ['books', 'literature', 'classics', 'collection', 'novels']
  },
  {
    title: 'Wooden Coffee Table',
    description: 'Solid wood coffee table with storage compartment. Mid-century modern design in walnut finish. Minor scratches but structurally sound.',
    price: 120,
    category: 'Furniture',
    condition: 'Very Good',
    images: ['https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop'],
    tags: ['furniture', 'coffee-table', 'wood', 'mid-century', 'storage']
  },
  {
    title: 'Board Game Bundle',
    description: 'Collection of 5 popular board games: Settlers of Catan, Ticket to Ride, Azul, Splendor, and Pandemic. All complete with original components.',
    price: 25,
    category: 'Toys',
    condition: 'Good',
    images: ['https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=400&fit=crop'],
    tags: ['board-games', 'family', 'entertainment', 'strategy', 'bundle']
  },
  {
    title: 'Designer Handbag',
    description: 'Authentic designer leather handbag in black. Includes dust bag and authenticity card. Minimal signs of wear, handles in excellent condition.',
    price: 150,
    category: 'Clothing',
    condition: 'Excellent',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop'],
    tags: ['designer', 'handbag', 'leather', 'authentic', 'luxury']
  },
  {
    title: 'Professional Camera',
    description: 'Canon EOS Rebel T7 DSLR camera with 18-55mm lens. Perfect for beginners and enthusiasts. Includes battery, charger, and camera bag.',
    price: 450,
    category: 'Electronics',
    condition: 'Very Good',
    images: ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop'],
    tags: ['camera', 'canon', 'dslr', 'photography', 'lens']
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create users
    const users = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      users.push(user);
      console.log(`👤 Created user: ${user.username}`);
    }

    // Create products
    for (let i = 0; i < sampleProducts.length; i++) {
      const productData = {
        ...sampleProducts[i],
        seller: users[i % users.length]._id
      };
      
      const product = new Product(productData);
      await product.save();
      console.log(`📦 Created product: ${product.title}`);
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('\nTest Accounts:');
    sampleUsers.forEach(user => {
      console.log(`📧 ${user.email} / 🔑 password123`);
    });

    await mongoose.disconnect();
    console.log('\n📴 Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();