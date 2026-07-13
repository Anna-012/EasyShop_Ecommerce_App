import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../services/api";

const AdminSellerProductsPage = () => {
  const navigate = useNavigate();
  const { sellerId } = useParams();

  const [loading, setLoading] = useState(true);
  const [seller, setSeller] = useState({});
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await API.get(`/admin/seller/${sellerId}`);

      setSeller(data.seller);
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch seller products");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await API.put(`/products/update-product/${id}`, {
        isActive: !currentStatus,
      });

      fetchProducts();
    } catch (error) {
      console.log(error);
      alert("Failed to update product");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase()),
  );

  const activeProducts = products.filter((p) => p.isActive).length;

  const inactiveProducts = products.filter((p) => !p.isActive).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-2xl font-semibold">
        Loading Products...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}

      <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
        <button
          onClick={() => navigate("/admin/sellers")}
          className="text-blue-600 hover:text-blue-700 mb-5 font-medium"
        >
          ← Back to Sellers
        </button>

        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-8">
          <div>
            <h1 className="text-4xl font-bold">{seller?.name}'s Products</h1>

            <p className="text-gray-500 mt-2">
              Manage all products uploaded by this seller.
            </p>

            <div className="flex flex-wrap gap-8 mt-6">
              <div>
                <p className="text-sm text-gray-500">Seller</p>

                <p className="font-semibold">{seller?.name}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>

                <p className="font-semibold">{seller?.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Status</p>

                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                    seller?.sellerStatus === "approved"
                      ? "bg-green-100 text-green-700"
                      : seller?.sellerStatus === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {seller?.sellerStatus}
                </span>
              </div>
            </div>
          </div>

          <div>
            <input
              type="text"
              placeholder="Search Product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-xl px-5 py-3 w-80 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-500">Total Products</p>

          <h2 className="text-4xl font-bold mt-3">{products.length}</h2>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-500">Active Products</p>

          <h2 className="text-4xl font-bold text-green-600 mt-3">
            {activeProducts}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-500">Inactive Products</p>

          <h2 className="text-4xl font-bold text-red-600 mt-3">
            {inactiveProducts}
          </h2>
        </div>
      </div>
      {/* Products Table */}

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left">Image</th>

                <th className="px-6 py-4 text-left">Product</th>

                <th className="px-6 py-4 text-left">Category</th>

                <th className="px-6 py-4 text-left">Price</th>

                <th className="px-6 py-4 text-left">Stock</th>

                <th className="px-6 py-4 text-left">Status</th>

                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-16 text-gray-500 text-lg"
                  >
                    No Products Found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className={`border-t hover:bg-gray-50 transition ${
                      !product.isActive ? "bg-gray-100 opacity-70" : ""
                    }`}
                  >
                    {/* Image */}

                    <td className="px-6 py-4">
                      <img
                        src={product.images?.[0]}
                        alt={product.title}
                        className="w-16 h-16 rounded-lg object-cover border"
                      />
                    </td>

                    {/* Product */}

                    <td className="px-6 py-4">
                      <h3 className="font-semibold text-gray-800">
                        {product.title}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {product.brand}
                      </p>
                    </td>

                    {/* Category */}

                    <td className="px-6 py-4">{product.category?.title}</td>

                    {/* Price */}

                    <td className="px-6 py-4">
                      <p className="font-bold text-green-600">
                        ₹{product.sellingPrice}
                      </p>

                      <p className="text-sm text-gray-400 line-through">
                        ₹{product.mrpPrice}
                      </p>
                    </td>

                    {/* Stock */}

                    <td className="px-6 py-4">
                      <span
                        className={`font-semibold ${
                          product.stockQuantity <= 5
                            ? "text-red-600"
                            : "text-gray-700"
                        }`}
                      >
                        {product.stockQuantity}
                      </span>
                    </td>

                    {/* Status */}

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          product.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() =>
                            navigate(`/seller/add-product/${product._id}`)
                          }
                          className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            toggleStatus(product._id, product.isActive)
                          }
                          className={`px-4 py-2 rounded-lg text-white text-sm ${
                            product.isActive
                              ? "bg-orange-500 hover:bg-orange-600"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {product.isActive ? "Deactivate" : "Activate"}
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

export default AdminSellerProductsPage;
