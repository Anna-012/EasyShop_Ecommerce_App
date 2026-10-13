import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import AdminLayout from "../components/admin/AdminLayout";

import AdminLoginPage from "../pages/auth/admin/AdminLoginPage";
import AdminDashboardPage from "../pages/admin/dashboard/AdminDashboardPage";
import AdminProductsPage from "../pages/admin/products/AdminProductsPage";
import CategoriesPage from "../pages/admin/categories/CategoriesPage";
import AddCategoryPage from "../pages/admin/categories/AddCategoryPage";
import EditCategoryPage from "../pages/admin/categories/EditCategoryPage";
import AdminOrdersPage from "../pages/admin/orders/AdminOrdersPage";
import AdminOrderDetailsPage from "../pages/admin/orders/AdminOrderDetailsPage";
import AdminSellersPage from "../pages/admin/sellers/AdminSellersPage";
import AdminSellerProductsPage from "../pages/admin/sellers/AdminSellerProductsPage";
import AdminSellerDashboard from "../pages/admin/sellers/AdminSellerDashboard";
import AdminUsersPage from "../pages/admin/users/AdminUsersPage";
import AdminUserProfilePage from "../pages/admin/users/AdminUserProfilePage";

const AdminRoutes = () => {
  return (
    <Routes>
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
  );
};

export default AdminRoutes;
