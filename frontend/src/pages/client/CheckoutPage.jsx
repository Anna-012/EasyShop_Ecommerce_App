import { useState, useContext } from "react";
import { CartContext } from "../../context/CartContext";
import API from "../../services/api";

const CheckoutPage = () => {
  const [address, setAddress] = useState("");
  const { cartItems, clearCart } = useContext(CartContext);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post(
        "/orders",
        {
          orderItems: cartItems.map((item) => ({
            product: item._id,
            qty: item.qty,
            price: item.price,
          })),
          shippingAddress: {
            address: address,
          },
          paymentMethod: "COD",
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      alert("Order Placed!");

      clearCart();
    } catch (error) {
      console.error(error);
      alert("Order failed");
    }
  };

  return (
    <div className="p-6 max-w-md">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          placeholder="Enter your address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button className="bg-black text-white px-4 py-2 rounded">
          Place Order
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
