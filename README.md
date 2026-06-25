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

## 🛠️ Setup Instructions

### Prerequisites
- Node.js installed locally.
- MongoDB running locally or a MongoDB Atlas URI.

---

### Step 1: Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
4. Update `.env` with your credentials:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_signing_secret

   # Optional: Image uploads will fallback to local storage if left empty
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

---

### Step 2: Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser at `http://localhost:5173`.

---

## 🧪 Admin/Test Login Credentials
You can register a new account on the Sign Up screen or use these test credentials (assuming database contains these records or you register them):
- **Email**: `test@example.com`
- **Password**: `password123`
