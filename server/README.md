# EcoFinds Backend API

Express.js + MongoDB backend for the EcoFinds sustainable marketplace.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env with your settings
   nano .env
   ```

4. **Required Environment Variables:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/ecofinds
   JWT_SECRET=your-super-secret-jwt-key-here
   PORT=5000
   FRONTEND_URL=http://localhost:8080
   ```

   **For MongoDB Atlas:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecofinds
   ```

### 🗄️ Database Setup

**Option 1: Local MongoDB**
1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community
   
   # Ubuntu/Debian
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   ```

**Option 2: MongoDB Atlas (Cloud)**
1. Create account at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create new cluster
3. Get connection string and update `MONGODB_URI`

### 🌱 Seed Sample Data

```bash
# Seed database with sample users and products
npm run seed
```

**Test Accounts Created:**
- `sarah@example.com` / `password123`
- `techstore@example.com` / `password123`
- `green@example.com` / `password123`

### 🏃‍♂️ Run Development Server

```bash
# Start with auto-reload
npm run dev

# Or start normally
npm start
```

Server runs on `http://localhost:5000`

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (auth required)
- `PUT /api/products/:id` - Update product (auth required)
- `DELETE /api/products/:id` - Delete product (auth required)
- `GET /api/products/user/my-listings` - Get user's products (auth required)
- `POST /api/products/:id/favorite` - Toggle favorite (auth required)

### Cart
- `GET /api/cart` - Get user's cart (auth required)
- `POST /api/cart/add` - Add item to cart (auth required)
- `PUT /api/cart/update/:itemId` - Update cart item (auth required)
- `DELETE /api/cart/remove/:itemId` - Remove from cart (auth required)
- `DELETE /api/cart/clear` - Clear cart (auth required)
- `POST /api/cart/checkout` - Checkout cart (auth required)

### User
- `GET /api/user/profile` - Get user profile (auth required)
- `PUT /api/user/profile` - Update profile (auth required)
- `GET /api/user/orders` - Get purchase history (auth required)
- `GET /api/user/sales` - Get sales history (auth required)
- `GET /api/user/dashboard` - Get dashboard stats (auth required)
- `GET /api/user/favorites` - Get favorite products (auth required)

## 🔧 Frontend Integration

Update your React app's API calls to point to:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

Add authentication headers:
```javascript
const token = localStorage.getItem('token');
const headers = {
  'Content-Type': 'application/json',
  ...(token && { 'Authorization': `Bearer ${token}` })
};
```

## 🚀 Production Deployment

### Environment Variables
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=https://your-frontend-domain.com
```

### Deployment Options
- **Heroku**: Connect GitHub repo, set env vars
- **Railway**: Import from GitHub, configure variables
- **DigitalOcean App Platform**: Deploy from GitHub
- **AWS/GCP/Azure**: Use their container/app services

### Database
- **MongoDB Atlas**: Recommended for production
- **Self-hosted**: Ensure proper security and backups

## 🔒 Security Features

- JWT authentication with 7-day expiry
- Password hashing with bcrypt
- Input validation with express-validator
- Rate limiting (100 requests/15 minutes)
- CORS protection
- Helmet.js security headers
- MongoDB injection protection

## 📊 Data Models

### User
- Authentication (username, email, password)
- Profile (name, bio, location, phone, avatar)
- Stats (items sold/bought, earnings, ratings)

### Product
- Details (title, description, price, category, condition)
- Images and metadata
- Seller information
- Status tracking (available, sold, reserved)
- Favorites and view tracking

### Cart
- User association
- Items with quantity and price-at-time
- Auto-calculated totals

### Order
- Buyer and seller tracking
- Order items with individual status
- Shipping and payment information
- Order number generation

## 🛠️ Development

### Project Structure
```
server/
├── models/         # MongoDB schemas
├── routes/         # API endpoints
├── middleware/     # Authentication, validation
├── scripts/        # Database seeding
├── .env.example    # Environment template
└── index.js        # Server entry point
```

### Adding New Features
1. Create/update models in `models/`
2. Add routes in `routes/`
3. Add middleware if needed
4. Test with sample data
5. Update frontend integration

### Common Issues
- **CORS errors**: Check `FRONTEND_URL` in `.env`
- **Auth failing**: Verify `JWT_SECRET` is set
- **DB connection**: Confirm `MONGODB_URI` format
- **Port conflicts**: Change `PORT` in `.env`

## 📞 Support

For issues or questions:
1. Check the logs for error details
2. Verify environment variables
3. Test API endpoints with Postman/curl
4. Ensure database connectivity

Happy coding! 🌱