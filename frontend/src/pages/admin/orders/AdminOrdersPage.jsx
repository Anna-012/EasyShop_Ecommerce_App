import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../../../services/api";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);

  const [searchParams] = useSearchParams();

  const userId = searchParams.get("user");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await API.get("/orders");

      if (userId) {
        const filteredOrders = data.filter(
          (order) => order.user?._id === userId,
        );

        setOrders(filteredOrders);
      } else {
        setOrders(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/orders/${id}/status`, { status });

      fetchOrders();

      alert("Order updated successfully");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-6">Orders Management</h1>

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3">Customer</th>

              <th className="border p-3">Items</th>

              <th className="border p-3">Total</th>

              <th className="border p-3">Payment</th>

              <th className="border p-3">Status</th>

              <th className="border p-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="text-center hover:bg-gray-50">
                <td className="border p-2">
                  <p>{order.user?.name}</p>

                  <p className="text-sm text-gray-500">{order.user?.email}</p>
                </td>

                <td className="border p-2">{order.orderItems.length}</td>

                <td className="border p-2">₹{order.totalPrice}</td>

                <td className="border p-2">
                  {order.isPaid ? (
                    <span className="text-green-600 font-semibold">Paid</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Pending</span>
                  )}
                </td>

                <td className="border p-2">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="Placed">Placed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
                <td className="border p-2">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
