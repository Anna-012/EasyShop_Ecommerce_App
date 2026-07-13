import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../../services/api";
import SellerLayout from "../../../components/seller/SellerLayout";
import toast from "react-hot-toast";

const SellerProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await API.get("/products/seller-products");

      setProducts(response.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      const { data } = await API.put(`/products/toggle-status/${id}`);

      toast.success(data.message);

      fetchProducts();
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Status update failed");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) return;

    try {
      const { data } = await API.delete(`/products/deleteProduct/${id}`);

      toast.success(data.message);

      fetchProducts();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <SellerLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">My Products</h1>

            <p className="text-gray-500 mt-1">
              Manage all products in your store
            </p>
          </div>

          <Link
            to="/seller/add-product"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
          >
            + Add Product
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500">Total Products</p>

            <h2 className="text-3xl font-bold mt-2">{products.length}</h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500">Active Products</p>

            <h2 className="text-3xl font-bold mt-2">
              {products.filter((product) => product.stockQuantity > 0).length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500">Out of Stock</p>

            <h2 className="text-3xl font-bold mt-2">
              {products.filter((product) => product.stockQuantity === 0).length}
            </h2>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          {products.length === 0 ? (
            <div className="p-20 text-center">
              <h2 className="text-2xl font-semibold">No Products Found</h2>

              <p className="text-gray-500 mt-2">
                Start adding products to your store.
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-5 text-left">Product</th>

                  <th className="p-5 text-left">Category</th>

                  <th className="p-5 text-left">Price</th>

                  <th className="p-5 text-left">Stock</th>

                  <th className="p-5 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className={`border-b transition ${
                      product.isActive
                        ? "hover:bg-gray-50"
                        : "bg-gray-200 opacity-60"
                    }`}
                  >
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-20 h-20 rounded-xl object-cover"
                        />

                        <div>
                          <h3 className="font-semibold text-lg">
                            {product.title}
                          </h3>

                          <p className="text-gray-500">{product.brand}</p>
                          <div className="mt-2">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                product.isActive
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {product.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-5">{product.category?.title}</td>

                    <td className="p-5 font-semibold">
                      ₹{product.sellingPrice}
                    </td>

                    <td className="p-5">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          product.stockQuantity === 0
                            ? "bg-red-100 text-red-600"
                            : product.stockQuantity <= 5
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-green-100 text-green-600"
                        }`}
                      >
                        {product.stockQuantity}
                      </span>
                    </td>

                    <td className="p-5">
                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            navigate(`/seller/add-product/${product._id}`)
                          }
                          className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleToggleStatus(product._id)}
                          className={`text-white px-4 py-2 rounded-lg ${
                            product.isActive
                              ? "bg-orange-500 hover:bg-orange-600"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {product.isActive ? "Inactive" : "Active"}
                        </button>
                      </div>
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

export default SellerProductsPage;
