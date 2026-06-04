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
      <h1 className="text-2xl font-semibold mb-4">My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border p-4 mb-4 rounded">
            <p className="font-medium">Total: ₹{order.totalPrice}</p>

            <div className="mt-2">
              {order.orderItems.map((item, i) =>
                item.product ? (
                  <div key={i} className="flex gap-4 items-center mt-2">
                    <img
                      src={item.product.image}
                      className="w-16 h-16 object-contain"
                    />

                    <div>
                      <p>{item.product.name}</p>
                      <p>₹{item.product.price}</p>
                      <p>Qty: {item.qty}</p>
                    </div>
                  </div>
                ) : null,
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrdersPage;
