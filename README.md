# EcoFinds - Sustainable Second-Hand Marketplace

A full-stack web application built with React, Tailwind CSS, Express.js, and MongoDB. EcoFinds connects buyers and sellers in a sustainable marketplace for pre-loved items.

## 🌟 Features

- **User Authentication** - JWT-based registration and login
- **Product Listings** - Create, edit, and manage product listings
- **Smart Search & Filtering** - Find items by category, price, condition
- **Shopping Cart** - Add items and checkout seamlessly
- **User Dashboard** - Track sales, purchases, and earnings
- **Responsive Design** - Mobile-first, beautiful UI with Tailwind CSS
- **Sustainable Focus** - Promoting circular economy and waste reduction

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ and npm
- **MongoDB** (local installation or MongoDB Atlas account)

### 1. Clone Repository

```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

### 2. Frontend Setup

```bash
# Install frontend dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on `http://localhost:8080`

### 3. Backend Setup

```bash
# Navigate to server directory
cd server

# Install backend dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Seed database with sample data
npm run seed

# Start backend server
npm run dev
```

Backend runs on `http://localhost:5000`

## 🗄️ Database Setup

### Option 1: Local MongoDB

1. **Install MongoDB Community Edition**
   - [Download for your OS](https://www.mongodb.com/try/download/community)

2. **Start MongoDB Service**
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community
   
   # Ubuntu/Debian
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   ```

3. **Update .env file**
   ```env
   MONGODB_URI=mongodb://localhost:27017/ecofinds
   ```

### Option 2: MongoDB Atlas (Cloud)

1. **Create Account**
   - Sign up at [mongodb.com/atlas](https://mongodb.com/atlas)

2. **Create Cluster**
   - Choose free tier
   - Note your connection string

3. **Update .env file**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecofinds
   ```

## 🔑 Environment Variables

Create `server/.env` file:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/ecofinds

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Server
PORT=5000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:8080
```

## 🌱 Sample Data

The seed script creates test accounts and products:

```bash
cd server
npm run seed
```

**Test Accounts:**
- `sarah@example.com` / `password123`
- `techstore@example.com` / `password123`  
- `green@example.com` / `password123`

## 🏗️ Tech Stack

### Frontend
- **React** - Component-based UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icon library
- **shadcn/ui** - Re-usable component library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## 📁 Project Structure

```
ecofinds/
├── src/                    # React frontend
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── lib/               # Utilities and API client
│   └── hooks/             # Custom React hooks
├── server/                # Express backend
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth and validation
│   └── scripts/           # Database utilities
└── README.md
```

## 🚀 Production Deployment

### Frontend (Lovable)
1. Open your [Lovable Project](https://lovable.dev/projects/6fab3069-bd29-4109-948a-67c9ea270a4a)
2. Click **Share → Publish**
3. Your app will be deployed with a custom URL

### Backend Options

**Railway (Recommended)**
1. Connect GitHub repository
2. Deploy from `server/` directory
3. Add environment variables
4. Connect to MongoDB Atlas

**Heroku**
1. Create new app
2. Connect GitHub repo
3. Set buildpack to Node.js
4. Configure environment variables

**DigitalOcean App Platform**
1. Import from GitHub
2. Configure build settings
3. Add environment variables

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filters)
- `POST /api/products` - Create new product
- `GET /api/products/:id` - Get single product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Cart & Orders
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/checkout` - Checkout cart
- `GET /api/user/orders` - Get purchase history

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/dashboard` - Get dashboard stats

## 🛠️ Development

### Running Both Servers

**Terminal 1 (Frontend):**
```bash
npm run dev
```

**Terminal 2 (Backend):**
```bash
cd server
npm run dev
```

### Adding New Features

1. **Backend**: Add routes in `server/routes/`
2. **Frontend**: Create components in `src/components/`
3. **API Integration**: Update `src/lib/api.ts`
4. **Styling**: Use design system in `src/index.css`

## 🐛 Troubleshooting

### Common Issues

**CORS Errors**
- Check `FRONTEND_URL` in `server/.env`
- Ensure both servers are running

**Database Connection**
- Verify MongoDB is running
- Check `MONGODB_URI` format
- Test connection with MongoDB Compass

**Authentication Issues**
- Confirm `JWT_SECRET` is set
- Check browser local storage for token
- Verify API endpoints are working

### Getting Help

1. Check browser console for errors
2. Check server logs for API errors
3. Test API endpoints with Postman
4. Verify environment variables

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ for sustainable commerce
