import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/client/HomePage";
import ProductPage from "./pages/client/ProductPage";
import CartPage from "./pages/client/CartPage";
import { useContext } from "react";
import { CartContext } from "./context/CartContext";
import CheckoutPage from "./pages/client/CheckoutPage";
import LoginPage from "./pages/auth/LoginPage";
import OrdersPage from "./pages/client/OrdersPage";
import { AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RegisterPage from "./pages/auth/RegisterPage";
import Navbar from "./components/client/Navbar/Navbar";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyOtp from "./pages/auth/VerifyOtp";
import AdminOrdersPage from "./pages/admin/orders/AdminOrdersPage";
import AdminOrderDetailsPage from "./pages/admin/orders/AdminOrderDetailsPage";
import AddProducts from "./pages/seller/products/AddProducts";
import SellerRegisterPage from "./pages/auth/seller/SellerRegisterPage";
import SelllerLoginPage from "./pages/auth/seller/SellerLoginPage";
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProductsPage from "./pages/seller/products/SellerProductsPage";
import SellerOrdersPage from "./pages/seller/orders/SellerOrdersPage";
import SellerProfilePage from "./pages/seller/profile/SellerProfilePage";
import AdminDashboardPage from "./pages/admin/dashboard/AdminDashboardPage";
import AdminLoginPage from "./pages/auth/admin/AdminLoginPage";
import AdminLayout from "./components/admin/AdminLayout";
import AdminProductsPage from "./pages/admin/products/AdminProductsPage";
import CategoriesPage from "./pages/admin/categories/CategoriesPage";
import AddCategoryPage from "./pages/admin/categories/AddCategoryPage";
import AdminSellersPage from "./pages/admin/sellers/AdminSellersPage";
import AdminUsersPage from "./pages/admin/users/AdminUsersPage";
import AdminSellerProductsPage from "./pages/admin/sellers/AdminSellerProductsPage";
import EditCategoryPage from "./pages/admin/categories/EditCategoryPage";
import AdminSellerDashboard from "./pages/admin/sellers/AdminSellerDashboard";
import AdminUserProfilePage from "./pages/admin/users/AdminUserProfilePage";

const AppContent = () => {
  const location = useLocation();

  const hideNavbar =
    location.pathname.startsWith("/seller") ||
    location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route
          path="/admin/orders/:id"
          element={
            <ProtectedRoute>
              <AdminOrderDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        {/* Seller Routes */}
        <Route path="/seller/add-product" element={<AddProducts />} />
        <Route path="/seller/add-product/:id" element={<AddProducts />} />
        <Route path="/seller/register" element={<SellerRegisterPage />} />
        <Route path="/seller/login" element={<SelllerLoginPage />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/seller/products" element={<SellerProductsPage />} />
        <Route path="/seller/orders" element={<SellerOrdersPage />} />
        <Route path="/seller/profile" element={<SellerProfilePage />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminDashboardPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminProductsPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <CategoriesPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories/add"
          element={
            <AdminLayout>
              <AddCategoryPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/sellers"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminSellersPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminUsersPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminOrdersPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/seller/:sellerId/products"
          element={<AdminSellerProductsPage />}
        />
        <Route
          path="/admin/categories/edit/:id"
          element={<EditCategoryPage />}
        />

        <Route
          path="/admin/seller/:sellerId/dashboard"
          element={<AdminSellerDashboard />}
        />

        <Route path="/admin/users/:id" element={<AdminUserProfilePage />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
