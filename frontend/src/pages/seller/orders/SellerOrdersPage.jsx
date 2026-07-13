import { useEffect, useState } from "react";
import API from "../../../services/api";
import SellerLayout from "../../../components/seller/SellerLayout";

const SellerOrdersPage = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await API.get("/orders/seller-orders");

      setOrders(response.data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await API.patch(`/orders/seller-orders/${orderId}/status`, {
        status,
      });

      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <SellerLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>

          <p className="text-gray-500 mt-1">
            View all orders containing your products
          </p>
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">Total Orders</p>

            <h2 className="text-3xl font-bold mt-2">{orders.length}</h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">Placed</p>

            <h2 className="text-3xl font-bold mt-2">
              {orders.filter((order) => order.status === "Placed").length}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">Shipped</p>

            <h2 className="text-3xl font-bold mt-2">
              {orders.filter((order) => order.status === "Shipped").length}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">Delivered</p>

            <h2 className="text-3xl font-bold mt-2">
              {orders.filter((order) => order.status === "Delivered").length}
            </h2>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {orders.length === 0 ? (
            <div className="p-16 text-center">
              <h2 className="text-2xl font-semibold">No Orders Yet</h2>

              <p className="text-gray-500 mt-2">
                Orders containing your products will appear here.
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr className="border-b hover:bg-gray-50 transition">
                  <th className="p-4 text-left">Order ID</th>

                  <th className="p-4 text-left">Customer</th>

                  <th className="p-4 text-left">Amount</th>

                  <th className="p-4 text-left">Payment Method</th>

                  <th className="p-4 text-left">Payment Status</th>

                  <th className="p-4 text-left">Order Status</th>

                  <th className="p-4 text-left">Order Date</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">#{order._id.slice(-6)}</td>

                    <td className="p-4">
                      <div>
                        <p className="font-medium">{order.user?.name}</p>

                        <p className="text-sm text-gray-500">
                          {order.user?.email}
                        </p>
                      </div>
                    </td>

                    <td className="p-4 font-bold text-green-600">
                      ₹{order.totalPrice}
                    </td>

                    <td className="p-4">{order.paymentMethod}</td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          order.isPaid
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.isPaid ? "Paid" : "Pending"}
                      </span>
                    </td>

                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(order._id, e.target.value)
                        }
                        className={`px-3 py-2 rounded-lg font-semibold border outline-none ${
                          order.status === "Placed"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status === "Processing"
                              ? "bg-blue-100 text-blue-700"
                              : order.status === "Shipped"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-green-100 text-green-700"
                        }`}
                      >
                        <option value="Placed">Placed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>

                    <td className="p-4">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </SellerLayout>
  );
};

export default SellerOrdersPage;
