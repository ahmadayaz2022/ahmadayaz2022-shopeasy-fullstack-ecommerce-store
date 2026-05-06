# ShopEasy

ShopEasy is a professional, full-stack e-commerce application built with React, Node.js, Express, and MongoDB. It delivers a polished shopping experience for customers and a full admin dashboard for store management.

---

## What This Project Offers

- End-to-end shopping experience for customers
- Admin control panel for products, categories, users, and orders
- Secure authentication with role-based access
- Cloud-ready configuration for MongoDB Atlas
- Responsive design optimized for mobile and desktop

---

## Highlights

### Customer Experience
- Modern, responsive storefront
- Product browsing by category and search
- Product detail pages with image gallery
- Shopping cart with item quantity control
- Checkout workflow with order review
- Order history and status tracking
- Multi-currency pricing display

### Admin Experience
- Dashboard with key business metrics
- Product CRUD with image upload support
- Category and subcategory management
- Order status updates and workflow control
- User administration and role management

### Technical Strengths
- JWT authentication and route protection
- Password hashing with bcryptjs
- Structured controllers and middleware
- Cloud-compatible image upload flow
- Environment-driven configuration

---

## Tech Stack

### Frontend
- React
- React Router
- React Bootstrap
- Bootstrap
- Axios
- React Icons
- React Toastify

### Backend
- Node.js
- Express
- MongoDB / Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- Multer
- CORS
- dotenv

---

## Project Structure

```
ShopEasy/
|-- backend/
|   |-- config/db.js
|   |-- controllers/authController.js
|   |-- controllers/cartController.js
|   |-- controllers/categoryController.js
|   |-- controllers/orderController.js
|   |-- controllers/productController.js
|   |-- controllers/userController.js
|   |-- middleware/authMiddleware.js
|   |-- middleware/errorMiddleware.js
|   |-- middleware/uploadMiddleware.js
|   |-- models/Cart.js
|   |-- models/Category.js
|   |-- models/Order.js
|   |-- models/Product.js
|   |-- models/User.js
|   |-- routes/authRoutes.js
|   |-- routes/cartRoutes.js
|   |-- routes/categoryRoutes.js
|   |-- routes/orderRoutes.js
|   |-- routes/productRoutes.js
|   |-- routes/userRoutes.js
|   |-- uploads/
|   |-- createAdmin.js
|   |-- seedCategories.js
|   |-- fixOrderIndex.js
|   |-- server.js
|   |-- package.json
|   |-- .env
|-- frontend/
|   |-- public/index.html
|   |-- src/api/axios.js
|   |-- src/assets/
|   |-- src/components/Admin/
|   |-- src/components/Layout/Footer.jsx
|   |-- src/components/Layout/Navbar.jsx
|   |-- src/components/BestSellers.jsx
|   |-- src/components/CategorySection.jsx
|   |-- src/components/Hero.jsx
|   |-- src/components/LatestCollection.jsx
|   |-- src/components/Newsletter.jsx
|   |-- src/components/ProductCard.jsx
|   |-- src/components/ProductItem.jsx
|   |-- src/components/ProtectedRoute.jsx
|   |-- src/components/PrivatRouts.jsx
|   |-- src/config/constants.js
|   |-- src/context/AuthContext.js
|   |-- src/context/CartContext.js
|   |-- src/context/StoreContext.jsx
|   |-- src/hooks/useAuth.js
|   |-- src/hooks/useCart.js
|   |-- src/pages/Admin/AdminAddProduct.jsx
|   |-- src/pages/Admin/AdminDashboard.jsx
|   |-- src/pages/Admin/AdminEditProduct.jsx
|   |-- src/pages/Admin/AdminOrders.jsx
|   |-- src/pages/Admin/AdminProducts.jsx
|   |-- src/pages/Admin/AdminUsers.jsx
|   |-- src/pages/Admin/ProductList.jsx
|   |-- src/pages/AboutPage.jsx
|   |-- src/pages/Cart.jsx
|   |-- src/pages/CheckoutPage.jsx
|   |-- src/pages/ContactPage.jsx
|   |-- src/pages/HomePage.jsx
|   |-- src/pages/LoginPage.jsx
|   |-- src/pages/OrderHistoryPage.jsx
|   |-- src/pages/ProductDetail.jsx
|   |-- src/pages/ProductPage.jsx
|   |-- src/pages/RegisterPage.jsx
|   |-- src/pages/productpage.jsx
|   |-- src/routes/AppRoutes.jsx
|   |-- src/utils/currencyHelper.js
|   |-- src/App.css
|   |-- src/App.js
|   |-- src/index.js
|   |-- package.json
|-- .gitignore
|-- README.md
```

---

## Setup Instructions

### Prerequisites
- Node.js 16+ installed
- npm or yarn installed
- MongoDB Atlas account or local MongoDB instance

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder with the following values:

```env
PORT=5000
MONGO_URI=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
STRIPE_SECRET_KEY=your_stripe_secret
```

### Frontend Setup

```bash
cd frontend
npm install
```

---

## Run Locally

### Start backend server

```bash
cd backend
npm start
```

or for development mode:

```bash
cd backend
npx nodemon server.js
```

### Start frontend server

```bash
cd frontend
npm start
```

Open the app at `http://localhost:3000` and the API at `http://localhost:5000`.

---

## API Summary

### Authentication
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Sign in and receive JWT

### Products
- `GET /api/products` — Get all products
- `GET /api/products/:id` — Get product details
- `POST /api/products` — Create product (admin only)
- `PUT /api/products/:id` — Update product (admin only)
- `DELETE /api/products/:id` — Delete product (admin only)

### Categories
- `GET /api/categories` — Get categories
- `POST /api/categories` — Add category (admin only)
- `POST /api/categories/:id/subcategory` — Add subcategory (admin only)

### Cart
- `GET /api/cart` — Get user cart
- `POST /api/cart` — Add item to cart
- `DELETE /api/cart/:id` — Remove item from cart

### Orders
- `POST /api/orders` — Create order
- `GET /api/orders/my` — Get current user orders
- `GET /api/orders` — Get all orders (admin only)
- `PUT /api/orders/:id` — Update order status (admin only)

### Users
- `GET /api/users` — Get all users (admin only)
- `GET /api/users/stats` — Get user statistics (admin only)
- `GET /api/users/:id` — Get user details (admin only)
- `PUT /api/users/:id` — Update user (admin only)
- `DELETE /api/users/:id` — Delete user (admin only)

---

## Future Improvements

- Reviews and ratings system
- Real payment gateway integration (Stripe, PayPal)
- Email notifications and alerts
- PDF invoice generation
- Advanced analytics and reports
- Social login (Google, Facebook)
- Wishlist and product comparison
- Improved performance with caching and SSR
- Docker containerization

---

## Author
**Ahmad Ayaz**

- GitHub: https://github.com/ahmadayaz2022
- Email: ahmadayaz2022@gmail.com

---

## Notes

- Keep `.env` files secret and never commit them to GitHub.
- Use MongoDB Atlas for cloud deployment or a local MongoDB instance for development.
- Run `backend/createAdmin.js` to seed an admin user if needed.
