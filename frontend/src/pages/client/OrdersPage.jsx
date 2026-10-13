import { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiShoppingBag,
  FiPackage,
  FiMapPin,
  FiCalendar,
  FiArrowRight,
  FiCreditCard,
} from "react-icons/fi";

import API from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

const OrdersPage = () => {
  const { userInfo } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userInfo?.token) {
        setError("Please log in to view your orders.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const { data } = await API.get("/orders/myorders", {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });

        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError(
          err.response?.data?.message ||
            "Unable to load your orders. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userInfo?.token]);

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (price) =>
    `₹${(Number(price) || 0).toLocaleString("en-IN")}`;

  const getStatusStyle = (status) => {
    const value = String(status || "").toLowerCase();

    if (
      value.includes("deliver") ||
      value.includes("complete") ||
      value === "paid"
    ) {
      return "bg-green-50 text-green-700 ring-green-200";
    }

    if (
      value.includes("cancel") ||
      value.includes("fail") ||
      value === "pending"
    ) {
      return "bg-amber-50 text-amber-700 ring-amber-200";
    }

    return "bg-purple-50 text-purple-700 ring-purple-200";
  };

  return (
    <main className="min-h-screen bg-[#FAF9FF] px-4 py-7 sm:px-6 lg:py-10">
      <div className="mx-auto max-w-5xl">
        {/* Page heading */}
        <div className="mb-7 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-[#6D28D9]">
            <FiShoppingBag size={24} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-600">
              Your BIRD Account
            </p>
            <h1 className="text-2xl font-bold text-[#4C1D95] sm:text-3xl">
              My Orders
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Track your purchases and view delivery details.
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-purple-100 bg-white p-5"
              >
                <div className="flex gap-4">
                  <div className="h-24 w-24 shrink-0 rounded-xl bg-purple-50" />
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-4 w-2/3 rounded bg-purple-50" />
                    <div className="h-3 w-1/2 rounded bg-gray-100" />
                    <div className="h-3 w-1/3 rounded bg-gray-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <section className="rounded-2xl border border-purple-100 bg-white px-5 py-12 text-center shadow-sm">
            <FiPackage className="mx-auto text-purple-400" size={36} />

            <p className="mt-3 text-sm text-gray-600">{error}</p>

            {!userInfo?.token ? (
              <Link
                to="/login"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#6D28D9] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4C1D95]"
              >
                Login
                <FiArrowRight size={16} />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 rounded-lg bg-[#6D28D9] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4C1D95]"
              >
                Try Again
              </button>
            )}
          </section>
        ) : orders.length === 0 ? (
          /* Empty orders */
          <section className="rounded-2xl border border-purple-100 bg-white px-5 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-50 text-purple-600">
              <FiShoppingBag size={30} />
            </div>

            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              No orders yet
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
              You haven't placed an order yet. Explore BIRD and find something
              you love.
            </p>

            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-[#5B21B6] hover:to-[#6D28D9]"
            >
              Start Shopping
              <FiArrowRight size={17} />
            </Link>
          </section>
        ) : (
          /* Orders list */
          <div className="space-y-5">
            {orders.map((order) => {
              const address = order.shippingAddress || {};

              return (
                <article
                  key={order._id}
                  className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* Order header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-100 bg-purple-50/60 px-4 py-3 sm:px-5">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                        Order ID
                      </p>
                      <p className="mt-1 break-all text-sm font-semibold text-[#4C1D95]">
                        {order._id}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FiCalendar size={16} className="text-purple-600" />
                      {formatDate(order.createdAt)}
                    </div>
                  </div>

                  {/* Products */}
                  <div className="divide-y divide-gray-100 px-4 sm:px-5">
                    {(order.orderItems || []).map((item, index) => {
                      const product = item.product;

                      if (!product) return null;

                      const image = product.images?.[0] || product.image || "";

                      const productName =
                        product.title || product.name || "Product";

                      return (
                        <div
                          key={item._id || `${order._id}-${index}`}
                          className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                            {image ? (
                              <img
                                src={image}
                                alt={productName}
                                loading="lazy"
                                className="h-20 w-20 shrink-0 rounded-xl border border-purple-100 bg-[#FAF9FF] object-contain p-1 sm:h-24 sm:w-24"
                              />
                            ) : (
                              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-400 sm:h-24 sm:w-24">
                                <FiPackage size={28} />
                              </div>
                            )}

                            <div className="min-w-0">
                              <h2 className="break-words text-base font-semibold text-gray-900 sm:text-lg">
                                {productName}
                              </h2>

                              <p className="mt-1 text-sm text-gray-500">
                                Quantity: {item.qty}
                              </p>

                              <div className="mt-3 flex flex-wrap gap-2">
                                <span
                                  className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                                    order.isPaid
                                      ? "bg-green-50 text-green-700 ring-green-200"
                                      : "bg-amber-50 text-amber-700 ring-amber-200"
                                  }`}
                                >
                                  {order.isPaid ? "Paid" : "Payment Pending"}
                                </span>

                                <span
                                  className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusStyle(
                                    order.status ||
                                      (order.isDelivered
                                        ? "Delivered"
                                        : "Processing"),
                                  )}`}
                                >
                                  {order.status ||
                                    (order.isDelivered
                                      ? "Delivered"
                                      : "Processing")}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-3 sm:min-w-28 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                            <p className="text-xs text-gray-500 sm:hidden">
                              Item price
                            </p>
                            <p className="text-xl font-bold text-[#4C1D95]">
                              {formatPrice(item.price)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Delivery address */}
                  <details className="border-t border-purple-100">
                    <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-medium text-purple-700 transition hover:bg-purple-50 sm:px-5">
                      <FiMapPin size={17} />
                      View Delivery Address
                      <span className="ml-auto text-xs text-purple-500">
                        View details
                      </span>
                    </summary>

                    <div className="border-t border-purple-50 bg-[#FAF9FF] px-4 py-4 text-sm leading-6 text-gray-600 sm:px-5">
                      <p className="font-semibold text-gray-900">
                        {address.fullName || "Name not available"}
                      </p>

                      {address.phoneNumber && <p>{address.phoneNumber}</p>}

                      <p>
                        {[
                          address.houseNo,
                          address.area,
                          address.landmark,
                          address.city,
                          address.state,
                          address.pincode,
                        ]
                          .filter(Boolean)
                          .join(", ") || "Address not available"}
                      </p>

                      {order.paymentMethod && (
                        <p className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                          <FiCreditCard size={14} />
                          Payment method: {order.paymentMethod}
                        </p>
                      )}
                    </div>
                  </details>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default OrdersPage;
