import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiCalendar,
  FiShoppingBag,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiMapPin,
  FiPhone,
  FiShield,
  FiArrowUpRight,
  FiRefreshCw,
  FiPackage,
  FiUserCheck,
  FiXCircle,
} from "react-icons/fi";
import API from "../../../services/api";

const AdminUserProfilePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [orders, setOrders] = useState([]);
  const [latestAddress, setLatestAddress] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const { data } = await API.get(`/admin/user/${id}`);

      setUser(data.user || {});
      setOrders(data.orders || []);

      if (data.orders?.length > 0) {
        setLatestAddress(data.orders[0].shippingAddress || null);
      } else {
        setLatestAddress(null);
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  const totalSpent = orders.reduce(
    (sum, order) => sum + Number(order.totalPrice || 0),
    0,
  );

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered",
  ).length;

  const pendingOrders = orders.filter((order) =>
    ["Pending", "Processing", "Shipped"].includes(order.status),
  ).length;

  const formatCurrency = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

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

  const handleToggleStatus = async () => {
    try {
      setUpdatingStatus(true);

      await API.put(`/admin/toggle-user-status/${user._id}`);

      setUser((prev) => ({
        ...prev,
        isBlocked: !prev.isBlocked,
      }));

      alert(
        user.isBlocked
          ? "User activated successfully"
          : "User deactivated successfully",
      );
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getOrderStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-700";
      case "Cancelled":
        return "bg-rose-50 text-rose-700";
      case "Shipped":
        return "bg-blue-50 text-blue-700";
      case "Processing":
        return "bg-amber-50 text-amber-700";
      default:
        return "bg-[#F2EAFE] text-[#6D28D9]";
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#F8F7FA] p-5 sm:p-8">
        <div className="mb-6 h-36 animate-pulse rounded-2xl bg-[#EDE5F7]" />

        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl border border-[#EAE3F2] bg-white"
            />
          ))}
        </div>

        <div className="h-64 animate-pulse rounded-2xl border border-[#EAE3F2] bg-white" />

        <div className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-[#6D28D9]">
          <FiRefreshCw size={17} className="animate-spin" />
          Loading User Profile...
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Orders",
      value: orders.length,
      icon: FiShoppingBag,
      iconStyle: "bg-[#F0E7FC] text-[#6D28D9]",
      description: "All orders placed",
    },
    {
      title: "Delivered",
      value: deliveredOrders,
      icon: FiCheckCircle,
      iconStyle: "bg-emerald-50 text-emerald-600",
      description: "Successfully delivered",
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: FiClock,
      iconStyle: "bg-amber-50 text-amber-600",
      description: "In progress",
    },
    {
      title: "Total Spent",
      value: formatCurrency(totalSpent),
      icon: FiCreditCard,
      iconStyle: "bg-[#EDE9FE] text-[#6D28D9]",
      description: "Combined order value",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7FA] p-4 sm:p-6 lg:p-8">
      {/* Back Navigation */}
      <button
        type="button"
        onClick={() => navigate("/admin/users")}
        className="mb-5 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#6D28D9] transition hover:bg-[#F0E7FC]"
      >
        <FiArrowLeft size={17} />
        Back to Users
      </button>

      {/* User Profile Header */}
      <section className="mb-6 overflow-hidden rounded-2xl border border-[#E5D6F8] bg-white shadow-sm">
        <div className="h-2 bg-gradient-to-r from-[#4C1D95] via-[#6D28D9] to-[#A78BFA]" />

        <div className="flex flex-col justify-between gap-5 p-5 sm:flex-row sm:items-center sm:p-7">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#4C1D95] text-2xl font-bold text-white shadow-md shadow-purple-900/15 sm:h-20 sm:w-20">
              {(user.name || "U").trim().charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-[#7952A5]">
                BIRD Management
              </p>

              <h1 className="break-words text-2xl font-bold tracking-tight text-[#352047] sm:text-3xl">
                {user.name || "User Profile"}
              </h1>

              <p className="mt-2 flex items-start gap-2 break-all text-sm text-[#796B87]">
                <FiMail size={15} className="mt-0.5 shrink-0 text-[#8B6AAF]" />
                {user.email || "No email available"}
              </p>

              <p className="mt-2 flex items-center gap-2 text-xs text-[#897A98]">
                <FiCalendar size={14} />
                Joined {formatDate(user.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:justify-end">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${
                user.isBlocked
                  ? "border-rose-100 bg-rose-50 text-rose-700"
                  : "border-emerald-100 bg-emerald-50 text-emerald-700"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  user.isBlocked ? "bg-rose-500" : "bg-emerald-500"
                }`}
              />
              {user.isBlocked ? "Blocked" : "Active"}
            </span>

            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0E7FC] text-[#6D28D9]">
              <FiShield size={20} />
            </span>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <div className="mb-7 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="group rounded-2xl border border-[#EAE3F2] bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#D7C2F3] hover:shadow-lg hover:shadow-purple-900/5 sm:p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${card.iconStyle}`}
                >
                  <Icon size={20} />
                </span>

                <FiArrowUpRight
                  size={17}
                  className="text-[#C2B2D4] transition group-hover:text-[#6D28D9]"
                />
              </div>

              <p className="mt-4 text-xs font-medium text-[#796B87] sm:text-sm">
                {card.title}
              </p>

              <h2 className="mt-1 break-words text-xl font-bold text-[#352047] sm:text-2xl">
                {card.value}
              </h2>

              <p className="mt-2 text-[10px] text-[#A092AF] sm:text-xs">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Address and Quick Actions */}
      <div className="mb-7 grid grid-cols-1 items-start gap-5 xl:grid-cols-5">
        {/* Shipping Address */}
        <section className="overflow-hidden rounded-2xl border border-[#EAE3F2] bg-white shadow-sm xl:col-span-3">
          <div className="flex items-center gap-3 border-b border-[#EEE7F5] bg-gradient-to-r from-[#F2E8FF] to-white px-5 py-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6D28D9] text-white">
              <FiMapPin size={20} />
            </span>

            <div>
              <h2 className="font-bold text-[#352047]">
                Latest Shipping Address
              </h2>
              <p className="mt-1 text-xs text-[#897A98]">
                Address from the latest order
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {latestAddress ? (
              <>
                <h3 className="text-lg font-bold text-[#352047]">
                  {latestAddress.fullName || "Recipient"}
                </h3>

                <div className="mt-4 space-y-2 text-sm leading-6 text-[#796B87]">
                  <p>
                    {[latestAddress.houseNo, latestAddress.area]
                      .filter(Boolean)
                      .join(", ") || "Address not available"}
                  </p>

                  {latestAddress.landmark && (
                    <p>Landmark: {latestAddress.landmark}</p>
                  )}

                  <p>
                    {[latestAddress.city, latestAddress.state]
                      .filter(Boolean)
                      .join(", ")}
                  </p>

                  {latestAddress.pincode && <p>PIN: {latestAddress.pincode}</p>}
                </div>

                <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#E5D6F8] bg-[#FAF6FF] p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#6D28D9] shadow-sm">
                    <FiPhone size={18} />
                  </span>

                  <div>
                    <p className="text-xs text-[#897A98]">Contact Number</p>
                    <p className="mt-1 font-semibold text-[#352047]">
                      {latestAddress.phoneNumber || "Not available"}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex min-h-44 flex-col items-center justify-center text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0E7FC] text-[#6D28D9]">
                  <FiMapPin size={25} />
                </span>

                <h3 className="mt-4 font-semibold text-[#352047]">
                  No shipping address
                </h3>

                <p className="mt-1 text-sm text-[#897A98]">
                  An address will appear here after the user places an order.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="overflow-hidden rounded-2xl border border-[#EAE3F2] bg-white shadow-sm xl:col-span-2">
          <div className="border-b border-[#EEE7F5] px-5 py-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6D28D9] text-white">
                <FiShield size={20} />
              </span>

              <div>
                <h2 className="font-bold text-[#352047]">Quick Actions</h2>
                <p className="mt-1 text-xs text-[#897A98]">
                  Manage this user account
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 p-5">
            <button
              type="button"
              onClick={() => navigate(`/admin/orders?user=${user._id}`)}
              className="flex w-full items-center justify-between gap-3 rounded-xl bg-[#6D28D9] px-4 py-3.5 text-sm font-semibold text-white shadow-sm shadow-purple-900/10 transition hover:bg-[#5B21B6] focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/15"
            >
              <span className="flex items-center gap-2.5">
                <FiShoppingBag size={18} />
                View All Orders
              </span>
              <FiArrowUpRight size={17} />
            </button>

            <button
              type="button"
              onClick={handleToggleStatus}
              disabled={updatingStatus}
              className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                user.isBlocked
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
              }`}
            >
              <span className="flex items-center gap-2.5">
                {user.isBlocked ? (
                  <FiUserCheck size={18} />
                ) : (
                  <FiXCircle size={18} />
                )}

                {updatingStatus
                  ? "Updating..."
                  : user.isBlocked
                    ? "Activate User"
                    : "Deactivate User"}
              </span>

              {updatingStatus ? (
                <FiRefreshCw size={16} className="animate-spin" />
              ) : (
                <FiArrowUpRight size={17} />
              )}
            </button>

            <div className="mt-5 space-y-4 border-t border-[#EEE7F5] pt-5">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-[#897A98]">Account Status</span>
                <span
                  className={`font-semibold ${
                    user.isBlocked ? "text-rose-600" : "text-emerald-600"
                  }`}
                >
                  {user.isBlocked ? "Blocked" : "Active"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-[#897A98]">Total Orders</span>
                <span className="font-bold text-[#352047]">
                  {orders.length}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-[#897A98]">Total Spent</span>
                <span className="font-bold text-[#6D28D9]">
                  {formatCurrency(totalSpent)}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Latest Orders */}
      <section className="overflow-hidden rounded-2xl border border-[#EAE3F2] bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-[#EEE7F5] px-5 py-5 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-[#352047]">Latest Orders</h2>
            <p className="mt-1 text-sm text-[#897A98]">
              Recent order activity for this user
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#F0E7FC] px-3 py-2 text-xs font-semibold text-[#6D28D9]">
            <FiPackage size={14} />
            Latest {Math.min(orders.length, 3)} orders
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="flex min-h-48 flex-col items-center justify-center px-6 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0E7FC] text-[#6D28D9]">
              <FiShoppingBag size={25} />
            </span>

            <h3 className="mt-4 font-semibold text-[#352047]">
              No orders found
            </h3>

            <p className="mt-1 text-sm text-[#897A98]">
              The user's recent orders will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead>
                <tr className="bg-[#F8F3FF] text-xs uppercase tracking-wider text-[#6B4A91]">
                  <th className="px-5 py-4 font-bold">Order ID</th>
                  <th className="px-5 py-4 font-bold">Date</th>
                  <th className="px-5 py-4 font-bold">Amount</th>
                  <th className="px-5 py-4 font-bold">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F0EAF5]">
                {orders.slice(0, 3).map((order) => (
                  <tr key={order._id} className="transition hover:bg-[#FCFAFF]">
                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="rounded-lg bg-[#F2EAFE] px-3 py-2 text-xs font-bold text-[#5B21B6]">
                        #{String(order._id).slice(-6).toUpperCase()}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-[#796B87]">
                      {formatDate(order.createdAt)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm font-bold text-[#5B21B6]">
                      {formatCurrency(order.totalPrice)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getOrderStatusStyle(
                          order.status,
                        )}`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {orders.length > 0 && (
          <div className="border-t border-[#EEE7F5] bg-[#FCFAFE] px-5 py-4">
            <button
              type="button"
              onClick={() => navigate(`/admin/orders?user=${user._id}`)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#6D28D9] transition hover:text-[#4C1D95]"
            >
              View all orders
              <FiArrowUpRight size={16} />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminUserProfilePage;
