import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../services/api";

const AdminSellerDashboard = () => {
  const navigate = useNavigate();
  const { sellerId } = useParams();

  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState({
    seller: {},
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
    latestProducts: [],
    recentOrders: [],
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await API.get(`/admin/seller/${sellerId}/dashboard`);

      setDashboard(data);
    } catch (error) {
      console.log(error);
      alert("Failed to load seller dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}

      <div className="flex justify-between items-center mb-8">
        <div>
          <button
            onClick={() => navigate("/admin/sellers")}
            className="text-blue-600 hover:underline mb-3"
          >
            ← Back to Sellers
          </button>

          <h1 className="text-4xl font-bold">
            {dashboard.seller.name}'s Dashboard
          </h1>

          <p className="text-gray-500 mt-2">Seller performance overview</p>
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
            {dashboard.seller.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 className="font-bold text-xl">{dashboard.seller.name}</h2>

            <p className="text-gray-500">{dashboard.seller.email}</p>

            <p className="text-gray-500">
              {dashboard.seller.phoneNumber || "No Phone"}
            </p>
          </div>
        </div>
      </div>

      {/* Cards */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div
          onClick={() => navigate(`/admin/seller/${sellerId}/products`)}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl hover:scale-105 transition cursor-pointer"
        >
          <h2 className="text-lg text-gray-500">📦 Total Products</h2>

          <p className="text-4xl font-bold mt-3 text-blue-600">
            {dashboard.totalProducts}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg text-gray-500">🛒 Total Orders</h2>

          <p className="text-4xl font-bold mt-3 text-green-600">
            {dashboard.totalOrders}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
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
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-semibold">Recent Orders</h2>

            <span className="text-sm text-gray-500">Last 5 Orders</span>
          </div>

          {dashboard.recentOrders.length === 0 ? (
            <div className="flex justify-center items-center h-48 text-gray-500">
              No Orders Found
            </div>
          ) : (
            <div className="space-y-4">
              {dashboard.recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="border rounded-xl p-4 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">#{order._id.slice(-6)}</h3>

                      <p className="text-sm text-gray-500">
                        Customer : {order.user?.name}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-green-600 text-lg">
                        ₹{order.totalPrice}
                      </p>

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
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Latest Products */}

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-semibold">Latest Products</h2>

            <span className="text-sm text-gray-500">Last 5 Products</span>
          </div>

          {dashboard.latestProducts.length === 0 ? (
            <div className="flex justify-center items-center h-48 text-gray-500">
              No Products Found
            </div>
          ) : (
            <div className="space-y-4">
              {dashboard.latestProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center gap-4 border rounded-xl p-3 hover:shadow-md transition"
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

      {/* Seller Information */}

      <div className="bg-white rounded-xl shadow-md p-6 mt-8">
        <h2 className="text-2xl font-semibold mb-6">Seller Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-500 text-sm">Seller Name</p>

            <p className="font-semibold text-lg">{dashboard.seller.name}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Email</p>

            <p className="font-semibold text-lg">{dashboard.seller.email}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Phone</p>

            <p className="font-semibold text-lg">
              {dashboard.seller.phoneNumber || "Not Available"}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Seller Status</p>

            <span
              className={`inline-block mt-2 px-4 py-2 rounded-full text-sm font-medium ${
                dashboard.seller.sellerStatus === "approved"
                  ? "bg-green-100 text-green-700"
                  : dashboard.seller.sellerStatus === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {dashboard.seller.sellerStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSellerDashboard;
