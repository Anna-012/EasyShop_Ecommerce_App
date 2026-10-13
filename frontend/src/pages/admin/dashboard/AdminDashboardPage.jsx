import { useEffect, useState } from "react";
import {
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiUserCheck,
  FiTrendingUp,
  FiArrowUpRight,
  FiClock,
  FiRefreshCw,
} from "react-icons/fi";
import API from "../../../services/api";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalSellers: 0,
    totalRevenue: 0,
    recentOrders: [],
  });

  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const response = await API.get("/admin/dashboard");
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const cards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: FiPackage,
      iconBg: "bg-[#F0E7FC]",
      iconColor: "text-[#6D28D9]",
      description: "Products in your store",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: FiShoppingBag,
      iconBg: "bg-[#EDE9FE]",
      iconColor: "text-[#6D28D9]",
      description: "Orders received",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: FiUsers,
      iconBg: "bg-[#F3E8FF]",
      iconColor: "text-[#7C3AED]",
      description: "Registered customers",
    },
    {
      title: "Total Sellers",
      value: stats.totalSellers,
      icon: FiUserCheck,
      iconBg: "bg-[#EDE9FE]",
      iconColor: "text-[#5B21B6]",
      description: "Active seller accounts",
    },
    {
      title: "Total Revenue",
      value: `₹${Number(stats.totalRevenue || 0).toLocaleString("en-IN")}`,
      icon: FiTrendingUp,
      iconBg: "bg-[#6D28D9]",
      iconColor: "text-white",
      description: "Revenue overview",
      highlight: true,
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 ring-emerald-200";
      case "Shipped":
        return "bg-blue-50 text-blue-700 ring-blue-200";
      case "Processing":
        return "bg-amber-50 text-amber-700 ring-amber-200";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 ring-rose-200";
      default:
        return "bg-[#F3EFF8] text-[#6B5A7D] ring-[#E8DFF1]";
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F7FA] p-4 sm:p-6 lg:p-8">
      {/* Page heading */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7C3AED]" />
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7952A5]">
              BIRD Management
            </p>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#352047] sm:text-3xl">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#796B87] sm:text-base">
            Welcome back! Here&apos;s what&apos;s happening in your store.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDashboardData}
          disabled={loading}
          className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-[#E5D6F8] bg-white px-4 py-2.5 text-sm font-semibold text-[#5B21B6] shadow-sm transition hover:border-[#C4A7F0] hover:bg-[#F7F1FF] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiRefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className={`group relative overflow-hidden rounded-2xl border p-5 transition duration-200 hover:-translate-y-1 hover:shadow-lg sm:p-6 ${
                card.highlight
                  ? "border-[#6D28D9] bg-gradient-to-br from-[#6D28D9] to-[#4C1D95] shadow-md shadow-purple-900/10"
                  : "border-[#EAE3F2] bg-white shadow-sm hover:border-[#D7C2F3] hover:shadow-purple-900/5"
              }`}
            >
              {card.highlight && (
                <div className="pointer-events-none absolute -right-7 -top-7 h-28 w-28 rounded-full bg-white/10" />
              )}

              <div className="relative flex items-start justify-between gap-3">
                <div>
                  <p
                    className={`text-sm font-medium ${
                      card.highlight ? "text-purple-100" : "text-[#796B87]"
                    }`}
                  >
                    {card.title}
                  </p>

                  <h2
                    className={`mt-4 break-words text-2xl font-bold tracking-tight sm:text-3xl ${
                      card.highlight ? "text-white" : "text-[#241A31]"
                    }`}
                  >
                    {loading ? (
                      <span
                        className={`inline-block h-8 w-20 animate-pulse rounded-lg ${
                          card.highlight ? "bg-white/20" : "bg-[#F0EAF6]"
                        }`}
                      />
                    ) : (
                      card.value
                    )}
                  </h2>
                </div>

                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    card.highlight
                      ? "bg-white/15 text-white"
                      : `${card.iconBg} ${card.iconColor}`
                  }`}
                >
                  <Icon size={21} strokeWidth={1.9} />
                </span>
              </div>

              <div
                className={`relative mt-5 flex items-center gap-2 border-t pt-4 text-xs font-medium ${
                  card.highlight
                    ? "border-white/20 text-purple-100"
                    : "border-[#F0EAF5] text-[#897A98]"
                }`}
              >
                <FiArrowUpRight size={14} />
                {card.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent orders */}
      <section className="overflow-hidden rounded-2xl border border-[#EAE3F2] bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-[#EEE7F5] px-5 py-5 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-[#352047] sm:text-xl">
              Recent Orders
            </h2>
            <p className="mt-1 text-sm text-[#897A98]">
              Latest activity from your store
            </p>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-full bg-[#F5EEFF] px-3 py-1.5 text-xs font-semibold text-[#6D28D9]">
            <FiClock size={14} />
            Recent activity
          </div>
        </div>

        {loading ? (
          <div className="space-y-4 p-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-12 animate-pulse rounded-xl bg-[#F6F2FA]"
              />
            ))}
          </div>
        ) : !stats.recentOrders?.length ? (
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F2EAFE] text-[#6D28D9]">
              <FiShoppingBag size={25} />
            </div>
            <h3 className="mt-4 font-semibold text-[#352047]">No orders yet</h3>
            <p className="mt-1 text-sm text-[#897A98]">
              Recent customer orders will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead>
                <tr className="bg-[#FAF8FC] text-xs uppercase tracking-wider text-[#806C96]">
                  <th className="px-6 py-4 font-bold">Customer</th>
                  <th className="px-6 py-4 font-bold">Amount</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Payment</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F0EAF5]">
                {stats.recentOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="transition-colors hover:bg-[#FCFAFF]"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0E7FC] text-sm font-bold text-[#6D28D9]">
                          {(order.user?.name || "N")
                            .trim()
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                        <div>
                          <p className="font-semibold text-[#352047]">
                            {order.user?.name || "N/A"}
                          </p>
                          <p className="mt-0.5 text-xs text-[#A092AF]">
                            Order #{String(order._id).slice(-6).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-semibold text-[#352047]">
                      ₹{Number(order.totalPrice || 0).toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${getStatusStyle(
                          order.status,
                        )}`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                          order.isPaid
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            order.isPaid ? "bg-emerald-500" : "bg-rose-500"
                          }`}
                        />
                        {order.isPaid ? "Paid" : "Pending"}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[#796B87]">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && stats.recentOrders?.length > 0 && (
          <div className="border-t border-[#EEE7F5] bg-[#FCFAFE] px-6 py-3">
            <p className="text-xs text-[#897A98]">
              Showing {stats.recentOrders.length} recent{" "}
              {stats.recentOrders.length === 1 ? "order" : "orders"}
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboardPage;
