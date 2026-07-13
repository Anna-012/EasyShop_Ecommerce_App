import { useState, useContext, useEffect } from "react";
import { CartContext } from "../../context/CartContext";
import API from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    fullName: "",
    phoneNumber: "",
    houseNo: "",
    area: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
  });

  const { cartItems, clearCart } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Save address
      await API.put("/users/update-user", {
        address,
      });

      // Calculate total amount
      const totalAmount = cartItems.reduce(
        (acc, item) => acc + item.product.sellingPrice * item.qty,
        0,
      );

      //cod

      if (paymentMethod === "COD") {
        await API.post(
          "/orders",
          {
            orderItems: cartItems.map((item) => ({
              product: item.product._id,
              qty: item.qty,
              price: item.product.sellingPrice,
            })),

            shippingAddress: address,

            paymentMethod: "COD",
          },
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          },
        );

        alert("Order Placed Successfully");

        clearCart();

        navigate("/orders");

        setLoading(false);
        return;
      }

      // ==========================
      // RAZORPAY
      // ==========================

      const { data } = await API.post("/payment/create-order", {
        amount: totalAmount,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: data.amount,

        currency: data.currency,

        order_id: data.id,

        name: "Bird Store",

        description: "Order Payment",

        prefill: {
          name: address.fullName,
          contact: address.phoneNumber,
          email: userInfo.user.email,
        },

        theme: {
          color: "#000000",
        },

        handler: async function (response) {
          try {
            await API.post(
              "/orders",
              {
                orderItems: cartItems.map((item) => ({
                  product: item.product._id,
                  qty: item.qty,
                  price: item.product.sellingPrice,
                })),

                shippingAddress: address,

                paymentMethod: "Razorpay",

                paymentResult: {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                },
              },
              {
                headers: {
                  Authorization: `Bearer ${userInfo.token}`,
                },
              },
            );

            alert("Payment Successful");

            clearCart();

            navigate("/orders");
          } catch (error) {
            console.log(error);
            alert("Order creation failed");
          }
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();

      setLoading(false);
    } catch (error) {
      console.log(error);

      setLoading(false);

      alert("Payment failed");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await API.get("/users/get-user-by-id");

      if (data.user.address) {
        setAddress(data.user.address);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-6 max-w-md">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="fullName"
          className="w-full border p-2 rounded"
          type="text"
          placeholder="Full Name"
          value={address.fullName}
          onChange={handleChange}
        />

        <input
          className="w-full border p-2 rounded"
          name="phoneNumber"
          type="text"
          maxLength={10}
          inputMode="numeric"
          placeholder="Phone Number"
          value={address.phoneNumber}
          onChange={handleChange}
        />

        <input
          className="w-full border p-2 rounded"
          name="houseNo"
          type="text"
          placeholder="House No"
          value={address.houseNo}
          onChange={handleChange}
        />

        <input
          className="w-full border p-2 rounded"
          name="area"
          type="text"
          placeholder="Area"
          value={address.area}
          onChange={handleChange}
        />

        <input
          className="w-full border p-2 rounded"
          name="landmark"
          type="text"
          placeholder="Landmark"
          value={address.landmark}
          onChange={handleChange}
        />

        <input
          className="w-full border p-2 rounded"
          name="city"
          type="text"
          placeholder="City"
          value={address.city}
          onChange={handleChange}
        />

        <input
          className="w-full border p-2 rounded"
          name="state"
          type="text"
          placeholder="State"
          value={address.state}
          onChange={handleChange}
        />

        <input
          className="w-full border p-2 rounded"
          name="pincode"
          type="text"
          maxLength={6}
          placeholder="Pincode"
          value={address.pincode}
          onChange={handleChange}
        />

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">Payment Method</h2>

          <label className="flex items-center gap-2 mb-2">
            <input
              type="radio"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Cash on Delivery
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="Razorpay"
              checked={paymentMethod === "Razorpay"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Razorpay
          </label>
        </div>

        <button
          className="bg-black text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
