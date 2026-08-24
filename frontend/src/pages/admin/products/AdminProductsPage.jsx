import { useEffect, useState } from "react";
import API from "../../../services/api";
import { useNavigate } from "react-router-dom";

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await API.get("/products/get-all-products");
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    const confirmAction = window.confirm(
      "Are you sure you want to change this product status?",
    );

    if (!confirmAction) return;

    try {
      const { data } = await API.put(`/admin/toggle-product-status/${id}`);

      setProducts((prev) =>
        prev.map((product) => (product._id === id ? data.product : product)),
      );

      alert(data.message);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  const filteredProducts = products.filter((product) => {
    return (
      product.title.toLowerCase().includes(search.toLowerCase()) ||
      product.brand.toLowerCase().includes(search.toLowerCase()) ||
      product.category?.title?.toLowerCase().includes(search.toLowerCase()) ||
      product.seller?.name?.toLowerCase().includes(search.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <h2 className="text-2xl font-semibold">Loading Products...</h2>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products Management</h1>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by product, brand, seller or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-gray-600">
            No Products Found
          </h2>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-3">Image</th>

                <th className="border p-3">Title</th>

                <th className="border p-3">Seller</th>

                <th className="border p-3">Brand</th>

                <th className="border p-3">Category</th>

                <th className="border p-3">Price</th>

                <th className="border p-3">Stock</th>

                <th className="border p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product._id}
                  className={`text-center transition ${
                    product.isActive
                      ? "hover:bg-gray-50"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <td className="border p-2">
                    <img
                      src={product.images?.[0]}
                      alt={product.title}
                      className="w-16 h-16 rounded object-cover mx-auto"
                    />
                  </td>

                  <td className="border p-2 font-medium">{product.title}</td>

                  <td className="border p-2">{product.seller?.name || "-"}</td>

                  <td className="border p-2">{product.brand}</td>

                  <td className="border p-2">{product.category?.title}</td>

                  <td className="border p-2">₹{product.sellingPrice}</td>

                  <td className="border p-2">
                    {product.stockQuantity > 0 ? (
                      <span className="text-green-600 font-semibold">
                        {product.stockQuantity}
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        Out of Stock
                      </span>
                    )}
                  </td>

                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => handleToggleStatus(product._id)}
                      className={`text-white px-3 py-1 rounded ${
                        product.isActive
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {product.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
