import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  FiShoppingBag,
  FiSearch,
  FiRefreshCw,
  FiArrowUpRight,
  FiPackage,
  FiCalendar,
  FiUser,
  FiEye,
  FiShield,
} from "react-icons/fi";
import API from "../../../services/api";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const userId = searchParams.get("user");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);

    try {
      const { data } = await API.get("/orders");
      const allOrders = Array.isArray(data) ? data : [];

      setOrders(
        userId
          ? allOrders.filter((order) => {
              const orderUserId =
                typeof order.user === "object" ? order.user?._id : order.user;

              return String(orderUserId) === String(userId);
            })
          : allOrders,
      );
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    const currentOrder = orders.find((order) => order._id === id);

    if (!currentOrder || currentOrder.status === status) return;

    setUpdatingId(id);

    try {
      const { data } = await API.patch(`/orders/${id}/status`, { status });

      setOrders((prev) =>
        prev.map((order) =>
          order._id === id
            ? { ...order, ...data, status: data.status || status }
            : order,
        ),
      );

      alert("Order updated successfully");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatCurrency = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    return Number.isNaN(parsedDate.getTime())
      ? "—"
      : parsedDate.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Shipped":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Processing":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-[#F2EAFE] text-[#6D28D9] border-[#E5D6F8]";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const query = search.toLowerCase();

    return (
      (order.user?.name || "").toLowerCase().includes(query) ||
      (order.user?.email || "").toLowerCase().includes(query) ||
      String(order._id || "")
        .toLowerCase()
        .includes(query) ||
      String(order.status || "")
        .toLowerCase()
        .includes(query)
    );
  });

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.totalPrice || 0),
    0,
  );

  const paidOrders = orders.filter((order) => order.isPaid).length;

  const summaryCards = [
    {
      title: "Total Orders",
      value: orders.length,
      description: "Orders received",
      icon: FiShoppingBag,
      iconStyle: "bg-[#F0E7FC] text-[#6D28D9]",
    },
    {
      title: "Paid Orders",
      value: paidOrders,
      description: "Successfully paid",
      icon: FiShield,
      iconStyle: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Order Value",
      value: formatCurrency(totalRevenue),
      description: "Combined order value",
      icon: FiPackage,
      iconStyle: "bg-amber-50 text-amber-600",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#F8F7FA] p-4 sm:p-6 lg:p-8">
        <div className="mb-6 h-32 animate-pulse rounded-2xl bg-[#EDE5F7]" />

        <div className="mb-7 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl border border-[#EAE3F2] bg-white"
            />
          ))}
        </div>

        <div className="h-80 animate-pulse rounded-2xl border border-[#EAE3F2] bg-white" />

        <div className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-[#6D28D9]">
          <FiRefreshCw size={17} className="animate-spin" />
          Loading Orders...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7FA] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <section className="mb-7 overflow-hidden rounded-2xl border border-[#E5D6F8] bg-white shadow-sm">
        <div className="h-2 bg-gradient-to-r from-[#4C1D95] via-[#6D28D9] to-[#A78BFA]" />

        <div className="flex flex-col justify-between gap-5 p-5 sm:p-7 lg:flex-row lg:items-center">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#7952A5]">
              BIRD Management
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-[#352047] sm:text-3xl">
              {userId ? "Customer Orders" : "Orders Management"}
            </h1>

            <p className="mt-2 text-sm text-[#796B87] sm:text-base">
              Track orders, review payments and manage order progress.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:w-auto">
            <label className="relative block min-w-0 flex-1 lg:w-80">
              <FiSearch
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B6AAF]"
              />

              <input
                type="text"
                placeholder="Search customer, order..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[#E5D6F8] bg-[#FCFAFF] py-3 pl-11 pr-4 text-sm text-[#352047] outline-none transition placeholder:text-[#A092AF] focus:border-[#8B5CF6] focus:bg-white focus:ring-4 focus:ring-[#7C3AED]/10"
              />
            </label>

            <button
              type="button"
              onClick={fetchOrders}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E5D6F8] bg-white px-4 py-3 text-sm font-semibold text-[#5B21B6] transition hover:bg-[#F5EEFF]"
            >
              <FiRefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <div className="mb-7 grid grid-cols-1 gap-4 md:grid-cols-3">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="group rounded-2xl border border-[#EAE3F2] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#D7C2F3] hover:shadow-lg hover:shadow-purple-900/5 sm:p-6"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconStyle}`}
                >
                  <Icon size={22} />
                </span>

                <FiArrowUpRight
                  size={18}
                  className="text-[#C2B2D4] transition group-hover:text-[#6D28D9]"
                />
              </div>

              <p className="mt-5 text-sm font-medium text-[#796B87]">
                {card.title}
              </p>

              <h2 className="mt-1 break-words text-2xl font-bold text-[#352047] sm:text-3xl">
                {card.value}
              </h2>

              <p className="mt-2 text-xs text-[#A092AF]">{card.description}</p>
            </div>
          );
        })}
      </div>

      {/* Orders Table */}
      <section className="overflow-hidden rounded-2xl border border-[#EAE3F2] bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-[#EEE7F5] px-5 py-5 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-[#352047]">Recent Orders</h2>

            <p className="mt-1 text-sm text-[#897A98]">
              {filteredOrders.length} of {orders.length} orders
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#F0E7FC] px-3 py-2 text-xs font-semibold text-[#6D28D9]">
            <FiShoppingBag size={14} />
            Order Records
          </span>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0E7FC] text-[#6D28D9]">
              <FiShoppingBag size={28} />
            </span>

            <h3 className="mt-4 text-lg font-bold text-[#352047]">
              {search ? "No matching orders" : "No orders found"}
            </h3>

            <p className="mt-2 text-sm text-[#897A98]">
              {search
                ? "Try a different customer name, email or order ID."
                : "Orders will appear here when customers place them."}
            </p>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-5 rounded-xl bg-[#6D28D9] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5B21B6]"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="bg-[#F8F3FF] text-[11px] uppercase tracking-[0.12em] text-[#6B4A91]">
                  <th className="px-5 py-4 font-bold sm:px-6">Customer</th>
                  <th className="px-5 py-4 font-bold">Items</th>
                  <th className="px-5 py-4 font-bold">Total</th>
                  <th className="px-5 py-4 font-bold">Payment</th>
                  <th className="px-5 py-4 font-bold">Order Status</th>
                  <th className="px-5 py-4 font-bold">Date</th>
                  <th className="px-5 py-4 text-center font-bold">Details</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F0EAF5]">
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="transition-colors hover:bg-[#FCFAFF]"
                  >
                    {/* Customer */}
                    <td className="px-5 py-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#4C1D95] font-bold text-white">
                          {(order.user?.name || "U")
                            .trim()
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-[180px] truncate text-sm font-bold text-[#352047]">
                            {order.user?.name || "Unknown Customer"}
                          </p>

                          <p className="mt-1 max-w-[200px] truncate text-xs text-[#897A98]">
                            {order.user?.email || "No email available"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Items */}
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-2 rounded-lg bg-[#F5EEFF] px-3 py-2 text-sm font-semibold text-[#5B21B6]">
                        <FiPackage size={15} />
                        {order.orderItems?.length || 0}
                      </span>
                    </td>

                    {/* Total */}
                    <td className="whitespace-nowrap px-5 py-4 text-sm font-bold text-[#5B21B6]">
                      {formatCurrency(order.totalPrice)}
                    </td>

                    {/* Payment */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                          order.isPaid
                            ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                            : "border-rose-100 bg-rose-50 text-rose-700"
                        }`}
                      >
                        <span className="h-2 w-2 rounded-full bg-current" />
                        {order.isPaid ? "Paid" : "Pending"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <select
                        aria-label={`Update status for order ${String(order._id).slice(-6)}`}
                        value={order.status || "Placed"}
                        disabled={updatingId === order._id}
                        onChange={(e) =>
                          updateStatus(order._id, e.target.value)
                        }
                        className={`max-w-[155px] cursor-pointer rounded-xl border px-3 py-2 text-xs font-semibold outline-none transition focus:ring-4 focus:ring-[#7C3AED]/10 disabled:cursor-wait disabled:opacity-60 ${getStatusStyle(
                          order.status,
                        )}`}
                      >
                        <option value="Placed">Placed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>

                      {updatingId === order._id && (
                        <p className="mt-1 text-[10px] text-[#6D28D9]">
                          Updating...
                        </p>
                      )}
                    </td>

                    {/* Date */}
                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="flex items-center gap-2 text-sm text-[#796B87]">
                        <FiCalendar
                          size={15}
                          className="shrink-0 text-[#8B6AAF]"
                        />
                        {formatDate(order.createdAt)}
                      </span>
                    </td>

                    {/* Details */}
                    <td className="px-5 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                        aria-label="View order details"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6D28D9] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#5B21B6] focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/15"
                      >
                        <FiEye size={15} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        {filteredOrders.length > 0 && (
          <div className="flex flex-col justify-between gap-2 border-t border-[#EEE7F5] bg-[#FCFAFE] px-5 py-4 sm:flex-row sm:items-center sm:px-6">
            <p className="text-xs text-[#897A98]">
              Showing{" "}
              <span className="font-semibold text-[#554064]">
                {filteredOrders.length}
              </span>{" "}
              orders
            </p>

            <span className="flex items-center gap-2 text-xs font-medium text-[#6D28D9]">
              <FiUser size={14} />
              BIRD Order Management
            </span>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminOrdersPage;
