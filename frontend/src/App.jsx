import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import Navbar from "./components/client/Navbar";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyOtp from "./pages/auth/VerifyOtp";

const App = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);

  // const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
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
      </Routes>
    </BrowserRouter>
  );
};

export default App;
