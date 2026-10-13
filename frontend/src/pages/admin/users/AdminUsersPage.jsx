import { useEffect, useState } from "react";
import API from "../../../services/api";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiSearch,
  FiRefreshCw,
  FiArrowUpRight,
  FiMail,
  FiShoppingBag,
  FiEye,
  FiShield,
} from "react-icons/fi";

const AdminUsersPage = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const { data } = await API.get("/admin/get-all-users");

      setUsers(data.users || []);

      setStats({
        totalUsers: data.totalUsers ?? data.users?.length ?? 0,
        activeUsers: data.activeUsers ?? 0,
        blockedUsers: data.blockedUsers ?? 0,
      });
    } catch (error) {
      console.error(error);
      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await API.delete(`/users/delete-user/${id}`);

      setUsers((prev) => prev.filter((user) => user._id !== id));

      setStats((prev) => ({
        ...prev,
        totalUsers: Math.max(0, prev.totalUsers - 1),
      }));

      alert("User deleted successfully");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const filteredUsers = users.filter((user) => {
    const query = search.toLowerCase();

    return (
      (user.name || "").toLowerCase().includes(query) ||
      (user.email || "").toLowerCase().includes(query)
    );
  });

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
          <FiRefreshCw className="animate-spin" size={17} />
          Loading Users...
        </div>
      </div>
    );
  }

  const summaryCards = [
    {
      title: "Total Users",
      value: users.length,
      description: "Registered customer accounts",
      icon: FiUsers,
      iconStyle: "bg-[#F0E7FC] text-[#6D28D9]",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      description: "Active customer accounts",
      icon: FiUserCheck,
      iconStyle: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Blocked Users",
      value: stats.blockedUsers,
      description: "Restricted customer accounts",
      icon: FiUserX,
      iconStyle: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7FA] p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <section className="mb-7 overflow-hidden rounded-2xl border border-[#E5D6F8] bg-white shadow-sm">
        <div className="h-2 bg-gradient-to-r from-[#4C1D95] via-[#6D28D9] to-[#A78BFA]" />

        <div className="flex flex-col justify-between gap-5 p-5 sm:p-7 lg:flex-row lg:items-center">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#7952A5]">
              BIRD Management
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-[#352047] sm:text-3xl">
              Users Management
            </h1>

            <p className="mt-2 text-sm text-[#796B87] sm:text-base">
              Manage customer accounts and review their activity.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <label className="relative block min-w-0 flex-1 lg:w-80">
              <FiSearch
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B6AAF]"
              />

              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[#E5D6F8] bg-[#FCFAFF] py-3 pl-11 pr-4 text-sm text-[#352047] outline-none transition placeholder:text-[#A092AF] focus:border-[#8B5CF6] focus:bg-white focus:ring-4 focus:ring-[#7C3AED]/10"
              />
            </label>

            <button
              type="button"
              onClick={fetchUsers}
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

              <h2 className="mt-1 text-3xl font-bold text-[#352047]">
                {card.value}
              </h2>

              <p className="mt-2 text-xs text-[#A092AF]">{card.description}</p>
            </div>
          );
        })}
      </div>

      {/* Users Table */}
      <section className="overflow-hidden rounded-2xl border border-[#EAE3F2] bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-[#EEE7F5] px-5 py-5 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-[#352047]">
              Registered Customers
            </h2>

            <p className="mt-1 text-sm text-[#897A98]">
              {filteredUsers.length} of {users.length} users
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#F0E7FC] px-3 py-2 text-xs font-semibold text-[#6D28D9]">
            <FiShield size={14} />
            Customer Accounts
          </span>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0E7FC] text-[#6D28D9]">
              <FiUsers size={28} />
            </span>

            <h3 className="mt-4 text-lg font-bold text-[#352047]">
              {search ? "No matching users" : "No users found"}
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-[#897A98]">
              {search
                ? "Try searching with another name or email address."
                : "Registered customers will appear here."}
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
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="bg-[#F8F3FF] text-[11px] uppercase tracking-[0.12em] text-[#6B4A91]">
                  <th className="px-5 py-4 font-bold sm:px-6">Customer</th>
                  <th className="px-5 py-4 font-bold">Email Address</th>
                  <th className="px-5 py-4 text-center font-bold">Orders</th>
                  <th className="px-5 py-4 text-center font-bold">Status</th>
                  <th className="px-5 py-4 text-center font-bold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F0EAF5]">
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="transition-colors hover:bg-[#FCFAFF]"
                  >
                    {/* Customer */}
                    <td className="px-5 py-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#4C1D95] text-lg font-bold text-white shadow-sm shadow-purple-900/10">
                          {(user.name || "U").trim().charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-[180px] truncate text-sm font-bold text-[#352047]">
                            {user.name || "Unnamed User"}
                          </p>

                          <p className="mt-1 text-xs text-[#897A98]">
                            Customer
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-[#796B87]">
                        <FiMail size={15} className="shrink-0 text-[#8B6AAF]" />
                        <span className="max-w-[220px] truncate">
                          {user.email || "No email available"}
                        </span>
                      </div>
                    </td>

                    {/* Orders */}
                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex items-center gap-2 rounded-lg bg-[#F5EEFF] px-3 py-2 text-sm font-bold text-[#5B21B6]">
                        <FiShoppingBag size={15} />
                        {user.ordersCount ?? 0}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/users/${user._id}`)}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#6D28D9] px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-purple-900/10 transition hover:bg-[#5B21B6] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/15"
                      >
                        <FiEye size={15} />
                        View Profile
                        <FiArrowUpRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer */}
        {filteredUsers.length > 0 && (
          <div className="flex flex-col justify-between gap-2 border-t border-[#EEE7F5] bg-[#FCFAFE] px-5 py-4 sm:flex-row sm:items-center sm:px-6">
            <p className="text-xs text-[#897A98]">
              Showing{" "}
              <span className="font-semibold text-[#554064]">
                {filteredUsers.length}
              </span>{" "}
              customers
            </p>

            <span className="flex items-center gap-1.5 text-xs font-medium text-[#6D28D9]">
              <FiUsers size={14} />
              BIRD Customer Management
            </span>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminUsersPage;
