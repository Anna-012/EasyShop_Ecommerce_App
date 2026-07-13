import { useEffect, useState } from "react";
import API from "../../../services/api";
import { useNavigate } from "react-router-dom";

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
    try {
      const { data } = await API.get("/admin/get-all-users");

      setUsers(data.users);

      setStats({
        totalUsers: data.totalUsers,
        activeUsers: data.activeUsers,
        blockedUsers: data.blockedUsers,
      });
    } catch (error) {
      console.log(error);
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

      alert("User deleted successfully");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-3xl font-semibold">Loading Users...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}

      <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold">Users Management</h1>

            <p className="text-gray-500 mt-2">
              Manage all registered customers.
            </p>
          </div>

          <input
            type="text"
            placeholder="Search user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full lg:w-80 border rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-500">Total Users</p>

          <h2 className="text-4xl font-bold mt-3">{users.length}</h2>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-500">Active Users</p>

          <h2 className="text-4xl font-bold mt-3 text-green-600">
            {stats.activeUsers}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-500">Inactive Users</p>

          <h2 className="text-4xl font-bold mt-3 text-orange-600">
            {stats.blockedUsers}
          </h2>
        </div>
      </div>

      {/* Users Table */}

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left">User</th>

                <th className="px-6 py-4 text-left">Email</th>

                <th className="px-6 py-4 text-center">Order</th>

                <th className="px-6 py-4 text-center">Status</th>

                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="py-16 text-center text-gray-500 text-lg"
                  >
                    No Users Found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    {/* User */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <p className="font-semibold text-gray-800">
                            {user.name}
                          </p>

                          <p className="text-sm text-gray-500">Customer</p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}

                    <td className="px-6 py-5">{user.email}</td>

                    {/* Order */}

                    <td className="text-center font-semibold">
                      {user.ordersCount}
                    </td>

                    {/* Status */}

                    <td className="px-6 py-5 text-center">
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                        Active
                      </span>
                    </td>

                    {/* Action */}

                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <button
                          onClick={() => navigate(`/admin/users/${user._id}`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
                        >
                          View Profile
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
