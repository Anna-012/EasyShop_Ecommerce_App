import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

// Client authentication
import LoginPage from "./pages/auth/client/LoginPage";
import RegisterPage from "./pages/auth/client/RegisterPage";
import ForgotPassword from "./pages/auth/client/ForgotPassword";
import VerifyOtp from "./pages/auth/client/VerifyOtp";
import ResetPassword from "./pages/auth/client/ResetPassword";

// Client pages
import HomePage from "./pages/client/HomePage";
import ProductPage from "./pages/client/ProductPage";
import CartPage from "./pages/client/CartPage";
import CheckoutPage from "./pages/client/CheckoutPage";
import OrdersPage from "./pages/client/OrdersPage";

// Authentication
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Seller authentication
import SellerLoginPage from "./pages/auth/seller/SellerLoginPage";
import SellerRegisterPage from "./pages/auth/seller/SellerRegisterPage";

// Seller pages
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProductsPage from "./pages/seller/products/SellerProductsPage";
import AddProducts from "./pages/seller/products/AddProducts";
import SellerOrdersPage from "./pages/seller/orders/SellerOrdersPage";
import SellerProfilePage from "./pages/seller/profile/SellerProfilePage";

// Admin authentication
import AdminLoginPage from "./pages/auth/admin/AdminLoginPage";

// Admin layout and pages
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboardPage from "./pages/admin/dashboard/AdminDashboardPage";
import AdminProductsPage from "./pages/admin/products/AdminProductsPage";
import CategoriesPage from "./pages/admin/categories/CategoriesPage";
import AddCategoryPage from "./pages/admin/categories/AddCategoryPage";
import EditCategoryPage from "./pages/admin/categories/EditCategoryPage";
import AdminOrdersPage from "./pages/admin/orders/AdminOrdersPage";
import AdminOrderDetailsPage from "./pages/admin/orders/AdminOrderDetailsPage";
import AdminSellersPage from "./pages/admin/sellers/AdminSellersPage";
import AdminSellerProductsPage from "./pages/admin/sellers/AdminSellerProductsPage";
import AdminSellerDashboard from "./pages/admin/sellers/AdminSellerDashboard";
import AdminUsersPage from "./pages/admin/users/AdminUsersPage";
import AdminUserProfilePage from "./pages/admin/users/AdminUserProfilePage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* CLIENT AUTHENTICATION */}

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

        {/* CLIENT PAGES */}

        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Route>

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        {/* SELLER AUTHENTICATION */}

        <Route path="/seller/login" element={<SellerLoginPage />} />

        <Route path="/seller/register" element={<SellerRegisterPage />} />

        {/* SELLER PAGES */}

        <Route
          path="/seller/dashboard"
          element={
            <ProtectedRoute>
              <SellerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller/products"
          element={
            <ProtectedRoute>
              <SellerProductsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller/add-product"
          element={
            <ProtectedRoute>
              <AddProducts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller/add-product/:id"
          element={
            <ProtectedRoute>
              <AddProducts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller/orders"
          element={
            <ProtectedRoute>
              <SellerOrdersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller/profile"
          element={
            <ProtectedRoute>
              <SellerProfilePage />
            </ProtectedRoute>
          }
        />

        {/* ADMIN AUTHENTICATION */}

        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* ADMIN PAGES */}

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
            <ProtectedRoute>
              <AdminLayout>
                <AddCategoryPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/categories/edit/:id"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <EditCategoryPage />
              </AdminLayout>
            </ProtectedRoute>
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
          path="/admin/seller/:sellerId/products"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminSellerProductsPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/seller/:sellerId/dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminSellerDashboard />
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
          path="/admin/users/:id"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminUserProfilePage />
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
          path="/admin/orders/:id"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminOrderDetailsPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
