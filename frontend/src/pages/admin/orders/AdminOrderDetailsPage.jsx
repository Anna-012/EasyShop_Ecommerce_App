import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../../services/api";

const AdminOrderDetailsPage = () => {
  const [status, setStatus] = useState("");
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await API.get(`/orders/${id}`);

        console.log("ORDER DETAILS:", data);

        setOrder(data);
        setStatus(data.status);
      } catch (error) {
        console.log(error.response?.data || error.message);
      }
    };

    fetchOrder();
  }, [id]);

  if (!order) {
    return <h2>Loading...</h2>;
  }

  const handleStatusUpdate = async () => {
    try {
      const { data } = await API.patch(`/orders/${id}/status`, { status });

      console.log("UPDATED:", data);

      setOrder(data);
      setStatus(data.status);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  return (
    <div className="mt-8 max-w-4xl">
      <h2 className="text-2xl font-semibold mb-6">Ordered Products</h2>

      <div className="space-y-4">
        {order.orderItems.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-xl shadow-sm border p-5 flex items-center justify-between"
          >
            <div className="flex items-center gap-5">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded-lg border"
              />

              <div>
                <h3 className="text-lg font-semibold">{item.product.name}</h3>

                <p className="text-gray-500 mt-1">Quantity: {item.qty}</p>

                <p className="text-gray-500">
                  Unit Price: ₹{item.price.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500">Subtotal</p>

              <p className="text-xl font-bold">
                ₹{(item.qty * item.price).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option>Placed</option>
        <option>Processing</option>
        <option>Shipped</option>
        <option>Delivered</option>
      </select>
      <button onClick={handleStatusUpdate}>Update Status</button>
    </div>
  );
};

export default AdminOrderDetailsPage;
