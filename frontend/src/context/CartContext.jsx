import { createContext, useState, useEffect, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const CartContext = createContext();

const showToast = (message) => {
  toast.error(message, {
    position: "top-center",
    style: {
      background: "#6D28D9",
      color: "#FFFFFF",
      borderRadius: "12px",
    },
  });
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState(false);

  const { userInfo } = useContext(AuthContext);

  // Fetch cart from backend
  const fetchCart = async ({ initial = false } = {}) => {
    if (initial) {
      setCartLoading(true);
      setCartError(false);
    }

    try {
      const { data } = await API.get("/cart");
      setCartItems(data.items || []);
      return true;
    } catch (error) {
      console.error("Failed to fetch cart:", error);

      if (initial) {
        setCartError(true);
      }

      return false;
    } finally {
      if (initial) {
        setCartLoading(false);
      }
    }
  };

  // Load cart when user logs in
  useEffect(() => {
    let active = true;

    const loadCart = async () => {
      if (!userInfo?.token) {
        setCartItems([]);
        setCartLoading(false);
        setCartError(false);
        return;
      }

      setCartLoading(true);
      setCartError(false);

      try {
        const { data } = await API.get("/cart");

        if (active) {
          setCartItems(data.items || []);
        }
      } catch (error) {
        console.error("Failed to load initial cart:", error);

        if (active) {
          setCartError(true);
        }
      } finally {
        if (active) {
          setCartLoading(false);
        }
      }
    };

    loadCart();

    return () => {
      active = false;
    };
  }, [userInfo?.token]);

  // Add product to cart
  const addToCart = async (product) => {
    if (!userInfo?.token) {
      showToast("Please log in to add products to your cart.");
      return false;
    }

    if (!product?._id) {
      showToast("Invalid product.");
      return false;
    }

    const stock = Number(product.stockQuantity);

    if (!Number.isFinite(stock) || stock < 1) {
      showToast("This product is currently out of stock.");
      return false;
    }

    // Check existing cart quantity
    const existingItem = cartItems.find((item) => {
      const existingProduct = item.product;
      const existingId =
        typeof existingProduct === "object"
          ? existingProduct?._id
          : existingProduct;

      return String(existingId) === String(product._id);
    });

    const existingQty = Number(existingItem?.qty || 0);

    // Prevent adding beyond available stock
    if (existingQty + 1 > stock) {
      showToast(
        `Only ${stock} ${stock === 1 ? "item" : "items"} available in stock.`,
      );
      return false;
    }

    try {
      await API.post("/cart", {
        productId: product._id,
        qty: 1,
      });

      // Refresh cart after a successful addition
      await fetchCart();

      toast.success("Product added to cart!", {
        position: "top-center",
        style: {
          background: "#6D28D9",
          color: "#FFFFFF",
          borderRadius: "12px",
        },
      });

      return true;
    } catch (error) {
      console.error(
        "Failed to add product:",
        error.response?.data || error.message,
      );

      showToast(
        error.response?.data?.message || "Failed to add product to cart.",
      );

      return false;
    }
  };

  // Increase quantity in cart
  const increaseQty = async (item) => {
    const stock = Number(item.product?.stockQuantity || 0);

    if (item.qty >= stock) {
      showToast(
        `Only ${stock} ${stock === 1 ? "item" : "items"} available in stock.`,
      );
      return;
    }

    try {
      await API.put("/cart", {
        productId: item.product._id,
        qty: item.qty + 1,
      });

      await fetchCart();
    } catch (error) {
      console.error("Failed to increase quantity:", error);

      showToast(error.response?.data?.message || "Could not update quantity.");
    }
  };

  // Decrease quantity in cart
  const decreaseQty = async (item) => {
    if (item.qty <= 1) {
      await removeFromCart(item);
      return;
    }

    try {
      await API.put("/cart", {
        productId: item.product._id,
        qty: item.qty - 1,
      });

      await fetchCart();
    } catch (error) {
      console.error("Failed to decrease quantity:", error);

      showToast(error.response?.data?.message || "Could not update quantity.");
    }
  };

  // Remove product from cart
  const removeFromCart = async (item) => {
    try {
      await API.delete("/cart", {
        data: {
          productId: item.product._id,
        },
      });

      await fetchCart();
    } catch (error) {
      console.error("Failed to remove product:", error);

      showToast(
        error.response?.data?.message || "Could not remove product from cart.",
      );
    }
  };

  // Clear local cart state
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartLoading,
        cartError,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
