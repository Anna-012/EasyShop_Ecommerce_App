import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiPackage,
  FiSearch,
  FiRefreshCw,
  FiShoppingBag,
  FiCheckCircle,
  FiXCircle,
  FiTag,
  FiEdit2,
  FiArrowUpRight,
  FiImage,
} from "react-icons/fi";
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
  }, [sellerId]);

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const { data } = await API.get(`/admin/seller/${sellerId}`);

      setSeller(data.seller || {});
      setProducts(data.products || []);
    } catch (error) {
      console.error(error);
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

      setProducts((prev) =>
        prev.map((product) =>
          product._id === id
            ? { ...product, isActive: !currentStatus }
            : product,
        ),
      );
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update product");
    }
  };

  const filteredProducts = products.filter((product) => {
    const query = search.toLowerCase();

    return (
      (product.title || "").toLowerCase().includes(query) ||
      (product.brand || "").toLowerCase().includes(query) ||
      (product.category?.title || "").toLowerCase().includes(query)
    );
  });

  const activeProducts = products.filter((product) => product.isActive).length;
  const inactiveProducts = products.length - activeProducts;

  const formatCurrency = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  const getSellerStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return "bg-emerald-50 text-emerald-700";
      case "pending":
        return "bg-amber-50 text-amber-700";
      default:
        return "bg-rose-50 text-rose-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#F8F7FA] p-4 sm:p-6 lg:p-8">
        <div className="mb-6 h-44 animate-pulse rounded-2xl bg-[#EDE5F7]" />

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl border border-[#EAE3F2] bg-white"
            />
          ))}
        </div>

        <div className="h-80 animate-pulse rounded-2xl border border-[#EAE3F2] bg-white" />

        <div className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-[#6D28D9]">
          <FiRefreshCw className="animate-spin" size={17} />
          Loading Seller Products...
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Products",
      value: products.length,
      description: "All seller products",
      icon: FiPackage,
      iconStyle: "bg-[#F0E7FC] text-[#6D28D9]",
    },
    {
      title: "Active Products",
      value: activeProducts,
      description: "Currently active",
      icon: FiCheckCircle,
      iconStyle: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Inactive Products",
      value: inactiveProducts,
      description: "Currently inactive",
      icon: FiXCircle,
      iconStyle: "bg-rose-50 text-rose-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7FA] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-[#E5D6F8] bg-white shadow-sm">
        <div className="h-2 bg-gradient-to-r from-[#4C1D95] via-[#6D28D9] to-[#A78BFA]" />

        <div className="p-5 sm:p-7">
          <button
            type="button"
            onClick={() => navigate("/admin/sellers")}
            className="mb-5 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#6D28D9] transition hover:bg-[#F0E7FC]"
          >
            <FiArrowLeft size={17} />
            Back to Sellers
          </button>

          <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-start">
            <div className="min-w-0">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#7952A5]">
                BIRD Management
              </p>

              <h1 className="break-words text-2xl font-bold tracking-tight text-[#352047] sm:text-3xl">
                {seller.name || "Seller"}&apos;s Products
              </h1>

              <p className="mt-2 text-sm text-[#796B87]">
                Manage and monitor products uploaded by this seller.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-[#EEE7F5] bg-[#FCFAFF] p-3">
                  <p className="text-xs font-medium text-[#897A98]">Seller</p>
                  <p className="mt-1 break-words text-sm font-bold text-[#352047]">
                    {seller.name || "Not available"}
                  </p>
                </div>

                <div className="rounded-xl border border-[#EEE7F5] bg-[#FCFAFF] p-3">
                  <p className="text-xs font-medium text-[#897A98]">
                    Email Address
                  </p>
                  <p className="mt-1 break-all text-sm font-semibold text-[#554064]">
                    {seller.email || "Not available"}
                  </p>
                </div>

                <div className="rounded-xl border border-[#EEE7F5] bg-[#FCFAFF] p-3">
                  <p className="text-xs font-medium text-[#897A98]">
                    Seller Status
                  </p>
                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${getSellerStatusStyle(
                      seller.sellerStatus,
                    )}`}
                  >
                    {seller.sellerStatus || "Unknown"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 xl:max-w-sm">
              <label className="relative block">
                <FiSearch
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B6AAF]"
                />

                <input
                  type="text"
                  placeholder="Search product, brand or category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-[#E5D6F8] bg-[#FCFAFF] py-3 pl-11 pr-4 text-sm text-[#352047] outline-none transition placeholder:text-[#A092AF] focus:border-[#8B5CF6] focus:bg-white focus:ring-4 focus:ring-[#7C3AED]/10"
                />
              </label>

              <button
                type="button"
                onClick={fetchProducts}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E5D6F8] bg-white px-4 py-3 text-sm font-semibold text-[#5B21B6] transition hover:bg-[#F5EEFF]"
              >
                <FiRefreshCw size={16} />
                Refresh Products
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="mb-7 grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="group rounded-2xl border border-[#EAE3F2] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#D7C2F3] hover:shadow-lg hover:shadow-purple-900/5 sm:p-6"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconStyle}`}
                >
                  <Icon size={22} />
                </span>

                <FiArrowUpRight
                  size={18}
                  className="text-[#C2B2D4] transition group-hover:text-[#6D28D9]"
                />
              </div>

              <p className="mt-5 text-sm font-medium text-[#796B87]">
                {card.title}
              </p>

              <h2 className="mt-1 text-3xl font-bold text-[#352047]">
                {card.value}
              </h2>

              <p className="mt-2 text-xs text-[#A092AF]">{card.description}</p>
            </div>
          );
        })}
      </div>

      {/* Products Table */}
      <section className="overflow-hidden rounded-2xl border border-[#EAE3F2] bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-[#EEE7F5] px-5 py-5 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-[#352047]">
              Seller Products
            </h2>

            <p className="mt-1 text-sm text-[#897A98]">
              {filteredProducts.length} of {products.length} products
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#F2EAFE] px-3 py-2 text-xs font-semibold text-[#6D28D9]">
            <FiShoppingBag size={14} />
            Product Inventory
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0E7FC] text-[#6D28D9]">
              {search ? <FiSearch size={28} /> : <FiPackage size={28} />}
            </span>

            <h3 className="mt-4 text-lg font-bold text-[#352047]">
              {search ? "No matching products" : "No products found"}
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-[#897A98]">
              {search
                ? "Try another product name, brand or category."
                : "Products uploaded by this seller will appear here."}
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
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead>
                <tr className="bg-[#F8F3FF] text-[11px] uppercase tracking-[0.12em] text-[#6B4A91]">
                  <th className="px-5 py-4 font-bold">Product</th>
                  <th className="px-5 py-4 font-bold">Category</th>
                  <th className="px-5 py-4 font-bold">Price</th>
                  <th className="px-5 py-4 font-bold">Stock</th>
                  <th className="px-5 py-4 font-bold">Status</th>
                  <th className="px-5 py-4 text-center font-bold">Actions</th>
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
                    {/* Product */}
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
                            <FiImage size={23} className="text-[#B9A4D2]" />
                          )}
                        </div>

                        <div className="max-w-[220px]">
                          <p
                            className={`line-clamp-2 text-sm font-bold ${
                              product.isActive
                                ? "text-[#352047]"
                                : "text-[#8B7C99]"
                            }`}
                          >
                            {product.title || "Untitled Product"}
                          </p>

                          <p className="mt-1 text-xs text-[#897A98]">
                            {product.brand || "No brand"}
                          </p>

                          <p className="mt-1 text-[10px] text-[#A092AF]">
                            ID: {String(product._id).slice(-6).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-[#F2EAFE] px-3 py-1.5 text-xs font-semibold text-[#6D28D9]">
                        {product.category?.title || "Uncategorized"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="whitespace-nowrap px-5 py-4">
                      <p className="text-sm font-bold text-[#5B21B6]">
                        {formatCurrency(product.sellingPrice)}
                      </p>

                      {product.mrpPrice != null && (
                        <p className="mt-1 text-xs text-[#A092AF] line-through">
                          {formatCurrency(product.mrpPrice)}
                        </p>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-4">
                      <span
                        className={`text-sm font-semibold ${
                          Number(product.stockQuantity) <= 5
                            ? "text-rose-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {product.stockQuantity ?? 0}
                      </span>

                      {Number(product.stockQuantity) <= 5 && (
                        <p className="mt-1 text-[10px] font-medium text-rose-500">
                          Low stock
                        </p>
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

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/seller/add-product/${product._id}`)
                          }
                          className="inline-flex items-center gap-1.5 rounded-xl border border-[#DCC8F6] bg-[#F5EEFF] px-3 py-2 text-xs font-semibold text-[#5B21B6] transition hover:border-[#BFA0ED] hover:bg-[#EDE3FF] focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/10"
                        >
                          <FiEdit2 size={14} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            toggleStatus(product._id, product.isActive)
                          }
                          className={`rounded-xl border px-3 py-2 text-xs font-semibold transition focus:outline-none focus:ring-4 ${
                            product.isActive
                              ? "border-rose-200 bg-rose-50 text-rose-600 hover:border-rose-300 hover:bg-rose-100 focus:ring-rose-100"
                              : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100 focus:ring-emerald-100"
                          }`}
                        >
                          {product.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        {filteredProducts.length > 0 && (
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

            <div className="flex items-center gap-2 text-xs font-medium text-[#6D28D9]">
              <FiTag size={14} />
              Seller inventory management
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminSellerProductsPage;
