import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "../components/auth/ProtectedRoute";

import SellerLoginPage from "../pages/auth/seller/SellerLoginPage";
import SellerRegisterPage from "../pages/auth/seller/SellerRegisterPage";

import SellerDashboard from "../pages/seller/SellerDashboard";
import SellerProductsPage from "../pages/seller/products/SellerProductsPage";
import AddProducts from "../pages/seller/products/AddProducts";
import SellerOrdersPage from "../pages/seller/orders/SellerOrdersPage";
import SellerProfilePage from "../pages/seller/profile/SellerProfilePage";

const SellerRoutes = () => {
  return (
    <Routes>
      <Route path="/seller/login" element={<SellerLoginPage />} />
      <Route path="/seller/register" element={<SellerRegisterPage />} />

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
    </Routes>
  );
};

export default SellerRoutes;
