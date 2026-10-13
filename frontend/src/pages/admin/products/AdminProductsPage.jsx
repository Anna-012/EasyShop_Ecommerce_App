import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPackage,
  FiSearch,
  FiRefreshCw,
  FiTag,
  FiLayers,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiShoppingBag,
  FiArrowUpRight,
} from "react-icons/fi";
import API from "../../../services/api";

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const { data } = await API.get("/products/get-all-products");
      setProducts(data.products || []);
    } catch (error) {
      console.error(error);
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
      console.error(error);
      alert(error.response?.data?.message || "Failed to update status");
    }
  };

  const filteredProducts = products.filter((product) => {
    const query = search.toLowerCase();

    return (
      (product.title || "").toLowerCase().includes(query) ||
      (product.brand || "").toLowerCase().includes(query) ||
      (product.category?.title || "").toLowerCase().includes(query) ||
      (product.seller?.name || "").toLowerCase().includes(query)
    );
  });

  const activeProducts = products.filter((product) => product.isActive).length;

  const inactiveProducts = products.length - activeProducts;

  const totalStock = products.reduce(
    (total, product) => total + Number(product.stockQuantity || 0),
    0,
  );

  const totalCategories = new Set(
    products.map((product) => product.category?.title).filter(Boolean),
  ).size;

  const summaryCards = [
    {
      title: "Total Products",
      value: products.length,
      icon: FiPackage,
      iconStyle: "bg-[#F0E7FC] text-[#6D28D9]",
    },
    {
      title: "Active Products",
      value: activeProducts,
      icon: FiCheckCircle,
      iconStyle: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Inactive Products",
      value: inactiveProducts,
      icon: FiXCircle,
      iconStyle: "bg-rose-50 text-rose-600",
    },
    {
      title: "Total Stock",
      value: totalStock.toLocaleString("en-IN"),
      icon: FiLayers,
      iconStyle: "bg-violet-50 text-violet-600",
    },
    {
      title: "Categories",
      value: totalCategories,
      icon: FiTag,
      iconStyle: "bg-purple-50 text-purple-700",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7FA] p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7C3AED]" />
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7952A5]">
              BIRD Management
            </p>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#352047] sm:text-3xl">
            Products Management
          </h1>

          <p className="mt-2 text-sm text-[#796B87] sm:text-base">
            View, Manage And Control All Products
          </p>
        </div>

        <button
          type="button"
          onClick={fetchProducts}
          disabled={loading}
          className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-[#6D28D9] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-purple-900/15 transition hover:bg-[#5B21B6] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiRefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh Products
        </button>
      </div>

      {/* Summary Cards */}
      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="group rounded-2xl border border-[#EAE3F2] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#D7C2F3] hover:shadow-lg hover:shadow-purple-900/5"
            >
              <div className="flex items-center justify-between gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconStyle}`}
                >
                  <Icon size={22} strokeWidth={1.9} />
                </div>

                <FiArrowUpRight
                  size={18}
                  className="text-[#C2B2D4] transition group-hover:text-[#6D28D9]"
                />
              </div>

              <p className="mt-5 text-sm font-medium text-[#796B87]">
                {card.title}
              </p>

              <h2 className="mt-1 text-2xl font-bold text-[#352047]">
                {loading ? (
                  <span className="inline-block h-7 w-16 animate-pulse rounded bg-[#F0EAF6]" />
                ) : (
                  card.value
                )}
              </h2>
            </div>
          );
        })}
      </div>

      {/* Products Workspace */}
      <section className="overflow-hidden rounded-2xl border border-[#EAE3F2] bg-white shadow-sm">
        {/* Search and Toolbar */}
        <div className="border-b border-[#EEE7F5] p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#352047]">All Products</h2>
              <p className="mt-1 text-sm text-[#897A98]">
                {loading
                  ? "Loading your products..."
                  : `${filteredProducts.length} of ${products.length} products`}
              </p>
            </div>

            <div className="relative w-full lg:max-w-md">
              <FiSearch
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B6AAF]"
              />

              <input
                type="text"
                placeholder="Search product, brand, seller or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[#E5D6F8] bg-[#FCFAFF] py-3 pl-11 pr-4 text-sm text-[#352047] outline-none transition placeholder:text-[#A092AF] focus:border-[#9B6BDF] focus:bg-white focus:ring-4 focus:ring-[#6D28D9]/10"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-3 p-5">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex animate-pulse items-center gap-4 rounded-xl border border-[#F0EAF5] p-4"
              >
                <div className="h-14 w-14 rounded-xl bg-[#F0EAF5]" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded bg-[#F0EAF5]" />
                  <div className="h-3 w-1/5 rounded bg-[#F0EAF5]" />
                </div>
                <div className="hidden h-8 w-24 rounded-lg bg-[#F0EAF5] sm:block" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F2EAFE] text-[#6D28D9]">
              {search ? <FiSearch size={28} /> : <FiShoppingBag size={28} />}
            </div>

            <h3 className="mt-4 text-lg font-bold text-[#352047]">
              {search ? "No matching products" : "No products found"}
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-[#897A98]">
              {search
                ? "Try a different product name, brand, seller or category."
                : "Products will appear here when they are available in your store."}
            </p>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-5 rounded-xl bg-[#6D28D9] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#5B21B6]"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          /* Products Table */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead>
                <tr className="bg-[#F8F3FF] text-[11px] uppercase tracking-[0.12em] text-[#6B4A91]">
                  <th className="px-5 py-4 font-bold">Product</th>
                  <th className="px-5 py-4 font-bold">Seller</th>
                  <th className="px-5 py-4 font-bold">Brand</th>
                  <th className="px-5 py-4 font-bold">Category</th>
                  <th className="px-5 py-4 font-bold">Price</th>
                  <th className="px-5 py-4 font-bold">Stock</th>
                  <th className="px-5 py-4 font-bold">Status</th>
                  <th className="px-5 py-4 text-center font-bold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F0EAF5]">
                {filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className={`transition-colors ${
                      product.isActive
                        ? "hover:bg-[#FCFAFF]"
                        : "bg-[#FAF8FC] hover:bg-[#F7F1FC]"
                    }`}
                  >
                    {/* Product Image and Name */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#EEE7F5] bg-[#FAF8FC]">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.title || "Product"}
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <FiPackage size={23} className="text-[#B9A4D2]" />
                          )}
                        </div>

                        <div className="max-w-[190px]">
                          <p
                            className={`line-clamp-2 text-sm font-semibold ${
                              product.isActive
                                ? "text-[#352047]"
                                : "text-[#8B7C99]"
                            }`}
                          >
                            {product.title || "Untitled Product"}
                          </p>

                          <p className="mt-1 text-[11px] text-[#A092AF]">
                            ID: {String(product._id).slice(-6).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Seller */}
                    <td className="px-5 py-4 text-sm font-medium text-[#554064]">
                      {product.seller?.name || "—"}
                    </td>

                    {/* Brand */}
                    <td className="px-5 py-4 text-sm text-[#554064]">
                      {product.brand || "—"}
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-[#F2EAFE] px-3 py-1.5 text-xs font-semibold text-[#6D28D9]">
                        {product.category?.title || "Uncategorized"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="whitespace-nowrap px-5 py-4 text-sm font-bold text-[#352047]">
                      ₹
                      {Number(product.sellingPrice || 0).toLocaleString(
                        "en-IN",
                      )}
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-4">
                      {Number(product.stockQuantity) > 0 ? (
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          {product.stockQuantity}
                        </span>
                      ) : (
                        <span className="inline-flex flex-col gap-1">
                          <span className="text-sm font-bold text-rose-600">
                            0
                          </span>
                          <span className="text-[11px] font-medium text-rose-500">
                            Out of stock
                          </span>
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                          product.isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            product.isActive ? "bg-emerald-500" : "bg-rose-500"
                          }`}
                        />
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Toggle Action */}
                    <td className="px-5 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(product._id)}
                        className={`min-w-[105px] rounded-xl border px-3 py-2 text-xs font-semibold transition duration-200 focus:outline-none focus:ring-4 ${
                          product.isActive
                            ? "border-rose-200 bg-rose-50 text-rose-600 hover:border-rose-300 hover:bg-rose-100 focus:ring-rose-100"
                            : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100 focus:ring-emerald-100"
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

        {/* Table Footer */}
        {!loading && filteredProducts.length > 0 && (
          <div className="flex flex-col justify-between gap-2 border-t border-[#EEE7F5] bg-[#FCFAFE] px-5 py-4 sm:flex-row sm:items-center">
            <p className="text-xs text-[#897A98]">
              Showing{" "}
              <span className="font-semibold text-[#554064]">
                {filteredProducts.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#554064]">
                {products.length}
              </span>{" "}
              products
            </p>

            <div className="flex items-center gap-2 text-xs font-medium text-[#897A98]">
              <FiAlertCircle size={14} />
              Manage product availability from the Action column
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminProductsPage;
