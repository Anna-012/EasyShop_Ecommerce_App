import { useEffect, useState } from "react";
import API from "../../services/api";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get("/orders/myorders", {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });

        setOrders(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 max-w-4xl mx-auto">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders yet</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-2xl shadow-md border p-5 max-w-4xl mx-auto mb-6"
          >
            {order.orderItems.map((item, i) =>
              item.product ? (
                <div
                  key={i}
                  className="flex items-center justify-between gap-4"
                >
                  {/* Left */}
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product?.images?.[0]}
                      alt={item.product?.title}
                      className="w-24 h-24 object-cover rounded-xl border"
                    />

                    <div>
                      <h3 className="text-xl font-semibold">
                        {item.product.title}
                      </h3>

                      <p className="text-gray-500 text-sm mt-1">
                        Ordered on{" "}
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>

                      <p className="text-gray-600 mt-1">Qty: {item.qty}</p>

                      <div className="flex gap-2 mt-3 flex-wrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.isPaid
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.isPaid ? "Paid" : "Pending"}
                        </span>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.isDelivered
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.status || "Processing"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-600">
                      ₹{item.price}
                    </p>

                    <p className="text-xs text-gray-500 mt-2">Order ID</p>

                    <p className="text-xs text-gray-400 break-all max-w-[180px]">
                      {order._id}
                    </p>
                  </div>
                </div>
              ) : null,
            )}

            {/* Address Dropdown */}
            <details className="mt-5 border-t pt-4">
              <summary className="cursor-pointer text-blue-600 font-medium">
                View Delivery Address
              </summary>

              <div className="mt-3 text-gray-600 text-sm">
                <p>{order.shippingAddress.fullName}</p>

                <p>
                  {order.shippingAddress.houseNo}, {order.shippingAddress.area},{" "}
                  {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                  {order.shippingAddress.pincode}
                </p>
              </div>
            </details>
          </div>
        ))
      )}
    </div>
  );
};

export default OrdersPage;
