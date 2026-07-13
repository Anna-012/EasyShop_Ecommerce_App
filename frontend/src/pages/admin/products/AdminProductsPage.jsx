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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/products/delete-product/${id}`);

      setProducts((prev) => prev.filter((item) => item._id !== id));

      alert("Product deleted successfully");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Delete failed");
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

        <button
          onClick={() => navigate("/seller/add-product")}
          className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-lg"
        >
          + Add Product
        </button>
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
                  className="text-center hover:bg-gray-50 transition"
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
                      onClick={() =>
                        navigate(`/admin/products/edit/${product._id}`)
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
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
