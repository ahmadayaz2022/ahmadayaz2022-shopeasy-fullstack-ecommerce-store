# ShopEasy - Full Stack E-Commerce Application

A complete full-stack e-commerce application built with React, Node.js, Express, and MongoDB. Features include product management, shopping cart, checkout with payment simulation, order tracking, admin dashboard, and multi-currency support.

---

## 📸 Screenshots

### Home Page
![Home](https://via.placeholder.com/800x400?text=Home+Page)

### Admin Dashboard
![Admin](https://via.placeholder.com/800x400?text=Admin+Dashboard)

---

## ✨ Features

### 👤 Customer Features
- 🏠 Modern, responsive homepage with hero section and category showcase
- 🛍️ Browse products by category, subcategory with search and filter
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🔍 Product search with real-time filtering
- 📄 Product detail page with image gallery and size selection
- 🛒 Shopping cart with quantity controls (add, remove, update quantity)
- 💳 Multi-step checkout process (Shipping → Payment → Review)
- 💰 Multiple payment methods (Cash on Delivery, Credit Card, Debit Card, PayPal)
- 📦 Order history with status tracking and progress bar
- 📊 Order filtering (All, Pending, Processing, Shipped, Delivered, Cancelled)
- 🌍 Multi-currency support (USD, PKR, EUR, GBP, AED, SAR, INR)
- ❤️ Wishlist functionality (UI ready)
- 📧 Newsletter subscription
- 👤 User registration and login with JWT authentication
- 📱 Hamburger menu with offcanvas navigation
- 🎨 Clean, modern UI with smooth animations

### 🔧 Admin Features
- 📊 Dashboard with real-time stats (Products, Orders, Users, Revenue)
- ➕ Add products with multiple image upload and preview
- ✏️ Edit products with image management (add/remove/restore images)
- 🗑️ Delete products with confirmation modal
- 📋 Dynamic category and subcategory management
- ➕ Add new categories and subcategories on the fly
- 👥 User management (View all users, edit roles, delete users)
- 📦 Order management (View all orders, update order status)
- 📊 User statistics (Total, Admin, Customer, New This Month)
- 🖼️ Image upload with preview and drag-drop support
- 📱 Floating action button for quick product addition on mobile
- 🎨 Admin-specific UI with stats cards and data tables

### 🛡️ Security & Technical
- JWT token-based authentication
- Password hashing with bcryptjs
- Protected API routes with middleware
- Role-based access control (Admin/Customer)
- Form validation on frontend and backend
- Error handling with toast notifications
- Loading states and spinners
- Environment variable configuration

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.x | UI Library |
| React Router | 6.x | Client-side routing |
| React Bootstrap | 2.x | UI Components |
| Bootstrap | 5.x | CSS Framework |
| Axios | 1.x | HTTP Client |
| React Icons | 4.x | Icon Library |
| React Toastify | 9.x | Toast Notifications |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 16+ | Runtime Environment |
| Express.js | 4.x | Web Framework |
| MongoDB | 6.x | Database |
| Mongoose | 7.x | ODM for MongoDB |
| JWT | 9.x | Authentication |
| bcryptjs | 2.x | Password Hashing |
| Multer | 1.x | File Uploads |
| CORS | 2.x | Cross-Origin Requests |
| dotenv | 16.x | Environment Variables |

---

## 📁 Project Structure
ecommerce-app/
├── backend/
│ ├── config/
│ │ └── db.js # Database connection
│ ├── controllers/
│ │ ├── authController.js # Authentication logic
│ │ ├── cartController.js # Cart operations
│ │ ├── categoryController.js # Category management
│ │ ├── orderController.js # Order processing
│ │ ├── productController.js # Product CRUD
│ │ └── userController.js # User management
│ ├── middleware/
│ │ ├── authMiddleware.js # JWT verification
│ │ ├── errorMiddleware.js # Error handling
│ │ └── uploadMiddleware.js # File upload config
│ ├── models/
│ │ ├── Cart.js # Cart schema
│ │ ├── Category.js # Category schema
│ │ ├── Order.js # Order schema
│ │ ├── Product.js # Product schema
│ │ └── User.js # User schema
│ ├── routes/
│ │ ├── authRoutes.js # Auth endpoints
│ │ ├── cartRoutes.js # Cart endpoints
│ │ ├── categoryRoutes.js # Category endpoints
│ │ ├── orderRoutes.js # Order endpoints
│ │ ├── productRoutes.js # Product endpoints
│ │ └── userRoutes.js # User endpoints
│ ├── uploads/ # Uploaded images
│ ├── createAdmin.js # Admin seeder script
│ ├── seedCategories.js # Category seeder script
│ ├── fixOrderIndex.js # Database fix script
│ ├── server.js # Main server file
│ ├── package.json
│ └── .env
│
├── frontend/
│ ├── public/
│ │ └── index.html
│ ├── src/
│ │ ├── components/
│ │ │ ├── Common/
│ │ │ │ ├── AdminRoute.js # Admin route guard
│ │ │ │ └── PrivateRoute.js # Auth route guard
│ │ │ └── Layout/
│ │ │ ├── Footer.js # Footer component
│ │ │ └── Navbar.js # Navbar component
│ │ ├── context/
│ │ │ ├── AuthContext.js # Auth state management
│ │ │ └── CartContext.js # Cart state management
│ │ ├── pages/
│ │ │ ├── Admin/
│ │ │ │ ├── AdminAddProduct.js
│ │ │ │ ├── AdminDashboard.js
│ │ │ │ ├── AdminEditProduct.js
│ │ │ │ ├── AdminOrders.js
│ │ │ │ ├── AdminProducts.js
│ │ │ │ └── AdminUsers.js
│ │ │ ├── AboutPage.js
│ │ │ ├── CartPage.js
│ │ │ ├── CheckoutPage.js
│ │ │ ├── ContactPage.js
│ │ │ ├── HomePage.js
│ │ │ ├── LoginPage.js
│ │ │ ├── MissionVisionPage.js
│ │ │ ├── OrderHistoryPage.js
│ │ │ ├── ProductDetailPage.js
│ │ │ ├── ProductPage.js
│ │ │ ├── RegisterPage.js
│ │ │ └── TeamPage.js
│ │ ├── services/
│ │ │ └── api.js # API service configuration
│ │ ├── utils/
│ │ │ └── currencyHelper.js # Currency formatting utility
│ │ ├── App.js # Main app component
│ │ ├── App.css # Global styles
│ │ └── index.js # Entry point
│ └── package.json
│
├── .gitignore
└── README.md



---

## 🚀 Installation and Setup

### Prerequisites

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (Local or Atlas) - [Download](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/cloud/atlas)
- **npm** (comes with Node.js) or **yarn**

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/ecommerce-app.git
cd ecommerce-app

Backend Setup:
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << 'EOF'
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
EOF

# Seed the admin user
node createAdmin.js

# Seed default categories
node seedCategories.js

# Start the backend server
npm start
# Or with nodemon for development
npx nodemon server.js

Backend runs on: http://localhost:5000


Frontend Setup:
# Open a new terminal
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm start

Frontend runs on: http://localhost:3000

Access the Application
Frontend: http://localhost:3000

API: http://localhost:5000

Test Customer Account
Register a new account at /register

📡 API Endpoints
Authentication
Method	Endpoint	Description	Access
POST	/api/auth/register	Register new user	Public
POST	/api/auth/login	Login user	Public

Products
Method	Endpoint	Description	Access
GET	/api/products	Get all products	Public
GET	/api/products/:id	Get single product	Public
POST	/api/products	Add new product	Admin
PUT	/api/products/:id	Update product	Admin
DELETE	/api/products/:id	Delete product	Admin

Categories
Method	Endpoint	Description	Access
GET	/api/categories	Get all categories	Public
POST	/api/categories	Add category	Admin
POST	/api/categories/:id/subcategory	Add subcategory	Admin

Cart
Method	Endpoint	Description	Access
GET	/api/cart	Get user cart	Protected
POST	/api/cart	Add item to cart	Protected
DELETE	/api/cart/:id	Remove item from cart	Protected
Orders
Method	Endpoint	Description	Access
POST	/api/orders	Create order	Protected
GET	/api/orders/my	Get user orders	Protected
GET	/api/orders	Get all orders	Admin
PUT	/api/orders/:id	Update order status	Admin
Users
Method	Endpoint	Description	Access
GET	/api/users	Get all users	Admin
GET	/api/users/stats	Get user statistics	Admin
GET	/api/users/:id	Get single user	Admin
PUT	/api/users/:id	Update user	Admin
DELETE	/api/users/:id	Delete user	Admin
🎨 Features in Detail
Homepage
Hero banner with CTA buttons

Category showcase with dynamic images

Best sellers section

Trending products

Trust badges (Free Shipping, Secure Payment, Easy Returns)

Newsletter subscription

Responsive design for all screen sizes

Product Management
Multi-image upload with preview

Dynamic categories and subcategories

Size selection (S, M, L, XL, XXL)

Stock management

Bestseller marking

Multi-currency pricing

Image gallery with thumbnails

Shopping Cart
Add/remove items

Quantity adjustment (+/-)

Price calculation with tax and shipping

Free shipping threshold indicator

Promo code input (UI ready)

Secure checkout badge

Checkout Process
3-step checkout (Shipping → Payment → Review)

Progress indicator

Multiple payment methods

Simulated card payment with 90% success rate

Order summary sidebar

Form validation

Order Management
Order history with filtering

Order status tracking (Pending → Processing → Shipped → Delivered)

Progress bar for visual status

Cancel order option (for pending orders)

Detailed order view with items, shipping, payment info

Admin Dashboard
Stats cards (Products, Orders, Users, Revenue)

Product management table

User management with search

Order management with status updates

Category management

Image upload management


✨ Features
🔐 User Authentication (JWT)
🛍️ Product Management (Admin)
🛒 Add to Cart & Checkout
💳 Stripe Payment Integration
☁️ Image Upload with Cloudinary
📦 Order Management System
🔎 Search & Filter Products
📱 Responsive UI
🎯 Future Enhancements
Product reviews and ratings system
Real payment gateway integration (Stripe/PayPal)
Email notifications for orders
PDF invoice generation
Advanced analytics dashboard
Product comparison feature
Wishlist functionality
Social media login (Google/Facebook)
Live chat support
Multi-language support (i18n)
PWA support for mobile app-like experience
Redis caching for performance
Unit and integration testing
Docker containerization
CI/CD pipeline setup

###👨‍💻 Author Details
Ahmad Ayaz
GitHub: https://github.com/ahmadayaz2022
Email: ahmadayaz2022@gmail.com


###🙏 Acknowledgments
React
Bootstrap
MongoDB
Express.js
Node.js
Unsplash (for placeholder images)
React Icons
React Toastify