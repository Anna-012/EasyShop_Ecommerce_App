import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiRefreshCw,
  FiPackage,
  FiShoppingBag,
  FiTrendingUp,
  FiMail,
  FiPhone,
  FiUser,
  FiCalendar,
  FiArrowUpRight,
  FiCheckCircle,
  FiClock,
  FiShield,
  FiImage,
} from "react-icons/fi";
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
  }, [sellerId]);

  const fetchDashboard = async () => {
    setLoading(true);

    try {
      const { data } = await API.get(`/admin/seller/${sellerId}/dashboard`);

      setDashboard(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load seller dashboard");
    } finally {
      setLoading(false);
    }
  };

  const seller = dashboard.seller || {};
  const sellerName = seller.name || "Seller";
  const firstLetter = sellerName.trim().charAt(0).toUpperCase() || "S";

  const formatCurrency = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getOrderStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-700";
      case "Shipped":
        return "bg-blue-50 text-blue-700";
      case "Processing":
        return "bg-amber-50 text-amber-700";
      case "Cancelled":
        return "bg-rose-50 text-rose-700";
      default:
        return "bg-[#F2EAFE] text-[#6D28D9]";
    }
  };

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

  const statsCards = [
    {
      title: "Total Products",
      value: dashboard.totalProducts,
      description: "Products listed by seller",
      icon: FiPackage,
      iconStyle: "bg-[#F0E7FC] text-[#6D28D9]",
      clickable: true,
      onClick: () => navigate(`/admin/seller/${sellerId}/products`),
    },
    {
      title: "Total Orders",
      value: dashboard.totalOrders,
      description: "Orders associated with seller",
      icon: FiShoppingBag,
      iconStyle: "bg-[#EDE9FE] text-[#6D28D9]",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(dashboard.revenue),
      description: "Seller revenue overview",
      icon: FiTrendingUp,
      iconStyle: "bg-[#6D28D9] text-white",
      highlight: true,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#F8F7FA] p-4 sm:p-6 lg:p-8">
        <div className="mb-6 h-24 animate-pulse rounded-2xl bg-[#EDE5F7]" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-36 animate-pulse rounded-2xl border border-[#EAE3F2] bg-white"
            />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-64 animate-pulse rounded-2xl border border-[#EAE3F2] bg-white"
            />
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-[#6D28D9]">
          <FiRefreshCw className="animate-spin" size={17} />
          Loading Seller Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7FA] p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate("/admin/sellers")}
          className="mb-5 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#6D28D9] transition hover:bg-[#F0E7FC]"
        >
          <FiArrowLeft size={17} />
          Back to Sellers
        </button>

        <div className="overflow-hidden rounded-2xl border border-[#E5D6F8] bg-white shadow-sm">
          <div className="h-2 bg-gradient-to-r from-[#4C1D95] via-[#6D28D9] to-[#A78BFA]" />

          <div className="flex flex-col justify-between gap-5 p-5 sm:flex-row sm:items-center sm:p-7">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#7952A5]">
                BIRD Management
              </p>

              <h1 className="break-words text-2xl font-bold tracking-tight text-[#352047] sm:text-3xl">
                Seller Dashboard
              </h1>

              <p className="mt-2 text-sm text-[#796B87]">
                Review seller performance, orders and products.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 rounded-xl border border-[#E5D6F8] bg-[#FAF6FF] p-3 sm:min-w-[240px]">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#6D28D9] text-lg font-bold text-white shadow-md shadow-purple-900/15">
                  {firstLetter}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-bold text-[#352047]">
                    {sellerName}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-[#897A98]">
                    {seller.email || "No email available"}
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${getSellerStatusStyle(
                      seller.sellerStatus,
                    )}`}
                  >
                    {seller.sellerStatus || "Unknown"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={fetchDashboard}
                disabled={loading}
                aria-label="Refresh seller dashboard"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E5D6F8] bg-white text-[#6D28D9] transition hover:bg-[#F5EEFF] disabled:opacity-60"
              >
                <FiRefreshCw size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Cards */}
      <div className="mb-7 grid grid-cols-1 gap-4 md:grid-cols-3">
        {statsCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              onClick={card.onClick}
              onKeyDown={(event) => {
                if (
                  card.clickable &&
                  (event.key === "Enter" || event.key === " ")
                ) {
                  event.preventDefault();
                  card.onClick();
                }
              }}
              role={card.clickable ? "button" : undefined}
              tabIndex={card.clickable ? 0 : undefined}
              className={`group relative overflow-hidden rounded-2xl border p-5 shadow-sm transition duration-200 sm:p-6 ${
                card.highlight
                  ? "border-[#6D28D9] bg-gradient-to-br from-[#6D28D9] to-[#4C1D95] text-white shadow-md shadow-purple-900/10"
                  : "border-[#EAE3F2] bg-white hover:border-[#D7C2F3] hover:shadow-lg hover:shadow-purple-900/5"
              } ${
                card.clickable
                  ? "cursor-pointer hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/15"
                  : ""
              }`}
            >
              {card.highlight && (
                <div className="pointer-events-none absolute -right-7 -top-7 h-28 w-28 rounded-full bg-white/10" />
              )}

              <div className="relative flex items-start justify-between gap-3">
                <div>
                  <p
                    className={`text-sm font-medium ${
                      card.highlight ? "text-purple-100" : "text-[#796B87]"
                    }`}
                  >
                    {card.title}
                  </p>

                  <h2
                    className={`mt-4 break-words text-3xl font-bold tracking-tight ${
                      card.highlight ? "text-white" : "text-[#352047]"
                    }`}
                  >
                    {card.value}
                  </h2>
                </div>

                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                    card.highlight ? "bg-white/15 text-white" : card.iconStyle
                  }`}
                >
                  <Icon size={22} />
                </span>
              </div>

              <div
                className={`relative mt-5 flex items-center justify-between gap-2 border-t pt-4 text-xs font-medium ${
                  card.highlight
                    ? "border-white/20 text-purple-100"
                    : "border-[#F0EAF5] text-[#897A98]"
                }`}
              >
                <span>{card.description}</span>

                {card.clickable && <FiArrowUpRight size={16} />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders and Latest Products */}
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
        {/* Recent Orders */}
        <section className="overflow-hidden rounded-2xl border border-[#EAE3F2] bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-[#EEE7F5] px-5 py-5">
            <div>
              <h2 className="text-lg font-bold text-[#352047]">
                Recent Orders
              </h2>
              <p className="mt-1 text-sm text-[#897A98]">
                Latest orders from this seller
              </p>
            </div>

            <span className="rounded-full bg-[#F2EAFE] px-3 py-1.5 text-xs font-semibold text-[#6D28D9]">
              {(dashboard.recentOrders || []).length} orders
            </span>
          </div>

          {!dashboard.recentOrders?.length ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0E7FC] text-[#6D28D9]">
                <FiShoppingBag size={25} />
              </span>
              <h3 className="mt-4 font-semibold text-[#352047]">
                No orders found
              </h3>
              <p className="mt-1 text-sm text-[#897A98]">
                Recent seller orders will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3 p-4 sm:p-5">
              {dashboard.recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="rounded-xl border border-[#EEE7F5] p-4 transition hover:border-[#D7C2F3] hover:bg-[#FCFAFF]"
                >
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0E7FC] text-[#6D28D9]">
                        <FiShoppingBag size={18} />
                      </span>

                      <div className="min-w-0">
                        <p className="font-bold text-[#352047]">
                          Order #{String(order._id).slice(-6).toUpperCase()}
                        </p>

                        <p className="mt-1 truncate text-sm text-[#796B87]">
                          Customer: {order.user?.name || "N/A"}
                        </p>

                        <p className="mt-1 flex items-center gap-1.5 text-xs text-[#A092AF]">
                          <FiCalendar size={13} />
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 sm:flex-col sm:items-end">
                      <p className="text-lg font-bold text-[#5B21B6]">
                        {formatCurrency(order.totalPrice)}
                      </p>

                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getOrderStatusStyle(
                          order.status,
                        )}`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Latest Products */}
        <section className="overflow-hidden rounded-2xl border border-[#EAE3F2] bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-[#EEE7F5] px-5 py-5">
            <div>
              <h2 className="text-lg font-bold text-[#352047]">
                Latest Products
              </h2>
              <p className="mt-1 text-sm text-[#897A98]">
                Recently added products
              </p>
            </div>

            <span className="rounded-full bg-[#F2EAFE] px-3 py-1.5 text-xs font-semibold text-[#6D28D9]">
              {(dashboard.latestProducts || []).length} products
            </span>
          </div>

          {!dashboard.latestProducts?.length ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0E7FC] text-[#6D28D9]">
                <FiPackage size={25} />
              </span>
              <h3 className="mt-4 font-semibold text-[#352047]">
                No products found
              </h3>
              <p className="mt-1 text-sm text-[#897A98]">
                Products added by this seller will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3 p-4 sm:p-5">
              {dashboard.latestProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center gap-4 rounded-xl border border-[#EEE7F5] p-3 transition hover:border-[#D7C2F3] hover:bg-[#FCFAFF]"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#EEE7F5] bg-[#FAF8FC]">
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

                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-sm font-bold text-[#352047]">
                      {product.title || "Untitled Product"}
                    </h3>

                    <p className="mt-1 font-bold text-[#6D28D9]">
                      {formatCurrency(product.sellingPrice)}
                    </p>

                    <p className="mt-1 text-xs text-[#897A98]">
                      Stock: {product.stockQuantity ?? 0}
                    </p>
                  </div>

                  <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F0E7FC] text-[#6D28D9] sm:flex">
                    <FiPackage size={17} />
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Seller Information */}
      <section className="mt-6 overflow-hidden rounded-2xl border border-[#E5D6F8] bg-white shadow-sm">
        <div className="border-b border-[#EEE7F5] bg-gradient-to-r from-[#F2E8FF] to-white px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6D28D9] text-white">
              <FiUser size={21} />
            </span>

            <div>
              <h2 className="text-lg font-bold text-[#352047]">
                Seller Information
              </h2>
              <p className="mt-1 text-sm text-[#897A98]">
                Contact details and account status
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6">
          <div className="flex items-start gap-3 rounded-xl border border-[#EEE7F5] p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0E7FC] text-[#6D28D9]">
              <FiUser size={18} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#897A98]">Seller Name</p>
              <p className="mt-1 break-words font-semibold text-[#352047]">
                {seller.name || "Not Available"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-[#EEE7F5] p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0E7FC] text-[#6D28D9]">
              <FiMail size={18} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#897A98]">
                Email Address
              </p>
              <p className="mt-1 break-all font-semibold text-[#352047]">
                {seller.email || "Not Available"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-[#EEE7F5] p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0E7FC] text-[#6D28D9]">
              <FiPhone size={18} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#897A98]">Phone Number</p>
              <p className="mt-1 break-words font-semibold text-[#352047]">
                {seller.phoneNumber || "Not Available"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-[#EEE7F5] p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0E7FC] text-[#6D28D9]">
              <FiShield size={18} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#897A98]">
                Seller Status
              </p>

              <span
                className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold capitalize ${getSellerStatusStyle(
                  seller.sellerStatus,
                )}`}
              >
                {seller.sellerStatus === "approved" ? (
                  <FiCheckCircle size={13} />
                ) : (
                  <FiClock size={13} />
                )}
                {seller.sellerStatus || "Unknown"}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminSellerDashboard;
