import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiPackage,
  FiShoppingBag,
  FiRefreshCw,
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiMapPin,
  FiCreditCard,
  FiCalendar,
  FiHash,
  FiImage,
  FiSave,
} from "react-icons/fi";
import API from "../../../services/api";

const AdminOrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const { data } = await API.get(`/orders/${id}`);

        setOrder(data);
        setStatus(data.status || "Placed");
      } catch (error) {
        console.error(error.response?.data || error.message);
        setErrorMessage(
          error.response?.data?.message || "Failed to load order details.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!status || status === order?.status) return;

    try {
      setUpdating(true);
      setErrorMessage("");

      const { data } = await API.patch(`/orders/${id}/status`, {
        status,
      });

      setOrder(data);
      setStatus(data.status || status);
    } catch (error) {
      console.error(error.response?.data || error.message);
      setErrorMessage(
        error.response?.data?.message || "Failed to update order status.",
      );
    } finally {
      setUpdating(false);
    }
  };

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

  const getStatusStyle = (value) => {
    switch (value) {
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

  const orderItems = order?.orderItems || [];

  const itemsTotal = orderItems.reduce(
    (sum, item) => sum + Number(item.qty || 0) * Number(item.price || 0),
    0,
  );

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#F8F7FA] p-4 sm:p-6 lg:p-8">
        <div className="mb-6 h-32 animate-pulse rounded-2xl bg-[#EDE5F7]" />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <div className="h-96 animate-pulse rounded-2xl border border-[#EAE3F2] bg-white" />
          <div className="h-72 animate-pulse rounded-2xl border border-[#EAE3F2] bg-white" />
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-[#6D28D9]">
          <FiRefreshCw size={17} className="animate-spin" />
          Loading Order Details...
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#F8F7FA] px-5 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0E7FC] text-[#6D28D9]">
          <FiPackage size={29} />
        </span>

        <h2 className="mt-4 text-xl font-bold text-[#352047]">
          Unable to load order
        </h2>

        <p className="mt-2 max-w-md text-sm text-[#897A98]">
          {errorMessage || "This order could not be found."}
        </p>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#6D28D9] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5B21B6]"
        >
          <FiArrowLeft size={17} />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7FA] p-4 sm:p-6 lg:p-8">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-5 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[#6D28D9] transition hover:bg-[#F0E7FC]"
      >
        <FiArrowLeft size={17} />
        Back
      </button>

      {/* Order Header */}
      <section className="mb-6 overflow-hidden rounded-2xl border border-[#E5D6F8] bg-white shadow-sm">
        <div className="h-2 bg-gradient-to-r from-[#4C1D95] via-[#6D28D9] to-[#A78BFA]" />

        <div className="flex flex-col justify-between gap-5 p-5 sm:flex-row sm:items-center sm:p-7">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#7952A5]">
              BIRD Management
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-[#352047] sm:text-3xl">
              Order Details
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-lg bg-[#F2EAFE] px-3 py-2 text-sm font-bold text-[#5B21B6]">
                <FiHash size={16} />
                {String(order._id || id)
                  .slice(-8)
                  .toUpperCase()}
              </span>

              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${getStatusStyle(
                  order.status,
                )}`}
              >
                <span className="h-2 w-2 rounded-full bg-current" />
                {order.status || "Placed"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-[#E5D6F8] bg-[#FAF6FF] p-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6D28D9] text-white">
              <FiCalendar size={21} />
            </span>

            <div>
              <p className="text-xs text-[#897A98]">Order Date</p>
              <p className="mt-1 font-bold text-[#352047]">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Error Message */}
      {errorMessage && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700"
        >
          {errorMessage}
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* Ordered Products */}
        <section className="overflow-hidden rounded-2xl border border-[#EAE3F2] bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-[#EEE7F5] px-5 py-5 sm:px-6">
            <div>
              <h2 className="text-lg font-bold text-[#352047]">
                Ordered Products
              </h2>

              <p className="mt-1 text-sm text-[#897A98]">
                Items included in this order
              </p>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full bg-[#F0E7FC] px-3 py-2 text-xs font-semibold text-[#6D28D9]">
              <FiShoppingBag size={14} />
              {orderItems.length} items
            </span>
          </div>

          {orderItems.length === 0 ? (
            <div className="flex min-h-56 flex-col items-center justify-center px-6 text-center">
              <FiPackage size={30} className="text-[#B9A4D2]" />
              <p className="mt-3 font-semibold text-[#352047]">
                No order items found
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#F0EAF5]">
              {orderItems.map((item, index) => {
                const productName =
                  item.product?.name || item.product?.title || "Product";

                const productImage = item.product?.image;

                return (
                  <div
                    key={item._id || `${item.product?._id || "item"}-${index}`}
                    className="flex flex-col gap-4 p-5 transition hover:bg-[#FCFAFF] sm:flex-row sm:items-center sm:justify-between sm:p-6"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#EEE7F5] bg-[#FAF8FC]">
                        {productImage ? (
                          <img
                            src={productImage}
                            alt={productName}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <FiImage size={27} className="text-[#B9A4D2]" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="break-words font-bold text-[#352047]">
                          {productName}
                        </h3>

                        <p className="mt-2 text-sm text-[#796B87]">
                          Quantity:{" "}
                          <span className="font-semibold text-[#554064]">
                            {item.qty}
                          </span>
                        </p>

                        <p className="mt-1 text-sm text-[#796B87]">
                          Unit Price:{" "}
                          <span className="font-semibold text-[#554064]">
                            {formatCurrency(item.price)}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-dashed border-[#E5D6F8] pt-3 sm:border-0 sm:pt-0 sm:text-right">
                      <p className="text-xs font-medium text-[#897A98]">
                        Subtotal
                      </p>

                      <p className="mt-1 text-lg font-bold text-[#5B21B6]">
                        {formatCurrency(
                          Number(item.qty || 0) * Number(item.price || 0),
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Products Total */}
          <div className="border-t border-[#EEE7F5] bg-[#FCFAFE] px-5 py-4 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-[#796B87]">
                Items subtotal
              </span>
              <span className="font-bold text-[#352047]">
                {formatCurrency(itemsTotal)}
              </span>
            </div>
          </div>
        </section>

        {/* Order Summary & Status */}
        <aside className="space-y-5">
          {/* Order Summary */}
          <section className="overflow-hidden rounded-2xl border border-[#E5D6F8] bg-white shadow-sm">
            <div className="bg-gradient-to-br from-[#6D28D9] to-[#4C1D95] p-5 text-white">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                  <FiCreditCard size={22} />
                </span>

                <div>
                  <p className="text-sm font-medium text-purple-100">
                    Order Summary
                  </p>
                  <h2 className="mt-1 text-2xl font-bold">
                    {formatCurrency(order.totalPrice ?? itemsTotal)}
                  </h2>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-[#897A98]">Products</span>
                <span className="font-semibold text-[#352047]">
                  {orderItems.length}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-[#897A98]">Items subtotal</span>
                <span className="font-semibold text-[#352047]">
                  {formatCurrency(itemsTotal)}
                </span>
              </div>

              {order.totalPrice != null && (
                <div className="border-t border-dashed border-[#E5D6F8] pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-[#352047]">
                      Order Total
                    </span>
                    <span className="text-xl font-bold text-[#6D28D9]">
                      {formatCurrency(order.totalPrice)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Update Status */}
          <section className="rounded-2xl border border-[#E5D6F8] bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0E7FC] text-[#6D28D9]">
                <FiTruck size={21} />
              </span>

              <div>
                <h2 className="font-bold text-[#352047]">Order Status</h2>
                <p className="mt-1 text-xs text-[#897A98]">
                  Update order progress
                </p>
              </div>
            </div>

            <label
              htmlFor="order-status"
              className="mb-2 block text-sm font-semibold text-[#49365E]"
            >
              Select Status
            </label>

            <select
              id="order-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-[#E5D6F8] bg-[#FCFAFF] px-4 py-3 text-sm font-medium text-[#49365E] outline-none transition focus:border-[#8B5CF6] focus:bg-white focus:ring-4 focus:ring-[#7C3AED]/10"
            >
              <option value="Placed">Placed</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <button
              type="button"
              onClick={handleStatusUpdate}
              disabled={updating || status === order.status || !status}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#6D28D9] px-4 py-3 text-sm font-bold text-white shadow-md shadow-purple-900/15 transition hover:bg-[#5B21B6] focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/15 disabled:cursor-not-allowed disabled:bg-[#D8C9EA] disabled:text-[#796B87] disabled:shadow-none"
            >
              {updating ? (
                <FiRefreshCw size={17} className="animate-spin" />
              ) : (
                <FiSave size={17} />
              )}

              {updating ? "Updating Status..." : "Update Status"}
            </button>

            {status === order.status && (
              <p className="mt-3 text-center text-xs text-[#897A98]">
                Current status is already selected.
              </p>
            )}
          </section>

          {/* Delivery Info */}
          <section className="rounded-2xl border border-[#EAE3F2] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0E7FC] text-[#6D28D9]">
                <FiMapPin size={20} />
              </span>

              <div>
                <h2 className="font-bold text-[#352047]">
                  Delivery Information
                </h2>
                <p className="mt-1 text-xs text-[#897A98]">Shipping details</p>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm text-[#796B87]">
              <p className="font-semibold text-[#49365E]">
                {order.shippingAddress?.fullName ||
                  order.user?.name ||
                  "Customer"}
              </p>

              {order.shippingAddress?.phoneNumber && (
                <p>{order.shippingAddress.phoneNumber}</p>
              )}

              {order.shippingAddress && (
                <p className="leading-6">
                  {[
                    order.shippingAddress.houseNo,
                    order.shippingAddress.area,
                    order.shippingAddress.landmark,
                    order.shippingAddress.city,
                    order.shippingAddress.state,
                    order.shippingAddress.pincode,
                  ]
                    .filter(Boolean)
                    .join(", ") || "Address details unavailable"}
                </p>
              )}

              {!order.shippingAddress && (
                <p className="text-xs text-[#A092AF]">
                  Shipping address is not available in this order response.
                </p>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default AdminOrderDetailsPage;
