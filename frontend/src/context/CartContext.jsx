import { createContext, useState, useEffect, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartError, setCartError] = useState(false);

  const { userInfo } = useContext(AuthContext);

  // Fetch cart from backend.
  // Only the initial fetch controls the full-page skeleton.
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

  useEffect(() => {
    let active = true;

    const loadCart = async () => {
      if (!userInfo) {
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
  }, [userInfo]);

  const addToCart = async (product) => {
    try {
      await API.post("/cart", {
        productId: product._id,
        qty: 1,
      });

      await fetchCart();
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };

  const increaseQty = async (item) => {
    try {
      const newQty = item.qty + 1;

      await API.put("/cart", {
        productId: item.product._id,
        qty: newQty,
      });

      await fetchCart();
    } catch (error) {
      console.error("Failed to increase quantity:", error);
    }
  };

  const decreaseQty = async (item) => {
    if (item.qty === 1) {
      await removeFromCart(item);
      return;
    }

    try {
      const newQty = item.qty - 1;

      await API.put("/cart", {
        productId: item.product._id,
        qty: newQty,
      });

      await fetchCart();
    } catch (error) {
      console.error("Failed to decrease quantity:", error);
    }
  };

  const removeFromCart = async (item) => {
    try {
      await API.delete("/cart", {
        data: {
          productId: item.product._id,
        },
      });

      await fetchCart();
    } catch (error) {
      console.error("Failed to remove product from cart:", error);
    }
  };

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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
