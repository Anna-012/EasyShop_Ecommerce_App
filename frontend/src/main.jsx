import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.jsx";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext.jsx";

import { Toaster } from "react-hot-toast";

function Root() {
  useEffect(() => {
    window.hideBirdLoader?.();
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <SearchProvider>
          <App />
          <Toaster position="top-center" />
        </SearchProvider>
      </CartProvider>
    </AuthProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
