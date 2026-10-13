import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiPackage,
  FiPlus,
  FiSearch,
  FiEdit2,
  FiPower,
  FiTrash2,
  FiArrowUpRight,
  FiBox,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";
import toast from "react-hot-toast";

import API from "../../../services/api";
import SellerLayout from "../../../components/seller/SellerLayout";

const SellerProductsPage = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await API.get("/products/seller-products");

      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (err) {
      console.error("Failed to fetch seller products:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load products. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      const { data } = await API.put(`/products/toggle-status/${id}`);

      toast.success(data.message || "Product status updated");
      await fetchProducts();
    } catch (err) {
      console.error(err);

      toast.error(err.response?.data?.message || "Status update failed");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      const { data } = await API.delete(`/products/deleteProduct/${id}`);

      toast.success(data.message || "Product deleted successfully");

      setProducts((current) => current.filter((product) => product._id !== id));
    } catch (err) {
      console.error(err);

      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const formatPrice = (price) =>
    `₹${Number(price || 0).toLocaleString("en-IN")}`;

  const filteredProducts = products.filter((product) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      !query ||
      product.title?.toLowerCase().includes(query) ||
      product.brand?.toLowerCase().includes(query) ||
      product.category?.title?.toLowerCase().includes(query);

    const stock = Number(product.stockQuantity || 0);

    const matchesFilter =
      filter === "all" ||
      (filter === "active" && product.isActive) ||
      (filter === "inactive" && !product.isActive) ||
      (filter === "out" && stock === 0) ||
      (filter === "low" && stock > 0 && stock <= 5);

    return matchesSearch && matchesFilter;
  });

  const activeCount = products.filter((product) => product.isActive).length;

  const inactiveCount = products.length - activeCount;

  const outOfStockCount = products.filter(
    (product) => Number(product.stockQuantity || 0) === 0,
  ).length;

  const stats = [
    {
      label: "Total products",
      value: products.length,
      icon: FiPackage,
      description: "Products in your catalogue",
    },
    {
      label: "Active products",
      value: activeCount,
      icon: FiBox,
      description: "Currently marked active",
    },
    {
      label: "Out of stock",
      value: outOfStockCount,
      icon: FiAlertCircle,
      description: "Products needing restock",
    },
  ];

  return (
    <SellerLayout>
      <main className="min-h-screen min-w-0 bg-[#F8F7FA] px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-9">
        <div className="mx-auto w-full max-w-[1600px] min-w-0">
          {/* Page heading */}
          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#6D28D9]">
                Store inventory
              </p>

              <h1 className="text-3xl font-semibold tracking-tight text-[#241A31] sm:text-4xl">
                My Products
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
                Manage your catalogue, pricing and stock.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={fetchProducts}
                disabled={loading}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#E7E0EF] bg-white px-4 py-2.5 text-sm font-medium text-[#4C1D95] transition hover:border-[#C8B5E5] hover:bg-[#FCFAFF] disabled:opacity-60"
              >
                <FiRefreshCw
                  size={15}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>

              <Link
                to="/seller/add-product"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#4C1D95] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3B1675] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2"
              >
                <FiPlus size={17} />
                Add Product
              </Link>
            </div>
          </div>

          {/* Statistics */}
          <section
            aria-label="Product statistics"
            className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:gap-5"
          >
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-xl border border-[#EAE5EF] bg-white p-5 sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {stat.label}
                      </p>

                      <p className="mt-3 text-3xl font-semibold tracking-tight text-[#352047]">
                        {loading ? (
                          <span className="inline-block h-9 w-12 animate-pulse rounded bg-gray-100" />
                        ) : (
                          stat.value
                        )}
                      </p>
                    </div>

                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#F4F0F9] text-[#5B3488]">
                      <Icon size={21} />
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-gray-400">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </section>

          {/* Inventory panel */}
          <section className="min-w-0 overflow-hidden rounded-xl border border-[#EAE5EF] bg-white">
            {/* Search and filters */}
            <div className="border-b border-[#F0EDF3] p-5 sm:p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[#241A31]">
                    Product inventory
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {loading
                      ? "Loading your products..."
                      : `${filteredProducts.length} of ${products.length} products`}
                  </p>
                </div>

                <div className="flex min-w-0 flex-col gap-3 sm:flex-row">
                  <div className="relative min-w-0 sm:w-64">
                    <FiSearch
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search products..."
                      aria-label="Search products"
                      className="h-11 w-full rounded-lg border border-[#EAE5EF] bg-[#FCFBFD] pl-10 pr-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#A78BCA] focus:bg-white focus:ring-2 focus:ring-purple-100"
                    />
                  </div>

                  <select
                    value={filter}
                    onChange={(event) => setFilter(event.target.value)}
                    aria-label="Filter products"
                    className="h-11 min-w-0 rounded-lg border border-[#EAE5EF] bg-white px-3 text-sm text-gray-600 outline-none focus:border-[#A78BCA] focus:ring-2 focus:ring-purple-100 sm:w-48"
                  >
                    <option value="all">All products</option>
                    <option value="active">Active products</option>
                    <option value="inactive">Inactive products</option>
                    <option value="out">Out of stock</option>
                    <option value="low">Low stock (1–5)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="space-y-4 p-6">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-20 animate-pulse rounded-lg bg-[#F8F7FA]"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="px-5 py-16 text-center sm:px-8">
                <p className="text-sm text-red-600">{error}</p>

                <button
                  type="button"
                  onClick={fetchProducts}
                  className="mt-4 rounded-lg bg-[#4C1D95] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#3B1675]"
                >
                  Try again
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="px-5 py-16 text-center sm:px-8">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[#F4F0F9] text-[#5B3488]">
                  <FiPackage size={25} />
                </div>

                <h3 className="text-lg font-semibold text-[#352047]">
                  No products yet
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                  Your product catalogue is empty. Add your first product to get
                  started.
                </p>

                <Link
                  to="/seller/add-product"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#4C1D95] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#3B1675]"
                >
                  <FiPlus size={16} />
                  Add your first product
                </Link>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="px-5 py-16 text-center sm:px-8">
                <FiSearch size={25} className="mx-auto mb-3 text-gray-400" />

                <h3 className="font-semibold text-[#352047]">
                  No matching products
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Try another search or change your filter.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setFilter("all");
                  }}
                  className="mt-4 text-sm font-semibold text-[#5B3488] hover:text-[#4C1D95]"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                {/* Responsive table */}
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-[#F0EDF3] bg-[#FCFBFD]">
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Product
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Category
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Price
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Stock
                        </th>

                        <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Status
                        </th>

                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#F0EDF3]">
                      {filteredProducts.map((product) => {
                        const stock = Number(product.stockQuantity || 0);
                        const image =
                          product.images?.[0] || product.image || "";

                        return (
                          <tr
                            key={product._id}
                            className={`transition hover:bg-[#FCFBFD] ${
                              product.isActive ? "" : "bg-gray-50/70"
                            }`}
                          >
                            {/* Product information */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="flex h-[68px] w-[68px] shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#F0EDF3] bg-[#F8F6FA]">
                                  {image ? (
                                    <img
                                      src={image}
                                      alt={product.title || "Product"}
                                      loading="lazy"
                                      className="h-full w-full object-contain p-1"
                                    />
                                  ) : (
                                    <FiPackage
                                      size={23}
                                      className="text-[#B7A8C8]"
                                    />
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <h3 className="max-w-[230px] truncate text-sm font-semibold text-[#352047]">
                                    {product.title || "Untitled Product"}
                                  </h3>

                                  <p className="mt-1 text-sm text-gray-500">
                                    {product.brand || "No brand"}
                                  </p>

                                  <p className="mt-1 text-xs text-gray-400">
                                    ID: {String(product._id).slice(-8)}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="px-5 py-4 text-sm text-gray-600">
                              {product.category?.title || "Uncategorized"}
                            </td>

                            {/* Price */}
                            <td className="px-5 py-4">
                              <p className="whitespace-nowrap text-sm font-semibold text-[#352047]">
                                {formatPrice(product.sellingPrice)}
                              </p>

                              {Number(product.mrpPrice) >
                                Number(product.sellingPrice) && (
                                <p className="mt-1 whitespace-nowrap text-xs text-gray-400 line-through">
                                  {formatPrice(product.mrpPrice)}
                                </p>
                              )}
                            </td>

                            {/* Stock */}
                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
                                  stock === 0
                                    ? "bg-red-50 text-red-600"
                                    : stock <= 5
                                      ? "bg-amber-50 text-amber-700"
                                      : "bg-emerald-50 text-emerald-700"
                                }`}
                              >
                                {stock === 0
                                  ? "Out of stock"
                                  : `${stock} in stock`}
                              </span>
                            </td>

                            {/* Active status */}
                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-medium ${
                                  product.isActive
                                    ? "text-emerald-700"
                                    : "text-gray-500"
                                }`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    product.isActive
                                      ? "bg-emerald-500"
                                      : "bg-gray-400"
                                  }`}
                                />

                                {product.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    navigate(
                                      `/seller/add-product/${product._id}`,
                                    )
                                  }
                                  title="Edit product"
                                  aria-label={`Edit ${product.title || "product"}`}
                                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#EAE5EF] bg-white text-gray-500 transition hover:border-[#C8B5E5] hover:bg-[#F8F5FC] hover:text-[#5B3488]"
                                >
                                  <FiEdit2 size={15} />
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleToggleStatus(product._id)
                                  }
                                  title={
                                    product.isActive
                                      ? "Deactivate product"
                                      : "Activate product"
                                  }
                                  aria-label={
                                    product.isActive
                                      ? "Deactivate product"
                                      : "Activate product"
                                  }
                                  className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${
                                    product.isActive
                                      ? "border-amber-100 bg-white text-amber-700 hover:bg-amber-50"
                                      : "border-emerald-100 bg-white text-emerald-700 hover:bg-emerald-50"
                                  }`}
                                >
                                  <FiPower size={15} />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDelete(product._id)}
                                  title="Delete product"
                                  aria-label={`Delete ${product.title || "product"}`}
                                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 bg-white text-red-500 transition hover:bg-red-50"
                                >
                                  <FiTrash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Table footer */}
                <div className="flex flex-col gap-2 border-t border-[#F0EDF3] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <p className="text-xs text-gray-500">
                    Showing{" "}
                    <span className="font-semibold text-gray-700">
                      {filteredProducts.length}
                    </span>{" "}
                    products
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate("/seller/add-product")}
                    className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-[#5B3488] transition hover:text-[#4C1D95]"
                  >
                    Add another product
                    <FiArrowUpRight size={16} />
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </SellerLayout>
  );
};

export default SellerProductsPage;
