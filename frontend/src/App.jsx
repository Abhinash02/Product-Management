import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ProductForm from './pages/ProductForm';
import LikedProducts from './pages/LikedProducts';
import Profile from './pages/Profile';

// Route Guard to protect auth-only routes
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
          <Header />
          <main className="flex-grow flex flex-col">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected Routes */}
              <Route 
                path="/add-product" 
                element={
                  <PrivateRoute>
                    <ProductForm />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/edit-product/:id" 
                element={
                  <PrivateRoute>
                    <ProductForm />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/liked-products" 
                element={
                  <PrivateRoute>
                    <LikedProducts />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                } 
              />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            duration: 4500,
            style: {
              background: '#0f172a',
              color: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              fontSize: '14px',
              fontWeight: '500'
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
            }
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
