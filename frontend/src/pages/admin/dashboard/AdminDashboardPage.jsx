import { useEffect, useState } from "react";
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

  const fetchDashboardData = async () => {
    try {
      const response = await API.get("/admin/dashboard");

      setStats(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const cards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
    },
    {
      title: "Total Sellers",
      value: stats.totalSellers,
    },
    {
      title: "Revenue",
      value: `₹${stats.totalRevenue}`,
    },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <p className="text-gray-600 mt-1">
          Welcome back! Here's what's happening in your store.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-10">
        {cards.map((card) => (
          <div key={card.title} className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500 text-sm">{card.title}</p>

            <h2 className="text-3xl font-bold mt-2">{card.value}</h2>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div className="p-10 text-center text-gray-500">No Orders Found</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Customer</th>

                <th className="p-4 text-left">Amount</th>

                <th className="p-4 text-left">Status</th>

                <th className="p-4 text-left">Payment</th>

                <th className="p-4 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order._id} className="border-t hover:bg-gray-50">
                  <td className="p-4">{order.user?.name || "N/A"}</td>

                  <td className="p-4">₹{order.totalPrice}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Shipped"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "Processing"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        order.isPaid
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
                  </td>
                  <td className="p-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
