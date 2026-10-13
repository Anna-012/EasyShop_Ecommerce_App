import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiShoppingBag, FiShield, FiArrowLeft } from "react-icons/fi";

import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import API from "../../services/api";

import AddressForm from "../../components/client/Checkout/AddressForm";
import PaymentMethod from "../../components/client/Checkout/PaymentMethod";

const CheckoutPage = () => {
  const navigate = useNavigate();

  const { cartItems, clearCart } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);

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

  const totalAmount = cartItems.reduce(
    (total, item) =>
      total +
      (Number(item.product?.sellingPrice) || 0) * (Number(item.qty) || 0),
    0,
  );

  const totalItems = cartItems.reduce(
    (total, item) => total + (Number(item.qty) || 0),
    0,
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAddress((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const fetchUser = async () => {
    try {
      const { data } = await API.get("/users/get-user-by-id");

      if (data.user?.address) {
        setAddress((previous) => ({
          ...previous,
          ...data.user.address,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch user address:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cartItems.length) {
      alert("Your cart is empty.");
      navigate("/");
      return;
    }

    if (!userInfo?.token) {
      alert("Please log in to place your order.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      // Save delivery address
      await API.put("/users/update-user", { address });

      const orderItems = cartItems.map((item) => ({
        product: item.product._id,
        qty: item.qty,
        price: item.product.sellingPrice,
      }));

      // Cash on Delivery
      if (paymentMethod === "COD") {
        await API.post(
          "/orders",
          {
            orderItems,
            shippingAddress: address,
            paymentMethod: "COD",
          },
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          },
        );

        alert("Order placed successfully!");
        clearCart();
        navigate("/orders");
        return;
      }

      // Razorpay
      const { data } = await API.post("/payment/create-order", {
        amount: totalAmount,
      });

      if (!window.Razorpay) {
        throw new Error("Razorpay checkout is not available.");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        order_id: data.id,
        name: "BIRD Store",
        description: "Order Payment",

        prefill: {
          name: address.fullName,
          contact: address.phoneNumber,
          email: userInfo.user?.email || "",
        },

        config: {
          display: {
            hide: [
              {
                method: "wallet",
                wallets: ["mobikwik"],
              },
            ],
            preferences: {
              show_default_blocks: true,
            },
          },
        },

        theme: {
          color: "#6D28D9",
        },

        handler: async (response) => {
          try {
            await API.post(
              "/orders",
              {
                orderItems,
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

            alert("Payment successful!");
            clearCart();
            navigate("/orders");
          } catch (error) {
            console.error("Order creation failed:", error);

            alert(
              "Payment may have been processed, but order creation failed. Please contact support before attempting another payment.",
            );
          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Checkout failed:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Checkout failed. Please try again.",
      );

      setLoading(false);
    }
  };

  const inputSectionClass =
    "rounded-2xl border border-purple-100 bg-white p-4 shadow-sm sm:p-5";

  return (
    <main className="min-h-screen bg-[#FAF9FF] px-4 py-5 sm:px-6 lg:py-6">
      <div className="mx-auto w-full max-w-6xl">
        {/* Page heading */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-600">
              BIRD Checkout
            </p>

            <h1 className="mt-1 text-2xl font-bold text-[#4C1D95] sm:text-3xl">
              Complete your order
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Confirm your delivery details and payment method.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="inline-flex items-center gap-2 rounded-lg border border-purple-200 bg-white px-3 py-2 text-sm font-medium text-purple-800 transition hover:bg-purple-50"
          >
            <FiArrowLeft size={16} />
            Back to cart
          </button>
        </div>

        {/* Empty cart */}
        {cartItems.length === 0 ? (
          <section className="rounded-2xl border border-purple-100 bg-white px-5 py-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-purple-700">
              <FiShoppingBag size={25} />
            </div>

            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Your cart is empty
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Add some products before proceeding to checkout.
            </p>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-5 rounded-lg bg-[#6D28D9] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4C1D95]"
            >
              Explore Products
            </button>
          </section>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1.35fr_1fr] lg:gap-5">
              {/* Left: Delivery Address */}
              <section className={inputSectionClass}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                    <FiMapPin size={19} />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Delivery Address
                    </h2>

                    <p className="text-sm text-gray-500">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>

                <AddressForm address={address} handleChange={handleChange} />
              </section>

              {/* Right: Payment first, Order Summary below */}
              <div className="flex min-w-0 flex-col gap-4">
                {/* Payment Method */}
                <section className={inputSectionClass}>
                  <PaymentMethod
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                  />
                </section>

                {/* Order Summary */}
                <aside className={inputSectionClass}>
                  <div className="flex items-center gap-3 border-b border-purple-100 pb-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                      <FiShoppingBag size={19} />
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Order Summary
                      </h2>

                      <p className="text-sm text-gray-500">
                        {totalItems} {totalItems === 1 ? "item" : "items"}
                      </p>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="my-3 max-h-48 space-y-3 overflow-y-auto pr-1">
                    {cartItems.map((item) => (
                      <div
                        key={item.product._id}
                        className="flex items-start justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="line-clamp-2 text-sm font-medium text-gray-800">
                            {item.product.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            Qty: {item.qty}
                          </p>
                        </div>

                        <p className="shrink-0 text-sm font-semibold text-gray-800">
                          ₹
                          {(
                            (Number(item.product.sellingPrice) || 0) *
                            (Number(item.qty) || 0)
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Price details */}
                  <div className="space-y-2.5 border-t border-purple-100 pt-3">
                    <div className="flex justify-between gap-3 text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span>₹{totalAmount.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="flex justify-between gap-3 text-sm text-gray-600">
                      <span>Shipping</span>
                      <span className="font-medium text-green-600">
                        Included / as configured
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-purple-100 pt-3">
                      <span className="font-semibold text-gray-900">Total</span>

                      <span className="text-xl font-bold text-[#4C1D95]">
                        ₹{totalAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Place Order */}
                  <button
                    type="submit"
                    disabled={loading || cartItems.length === 0}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-[#5B21B6] hover:to-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <FiShield size={17} />
                    {loading ? "Processing..." : "Place Order"}
                  </button>

                  <p className="mt-2 text-center text-xs text-gray-400">
                    Your order details are submitted securely.
                  </p>
                </aside>
              </div>
            </div>
          </form>
        )}
      </div>
    </main>
  );
};

export default CheckoutPage;
