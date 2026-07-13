import { createContext, useState, useEffect, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { userInfo } = useContext(AuthContext);

  // Fetch logged-in user's cart from backend
  const fetchCart = async () => {
    try {
      const { data } = await API.get("/cart");
      setCartItems(data.items);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userInfo) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [userInfo]);

  const addToCart = async (product) => {
    try {
      await API.post("/cart", {
        productId: product._id,
        qty: 1,
      });
      await fetchCart();
    } catch (error) {
      console.log(error);
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
      console.log(error);
    }
  };

  const decreaseQty = async (item) => {
    try {
      if (item.qty === 1) {
        await removeFromCart(item);
        return;
      } else {
        const newQty = item.qty - 1;
        await API.put("/cart", {
          productId: item.product._id,
          qty: newQty,
        });
        await fetchCart();
      }
    } catch (error) {
      console.log(error);
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
      console.log(error);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
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
