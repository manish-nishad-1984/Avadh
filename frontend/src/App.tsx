import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SettingsProvider } from './context/SettingsContext';
import { Toaster } from 'react-hot-toast';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Public Pages
import { Home } from './pages/public/Home';
import { CategoryList } from './pages/public/CategoryList';
import { ProductDetail } from './pages/public/ProductDetail';
import { CartPage } from './pages/public/CartPage';
import { SearchPage } from './pages/public/SearchPage';
import { InquiryConfirmation } from './pages/public/InquiryConfirmation';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CategoryManagement } from './pages/admin/CategoryManagement';
import { ProductManagement } from './pages/admin/ProductManagement';
import { InquiryManagement } from './pages/admin/InquiryManagement';
import { InquiryDetail } from './pages/admin/InquiryDetail';
import { BannerManagement } from './pages/admin/BannerManagement';
import { WebsiteSettings } from './pages/admin/WebsiteSettings';

// Protected Route Guard
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white font-serif">
        Loading Session...
      </div>
    );
  }
  if (!user && !token) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <SettingsProvider>
          <CartProvider>
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            <Routes>
              {/* Public Storefront Routes */}
              <Route
                path="/"
                element={
                  <PublicLayout>
                    <Home />
                  </PublicLayout>
                }
              />
              <Route
                path="/categories"
                element={
                  <PublicLayout>
                    <CategoryList />
                  </PublicLayout>
                }
              />
              <Route
                path="/category/:slug"
                element={
                  <PublicLayout>
                    <CategoryList />
                  </PublicLayout>
                }
              />
              <Route
                path="/product/:slug"
                element={
                  <PublicLayout>
                    <ProductDetail />
                  </PublicLayout>
                }
              />
              <Route
                path="/cart"
                element={
                  <PublicLayout>
                    <CartPage />
                  </PublicLayout>
                }
              />
              <Route
                path="/search"
                element={
                  <PublicLayout>
                    <SearchPage />
                  </PublicLayout>
                }
              />
              <Route
                path="/inquiry/confirm"
                element={
                  <PublicLayout>
                    <InquiryConfirmation />
                  </PublicLayout>
                }
              />

              {/* Admin Login Route */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Admin ERP Routes */}
              <Route
                path="/admin"
                element={<Navigate to="/admin/dashboard" replace />}
              />
              <Route
                path="/admin/*"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout>
                      <Routes>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="categories" element={<CategoryManagement />} />
                        <Route path="products" element={<ProductManagement />} />
                        <Route path="inquiries" element={<InquiryManagement />} />
                        <Route path="inquiries/:id" element={<InquiryDetail />} />
                        <Route path="banners" element={<BannerManagement />} />
                        <Route path="settings" element={<WebsiteSettings />} />
                        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                      </Routes>
                    </AdminLayout>
                  </ProtectedAdminRoute>
                }
              />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CartProvider>
        </SettingsProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
