import { useEffect, useState } from "react";
import SellerLayout from "../../components/seller/SellerLayout";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState({
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
    recentOrders: [],
    latestProducts: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await API.get("/seller/dashboard");
      console.log(data);
      setDashboard({
        totalProducts: data.totalProducts,
        totalOrders: data.totalOrders,
        revenue: data.revenue,
        recentOrders: data.recentOrders || [],
        latestProducts: data.latestProducts || [],
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SellerLayout>
        <div className="flex justify-center items-center h-screen text-2xl font-semibold">
          Loading Dashboard...
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-4xl font-bold mb-2">Seller Dashboard</h1>

        <p className="text-gray-600 mb-8">
          Welcome back! Manage your store from here.
        </p>

        {/* Dashboard Cards */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div
            onClick={() => navigate("/seller/products")}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl hover:scale-105 transition cursor-pointer"
          >
            <h2 className="text-lg text-gray-500">📦 Total Products</h2>

            <p className="text-4xl font-bold mt-3 text-blue-600">
              {dashboard.totalProducts}
            </p>
          </div>

          <div
            onClick={() => navigate("/seller/orders")}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl hover:scale-105 transition cursor-pointer"
          >
            <h2 className="text-lg text-gray-500">🛒 Total Orders</h2>

            <p className="text-4xl font-bold mt-3 text-green-600">
              {dashboard.totalOrders}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
            <h2 className="text-lg text-gray-500">💰 Revenue</h2>

            <p className="text-4xl font-bold mt-3 text-red-600">
              ₹{dashboard.revenue}
            </p>
          </div>
        </div>

        {/* Bottom Section */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-5">Recent Orders</h2>

            {dashboard.recentOrders.length === 0 ? (
              <p className="text-gray-500">No Orders Yet.</p>
            ) : (
              <div className="space-y-3">
                {dashboard.recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        #{order._id.slice(-6)}
                      </p>

                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>

                    <div>
                      <p className="font-bold text-green-600 text-lg">
                        ₹{order.totalPrice}
                      </p>
                    </div>

                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Shipped"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Latest Products */}

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-5">Latest Products</h2>

            {dashboard.latestProducts.length === 0 ? (
              <p className="text-gray-500">No Products Found.</p>
            ) : (
              <div className="space-y-4">
                {dashboard.latestProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center gap-4 border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold">{product.title}</h3>

                      <p className="text-green-600 font-bold">
                        ₹{product.sellingPrice}
                      </p>

                      <p className="text-sm text-gray-500">
                        Stock : {product.stockQuantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </SellerLayout>
  );
};

export default SellerDashboard;
