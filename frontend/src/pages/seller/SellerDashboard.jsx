import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPackage,
  FiShoppingBag,
  FiDollarSign,
  FiArrowUpRight,
  FiArrowRight,
  FiCalendar,
  FiBox,
  FiRefreshCw,
} from "react-icons/fi";

import SellerLayout from "../../components/seller/SellerLayout";
import API from "../../services/api";

const SellerDashboard = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
    recentOrders: [],
    latestProducts: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch dashboard data
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await API.get("/seller/dashboard");

      setDashboard({
        totalProducts: data.totalProducts ?? 0,
        totalOrders: data.totalOrders ?? 0,
        revenue: data.revenue ?? 0,
        recentOrders: data.recentOrders || [],
        latestProducts: data.latestProducts || [],
      });
    } catch (err) {
      console.error("Dashboard loading error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load your dashboard. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Format currency
  const formatPrice = (price) =>
    `₹${Number(price || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

  // Format date
  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Order status colors
  const getStatusStyle = (status) => {
    const value = String(status || "Processing").toLowerCase();

    if (value.includes("deliver") || value.includes("complete")) {
      return "bg-emerald-50 text-emerald-700";
    }

    if (value.includes("cancel") || value.includes("fail")) {
      return "bg-red-50 text-red-600";
    }

    if (value.includes("ship")) {
      return "bg-blue-50 text-blue-700";
    }

    return "bg-amber-50 text-amber-700";
  };

  // Summary statistics
  const stats = [
    {
      title: "Total Products",
      value: dashboard.totalProducts.toLocaleString("en-IN"),
      icon: FiPackage,
      path: "/seller/products",
    },
    {
      title: "Total Orders",
      value: dashboard.totalOrders.toLocaleString("en-IN"),
      icon: FiShoppingBag,
      path: "/seller/orders",
    },
    {
      title: "Total Revenue",
      value: formatPrice(dashboard.revenue),
      icon: FiDollarSign,
      path: null,
    },
  ];

  return (
    <SellerLayout>
      <main className="min-h-screen min-w-0 bg-[#F8F7FA] px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-9">
        <div className="mx-auto w-full max-w-[1600px] min-w-0">
          {/* Page heading */}
          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#6D28D9]">
                Seller workspace
              </p>

              <h1 className="text-3xl font-semibold tracking-tight text-[#241A31] sm:text-4xl">
                Seller Dashboard
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
                Welcome back! Here’s what’s happening with your store.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchDashboard}
              disabled={loading}
              className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-lg border border-[#E7E0EF] bg-white px-4 py-2.5 text-sm font-medium text-[#4C1D95] transition hover:border-[#C8B5E5] hover:bg-[#FCFAFF] disabled:cursor-not-allowed disabled:opacity-60 sm:self-center"
            >
              <FiRefreshCw
                size={15}
                className={loading ? "animate-spin" : ""}
              />
              Refresh data
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 flex flex-col gap-3 rounded-xl border border-red-100 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-red-600">{error}</p>

              <button
                type="button"
                onClick={fetchDashboard}
                className="self-start text-sm font-semibold text-[#6D28D9] hover:text-[#4C1D95]"
              >
                Try again
              </button>
            </div>
          )}

          {/* Summary cards */}
          <section
            aria-label="Store statistics"
            className="mb-9 grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
          >
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <button
                  type="button"
                  key={stat.title}
                  onClick={() => stat.path && navigate(stat.path)}
                  disabled={!stat.path}
                  className={`group min-w-0 rounded-xl border border-[#EAE5EF] bg-white p-6 text-left transition duration-200 hover:border-[#D6C5E9] hover:shadow-[0_6px_24px_rgba(45,25,70,0.05)] sm:p-7 ${
                    stat.path ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-gray-500 sm:text-base">
                      {stat.title}
                    </span>

                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#F4F0F9] text-[#5B3488]">
                      <Icon size={21} />
                    </span>
                  </div>

                  <p className="mt-6 break-words text-3xl font-semibold tracking-tight text-[#352047] sm:text-4xl">
                    {loading ? (
                      <span className="inline-block h-9 w-24 animate-pulse rounded-md bg-gray-100" />
                    ) : (
                      stat.value
                    )}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-400">
                      {stat.path ? "View details" : "Store earnings overview"}
                    </span>

                    {stat.path && (
                      <FiArrowUpRight
                        size={18}
                        className="text-gray-300 transition group-hover:text-[#6D28D9]"
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </section>

          {/* Recent Orders and Latest Products */}
          <div className="grid min-w-0 grid-cols-1 items-start gap-6 xl:grid-cols-2">
            {/* Recent Orders */}
            <section className="min-w-0 overflow-hidden rounded-xl border border-[#EAE5EF] bg-white">
              <div className="flex items-center justify-between gap-4 border-b border-[#F0EDF3] px-5 py-5 sm:px-7">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold tracking-tight text-[#241A31] sm:text-xl">
                    Recent Orders
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Keep track of customer orders
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/seller/orders")}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-[#5B3488] transition hover:bg-[#F8F5FC]"
                >
                  View all
                  <FiArrowRight size={15} />
                </button>
              </div>

              <div className="p-4 sm:p-5">
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="h-[76px] animate-pulse rounded-lg bg-[#F8F7FA]"
                      />
                    ))}
                  </div>
                ) : dashboard.recentOrders.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F4F0F9] text-[#5B3488]">
                      <FiShoppingBag size={22} />
                    </div>

                    <p className="text-sm font-semibold text-gray-700">
                      No orders yet
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      New orders will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dashboard.recentOrders.map((order) => (
                      <div
                        key={order._id}
                        className="flex min-w-0 flex-wrap items-center justify-between gap-3 rounded-lg border border-[#F0EDF3] p-4 transition hover:bg-[#FCFBFD] sm:flex-nowrap"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F4F0F9] text-[#5B3488]">
                            <FiPackage size={19} />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#352047]">
                              Order #{String(order._id || "").slice(-6)}
                            </p>

                            <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                              <FiCalendar size={12} />
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="ml-12 flex flex-wrap items-center justify-between gap-3 sm:ml-0 sm:justify-end">
                          <p className="text-sm font-semibold text-[#352047]">
                            {formatPrice(order.totalPrice)}
                          </p>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyle(
                              order.status,
                            )}`}
                          >
                            {order.status || "Processing"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Latest Products */}
            <section className="min-w-0 overflow-hidden rounded-xl border border-[#EAE5EF] bg-white">
              <div className="flex items-center justify-between gap-4 border-b border-[#F0EDF3] px-5 py-5 sm:px-7">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold tracking-tight text-[#241A31] sm:text-xl">
                    Latest Products
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Your recently added products
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/seller/products")}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-[#5B3488] transition hover:bg-[#F8F5FC]"
                >
                  View all
                  <FiArrowRight size={15} />
                </button>
              </div>

              <div className="p-4 sm:p-5">
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="h-[88px] animate-pulse rounded-lg bg-[#F8F7FA]"
                      />
                    ))}
                  </div>
                ) : dashboard.latestProducts.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F4F0F9] text-[#5B3488]">
                      <FiBox size={22} />
                    </div>

                    <p className="text-sm font-semibold text-gray-700">
                      No products found
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Add your first product to get started.
                    </p>

                    <button
                      type="button"
                      onClick={() => navigate("/seller/add-product")}
                      className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#4C1D95] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#3B1675]"
                    >
                      <FiPackage size={16} />
                      Add Product
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dashboard.latestProducts.map((product) => {
                      const image = product.images?.[0] || product.image || "";

                      return (
                        <div
                          key={product._id}
                          className="flex min-w-0 items-center gap-3 rounded-lg border border-[#F0EDF3] p-3.5 transition hover:bg-[#FCFBFD] sm:gap-4 sm:p-4"
                        >
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F8F6FA] sm:h-[72px] sm:w-[72px]">
                            {image ? (
                              <img
                                src={image}
                                alt={product.title || "Product"}
                                loading="lazy"
                                className="h-full w-full object-contain p-1.5"
                              />
                            ) : (
                              <FiPackage size={24} className="text-[#B7A8C8]" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="truncate text-sm font-semibold text-[#352047]">
                              {product.title || "Untitled Product"}
                            </h3>

                            <p className="mt-1.5 text-sm font-semibold text-[#5B3488]">
                              {formatPrice(product.sellingPrice)}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              Stock: {product.stockQuantity ?? 0}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => navigate("/seller/products")}
                            aria-label={`View ${product.title || "product"}`}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-[#F4F0F9] hover:text-[#5B3488]"
                          >
                            <FiArrowUpRight size={19} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </SellerLayout>
  );
};

export default SellerDashboard;
