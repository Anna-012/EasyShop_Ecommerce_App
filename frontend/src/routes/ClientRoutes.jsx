import { Route, Routes } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

import LoginPage from "../pages/auth/client/LoginPage";
import RegisterPage from "../pages/auth/client/RegisterPage";
import ForgotPassword from "../pages/auth/client/ForgotPassword";
import VerifyOtp from "../pages/auth/client/VerifyOtp";
import ResetPassword from "../pages/auth/client/ResetPassword";

import HomePage from "../pages/client/HomePage";
import ProductPage from "../pages/client/ProductPage";
import CartPage from "../pages/client/CartPage";
import CheckoutPage from "../pages/client/CheckoutPage";
import OrdersPage from "../pages/client/OrdersPage";

import ProtectedRoute from "../components/auth/ProtectedRoute";

const ClientRoutes = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>

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
    </Routes>
  );
};

export default ClientRoutes;
