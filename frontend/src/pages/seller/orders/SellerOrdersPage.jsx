import { useEffect, useState } from "react";
import {
  FiShoppingBag,
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiSearch,
  FiRefreshCw,
  FiCalendar,
} from "react-icons/fi";
import toast from "react-hot-toast";

import API from "../../../services/api";
import SellerLayout from "../../../components/seller/SellerLayout";

const SellerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [updatingOrders, setUpdatingOrders] = useState([]);

  // Fetch seller orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await API.get("/orders/seller-orders");

      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (err) {
      console.error("Failed to fetch seller orders:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load orders. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status
  const updateStatus = async (orderId, status) => {
    const previousOrder = orders.find((order) => order._id === orderId);

    if (!previousOrder || previousOrder.status === status) return;

    setUpdatingOrders((current) => [...current, orderId]);

    // Update UI immediately
    setOrders((current) =>
      current.map((order) =>
        order._id === orderId ? { ...order, status } : order,
      ),
    );

    try {
      const { data } = await API.patch(
        `/orders/seller-orders/${orderId}/status`,
        { status },
      );

      toast.success(data.message || "Order status updated");
    } catch (err) {
      console.error("Failed to update order status:", err);

      // Restore previous status on failure
      setOrders((current) =>
        current.map((order) =>
          order._id === orderId
            ? { ...order, status: previousOrder.status }
            : order,
        ),
      );

      toast.error(
        err.response?.data?.message || "Unable to update order status",
      );
    } finally {
      setUpdatingOrders((current) => current.filter((id) => id !== orderId));
    }
  };

  const formatPrice = (price) =>
    `₹${Number(price || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;

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

  const getOrderStatusStyle = (status) => {
    switch (status) {
      case "Placed":
        return "bg-amber-50 text-amber-700";

      case "Processing":
        return "bg-blue-50 text-blue-700";

      case "Shipped":
        return "bg-purple-50 text-[#5B3488]";

      case "Delivered":
        return "bg-emerald-50 text-emerald-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      !query ||
      String(order._id || "")
        .toLowerCase()
        .includes(query) ||
      order.user?.name?.toLowerCase().includes(query) ||
      order.user?.email?.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = [
    {
      label: "Total Orders",
      value: orders.length,
      icon: FiShoppingBag,
      description: "Orders containing your products",
    },
    {
      label: "Placed",
      value: orders.filter((order) => order.status === "Placed").length,
      icon: FiPackage,
      description: "Awaiting processing",
    },
    {
      label: "Shipped",
      value: orders.filter((order) => order.status === "Shipped").length,
      icon: FiClock,
      description: "On their way to customers",
    },
    {
      label: "Delivered",
      value: orders.filter((order) => order.status === "Delivered").length,
      icon: FiCheckCircle,
      description: "Successfully delivered",
    },
  ];

  return (
    <SellerLayout>
      <main className="min-h-screen min-w-0 bg-[#F8F7FA] px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-9">
        <div className="mx-auto w-full max-w-[1600px] min-w-0">
          {/* Header */}
          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#6D28D9]">
                Order management
              </p>

              <h1 className="text-3xl font-semibold tracking-tight text-[#241A31] sm:text-4xl">
                Orders
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
                View and manage orders containing your products.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchOrders}
              disabled={loading}
              className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-lg border border-[#E7E0EF] bg-white px-4 py-2.5 text-sm font-medium text-[#4C1D95] transition hover:border-[#C8B5E5] hover:bg-[#FCFAFF] disabled:cursor-not-allowed disabled:opacity-60 sm:self-center"
            >
              <FiRefreshCw
                size={15}
                className={loading ? "animate-spin" : ""}
              />
              Refresh orders
            </button>
          </div>

          {/* Error state */}
          {error && (
            <div className="mb-6 flex flex-col gap-3 rounded-xl border border-red-100 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-red-600">{error}</p>

              <button
                type="button"
                onClick={fetchOrders}
                className="self-start text-sm font-semibold text-[#5B3488] hover:text-[#4C1D95]"
              >
                Try again
              </button>
            </div>
          )}

          {/* Statistics */}
          <section
            aria-label="Order statistics"
            className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5"
          >
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-xl border border-[#EAE5EF] bg-white p-5 transition hover:border-[#D6C5E9] sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {stat.label}
                      </p>

                      <p className="mt-3 text-3xl font-semibold tracking-tight text-[#352047]">
                        {loading ? (
                          <span className="inline-block h-9 w-12 animate-pulse rounded bg-gray-100" />
                        ) : (
                          stat.value
                        )}
                      </p>
                    </div>

                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#F4F0F9] text-[#5B3488]">
                      <Icon size={21} />
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-5 text-gray-400">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </section>

          {/* Orders table panel */}
          <section className="min-w-0 overflow-hidden rounded-xl border border-[#EAE5EF] bg-white">
            {/* Search and filters */}
            <div className="border-b border-[#F0EDF3] p-5 sm:p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[#241A31]">
                    All Orders
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {loading
                      ? "Loading orders..."
                      : `${filteredOrders.length} of ${orders.length} orders`}
                  </p>
                </div>

                <div className="flex min-w-0 flex-col gap-3 sm:flex-row">
                  <div className="relative min-w-0 sm:w-64">
                    <FiSearch
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search order or customer..."
                      aria-label="Search orders"
                      className="h-11 w-full rounded-lg border border-[#EAE5EF] bg-[#FCFBFD] pl-10 pr-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#A78BCA] focus:bg-white focus:ring-2 focus:ring-purple-100"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    aria-label="Filter by order status"
                    className="h-11 min-w-0 rounded-lg border border-[#EAE5EF] bg-white px-3 text-sm text-gray-600 outline-none focus:border-[#A78BCA] focus:ring-2 focus:ring-purple-100 sm:w-48"
                  >
                    <option value="All">All statuses</option>
                    <option value="Placed">Placed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="space-y-3 p-6">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-[72px] animate-pulse rounded-lg bg-[#F8F7FA]"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="px-5 py-14 text-center sm:px-8">
                <p className="text-sm text-gray-500">
                  Orders could not be displayed.
                </p>
              </div>
            ) : orders.length === 0 ? (
              <div className="px-5 py-16 text-center sm:px-8">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#F4F0F9] text-[#5B3488]">
                  <FiShoppingBag size={25} />
                </div>

                <h3 className="text-lg font-semibold text-[#352047]">
                  No orders yet
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                  Orders containing your products will appear here when
                  customers place them.
                </p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="px-5 py-16 text-center sm:px-8">
                <FiSearch size={25} className="mx-auto mb-3 text-gray-400" />

                <h3 className="font-semibold text-[#352047]">
                  No matching orders
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Try a different search or status filter.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                  }}
                  className="mt-4 text-sm font-semibold text-[#5B3488] hover:text-[#4C1D95]"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                {/* Responsive table */}
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1050px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-[#F0EDF3] bg-[#FCFBFD]">
                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Order
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Customer
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Amount
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Payment
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Payment status
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Order status
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Date
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#F0EDF3]">
                      {filteredOrders.map((order) => (
                        <tr
                          key={order._id}
                          className="transition hover:bg-[#FCFBFD]"
                        >
                          {/* Order ID */}
                          <td className="px-5 py-5">
                            <p className="whitespace-nowrap text-sm font-semibold text-[#352047]">
                              #{String(order._id || "").slice(-6)}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">Order</p>
                          </td>

                          {/* Customer */}
                          <td className="px-5 py-5">
                            <div className="flex items-center gap-3">
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F4F0F9] text-sm font-semibold text-[#5B3488]">
                                {(order.user?.name || "C")
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>

                              <div className="min-w-0">
                                <p className="max-w-[180px] truncate text-sm font-medium text-gray-800">
                                  {order.user?.name || "Customer"}
                                </p>

                                <p className="mt-1 max-w-[180px] truncate text-xs text-gray-500">
                                  {order.user?.email || "Email unavailable"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="px-5 py-5">
                            <p className="whitespace-nowrap text-sm font-semibold text-[#352047]">
                              {formatPrice(order.totalPrice)}
                            </p>
                          </td>

                          {/* Payment method */}
                          <td className="px-5 py-5">
                            <span className="whitespace-nowrap text-sm text-gray-600">
                              {order.paymentMethod || "Not specified"}
                            </span>
                          </td>

                          {/* Payment status */}
                          <td className="px-5 py-5">
                            <span
                              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-xs font-medium ${
                                order.isPaid
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  order.isPaid
                                    ? "bg-emerald-500"
                                    : "bg-amber-500"
                                }`}
                              />

                              {order.isPaid ? "Paid" : "Pending"}
                            </span>
                          </td>

                          {/* Order status */}
                          <td className="px-5 py-5">
                            <select
                              value={order.status || "Placed"}
                              disabled={updatingOrders.includes(order._id)}
                              onChange={(event) =>
                                updateStatus(order._id, event.target.value)
                              }
                              aria-label={`Update status for order ${String(
                                order._id,
                              ).slice(-6)}`}
                              className={`min-w-[135px] rounded-lg border border-transparent px-3 py-2 text-xs font-semibold outline-none transition focus:border-[#C8B5E5] focus:ring-2 focus:ring-purple-100 disabled:cursor-wait disabled:opacity-60 ${getOrderStatusStyle(
                                order.status,
                              )}`}
                            >
                              <option value="Placed">Placed</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>

                          {/* Date */}
                          <td className="px-5 py-5">
                            <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm text-gray-500">
                              <FiCalendar size={14} className="text-gray-400" />
                              {formatDate(order.createdAt)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer */}
                <div className="flex flex-col gap-2 border-t border-[#F0EDF3] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <p className="text-xs text-gray-500">
                    Showing{" "}
                    <span className="font-semibold text-gray-700">
                      {filteredOrders.length}
                    </span>{" "}
                    orders
                  </p>

                  <p className="text-xs text-gray-400">
                    Update order status from the table.
                  </p>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </SellerLayout>
  );
};

export default SellerOrdersPage;
