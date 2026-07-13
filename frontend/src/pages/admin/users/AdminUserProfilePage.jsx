import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import API from "../../../services/api";

const AdminUserProfilePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [orders, setOrders] = useState([]);
  const [latestAddress, setLatestAddress] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await API.get(`/admin/user/${id}`);

      setUser(data.user);
      setOrders(data.orders || []);

      if (data.orders && data.orders.length > 0) {
        setLatestAddress(data.orders[0].shippingAddress);
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered",
  ).length;

  const pendingOrders = orders.filter(
    (order) =>
      order.status === "Pending" ||
      order.status === "Processing" ||
      order.status === "Shipped",
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold">
        Loading...
      </div>
    );
  }

  const handleToggleStatus = async () => {
    try {
      await API.put(`/admin/toggle-user-status/${user._id}`);

      fetchUser();

      alert(
        user.isBlocked
          ? "User activated successfully"
          : "User deactivated successfully",
      );
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-5">
      {/* Back Button */}

      <button
        onClick={() => navigate("/admin/users")}
        className="mb-4 text-blue-600 hover:text-blue-700 font-medium"
      >
        ← Back to Users
      </button>

      {/* Header */}

      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>

              <p className="text-gray-600">{user.email}</p>

              <p className="text-xs text-gray-400 mt-1">
                Joined{" "}
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-IN")
                  : "-"}
              </p>
            </div>
          </div>

          <span
            className={`px-4 py-1 rounded-full text-sm font-semibold ${
              user.isBlocked
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {user.isBlocked ? "Blocked" : "Active"}
          </span>
        </div>
      </div>

      {/* PART 2 STARTS HERE */}
      {/* Stats */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="bg-white rounded-xl shadow-sm p-3">
          <p className="text-xs text-gray-500">Total Orders</p>
          <h2 className="text-2xl font-bold text-blue-600 mt-1">
            {orders.length}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-3">
          <p className="text-xs text-gray-500">Delivered</p>
          <h2 className="text-2xl font-bold text-green-600 mt-1">
            {deliveredOrders}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-3">
          <p className="text-xs text-gray-500">Pending</p>
          <h2 className="text-2xl font-bold text-yellow-600 mt-1">
            {pendingOrders}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-3">
          <p className="text-xs text-gray-500">Total Spent</p>
          <h2 className="text-2xl font-bold text-purple-600 mt-1">
            ₹{totalSpent}
          </h2>
        </div>
      </div>

      {/* Address + Actions */}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
        {/* Latest Shipping Address */}

        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-4">
            📍 Latest Shipping Address
          </h2>

          {latestAddress ? (
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">
                {latestAddress.fullName}
              </h3>

              <p className="text-gray-700">
                {latestAddress.houseNo}, {latestAddress.area}
              </p>

              {latestAddress.landmark && (
                <p className="text-gray-600">{latestAddress.landmark}</p>
              )}

              <p className="text-gray-700">
                {latestAddress.city}, {latestAddress.state}
              </p>

              <p className="text-gray-700">{latestAddress.pincode}</p>

              <div className="border-t pt-3 mt-3">
                <p className="text-xs text-gray-500 uppercase">
                  Contact Number
                </p>

                <p className="font-semibold mt-1">
                  {latestAddress.phoneNumber}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-gray-400">
              No shipping address available.
            </div>
          )}
        </div>

        {/* Quick Actions Starts Here */}
        {/* Quick Actions */}

        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-4">⚡ Quick Actions</h2>

          <div className="space-y-3">
            <button
              onClick={() => {
                console.log("User Profile ID:", user._id);
                navigate(`/admin/orders?user=${user._id}`);
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium "
            >
              View All Orders
            </button>

            <button
              onClick={handleToggleStatus}
              className={`w-full py-2.5 rounded-lg text-white ${
                user.isBlocked
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-600 hover:bg-gray-700"
              }`}
            >
              {user.isBlocked ? "Activate User" : "Deactivate User"}
            </button>
          </div>

          <div className="mt-5 border-t pt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Account</span>

              <span
                className={`font-semibold ${
                  user.isBlocked ? "text-red-600" : "text-green-600"
                }`}
              >
                {user.isBlocked ? "Blocked" : "Active"}
              </span>
            </div>

            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Orders</span>

              <span className="font-semibold">{orders.length}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Spent</span>

              <span className="font-semibold text-blue-600">₹{totalSpent}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Orders */}

      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Latest Orders</h2>

          <span className="text-sm text-gray-500">Showing Last 3 Orders</span>
        </div>

        {orders.length === 0 ? (
          <div className="flex justify-center items-center h-24 text-gray-400">
            No recent orders found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-3">Order ID</th>

                  <th className="text-left px-4 py-3">Date</th>

                  <th className="text-left px-4 py-3">Amount</th>

                  <th className="text-left px-4 py-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.slice(0, 3).map((order) => (
                  <tr key={order._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">
                      #{order._id.slice(-6)}
                    </td>

                    <td className="px-4 py-3">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </td>

                    <td className="px-4 py-3 font-semibold text-green-600">
                      ₹{order.totalPrice}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserProfilePage;
