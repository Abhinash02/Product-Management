# MERN Product Marketplace

A premium MERN Product Marketplace featuring JWT auth, dynamic category tabs, product CRUD, wishlists, multi-image slider uploads via Cloudinary (local fallback), inline profile editing, forgot password, dashboard stats, pagination, and dark/light modes. 100% styled with Tailwind CSS.

---

## 🌟 Key Features

- **User Authentication**: Secure register & login utilizing JWT tokens, custom field validators, and password hashing (bcrypt).
- **Interactive Dashboard**: Home page with a responsive layout showing product listings, search filters, and sorting.
- **Product Management**: Full CRUD capabilities (create, read, update, delete) for owners.
- **Wishlist System**: Integrated like/unlike toggles saved on MongoDB database.
- **Profile Screen**: User info summary and metrics showing product actions.
- **Cloudinary Image Upload**: Direct upload support for product images, with a **graceful local storage fallback** if credentials are not provided.
- **Advanced UI Design**: Dark/Light mode toggle, smooth transition effects, glassmorphic layout elements, and rich toast notifications powered by `react-hot-toast`.

---

## 📁 Project Structure

```text
product-marketplace/
├── backend/
│   ├── config/             # DB & Cloudinary configs
│   ├── controllers/        # Express handlers (Auth, Products)
│   ├── middleware/         # Auth & Multer middlewares
│   ├── models/             # Mongoose schemas (User, Product)
│   ├── routes/             # API routing endpoints
│   ├── uploads/            # Local uploads fallback directory
│   ├── .env.example        # Env variables template
│   └── server.js           # Server entry point
└── frontend/
    ├── src/
    │   ├── components/     # Navbar, components
    │   ├── context/        # Auth Context state
    │   ├── pages/          # Login, SignUp, Home, Form, Wishlist, Profile
    │   ├── utils/          # Axios configurations
    │   ├── index.css       # Tailwind & custom CSS layers
    │   └── App.jsx         # App routing structure
    └── tailwind.config.js  # Tailwind utility configuration
```

---

## 🚀 Quick Setup

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

**Environment Variables (`.env`)**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Frontend
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
---

## 🧪 Admin/Test Login Credentials
You can register a new account on the Sign Up screen or use these test credentials (assuming database contains these records or you register them):
- **Email**: `abhinash@gmail.com`
- **Password**: `abhinash`
