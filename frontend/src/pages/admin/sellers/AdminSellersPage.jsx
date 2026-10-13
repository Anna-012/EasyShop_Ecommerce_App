import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiSearch,
  FiRefreshCw,
  FiUserCheck,
  FiClock,
  FiArrowUpRight,
  FiPhone,
  FiMail,
  FiLayout,
  FiPackage,
  FiShield,
} from "react-icons/fi";
import API from "../../../services/api";

const AdminSellersPage = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingSellerId, setUpdatingSellerId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    setLoading(true);

    try {
      const { data } = await API.get("/admin/get-all-sellers");
      setSellers(data.sellers || []);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch sellers");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setUpdatingSellerId(id);

    try {
      await API.put(`/admin/seller-status/${id}`, {
        sellerStatus: status,
      });

      setSellers((prev) =>
        prev.map((seller) =>
          seller._id === id ? { ...seller, sellerStatus: status } : seller,
        ),
      );
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setUpdatingSellerId(null);
    }
  };

  const filteredSellers = sellers.filter((seller) => {
    const query = search.toLowerCase();

    return (
      (seller.name || "").toLowerCase().includes(query) ||
      (seller.email || "").toLowerCase().includes(query) ||
      (seller.phoneNumber || "").toLowerCase().includes(query)
    );
  });

  const approvedCount = sellers.filter(
    (seller) => seller.sellerStatus === "approved",
  ).length;

  const pendingRejectedCount = sellers.length - approvedCount;

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "rejected":
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-[#F2EAFE] text-[#6D28D9] border-[#E5D6F8]";
    }
  };

  const summaryCards = [
    {
      title: "Total Sellers",
      value: sellers.length,
      description: "All registered sellers",
      icon: FiUsers,
      iconStyle: "bg-[#F0E7FC] text-[#6D28D9]",
    },
    {
      title: "Approved Sellers",
      value: approvedCount,
      description: "Approved seller accounts",
      icon: FiUserCheck,
      iconStyle: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Pending / Rejected",
      value: pendingRejectedCount,
      description: "Accounts needing attention",
      icon: FiClock,
      iconStyle: "bg-amber-50 text-amber-600",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#F8F7FA] p-4 sm:p-6 lg:p-8">
        <div className="mb-6 h-32 animate-pulse rounded-2xl bg-[#EDE5F7]" />

        <div className="mb-7 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl border border-[#EAE3F2] bg-white"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-56 animate-pulse rounded-2xl border border-[#EAE3F2] bg-white"
            />
          ))}
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-[#6D28D9]">
          <FiRefreshCw className="animate-spin" size={17} />
          Loading Sellers...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7FA] p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <section className="mb-7 overflow-hidden rounded-2xl border border-[#E5D6F8] bg-white shadow-sm">
        <div className="h-2 bg-gradient-to-r from-[#4C1D95] via-[#6D28D9] to-[#A78BFA]" />

        <div className="flex flex-col justify-between gap-5 p-5 sm:p-7 lg:flex-row lg:items-center">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#7952A5]">
              BIRD Management
            </p>

            <h1 className="text-2xl font-bold tracking-tight text-[#352047] sm:text-3xl">
              Seller Management
            </h1>

            <p className="mt-2 text-sm text-[#796B87] sm:text-base">
              Manage and review all registered sellers in your store.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <label className="relative block min-w-0 flex-1 lg:w-80">
              <FiSearch
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B6AAF]"
              />

              <input
                type="text"
                placeholder="Search seller..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-[#E5D6F8] bg-[#FCFAFF] py-3 pl-11 pr-4 text-sm text-[#352047] outline-none transition placeholder:text-[#A092AF] focus:border-[#8B5CF6] focus:bg-white focus:ring-4 focus:ring-[#7C3AED]/10"
              />
            </label>

            <button
              type="button"
              onClick={fetchSellers}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E5D6F8] bg-white px-4 py-3 text-sm font-semibold text-[#5B21B6] transition hover:bg-[#F5EEFF]"
            >
              <FiRefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <div className="mb-7 grid grid-cols-1 gap-4 md:grid-cols-3">
        {summaryCards.map((card) => {
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

      {/* Sellers Section Header */}
      <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-bold text-[#352047]">
            Registered Sellers
          </h2>

          <p className="mt-1 text-sm text-[#897A98]">
            {filteredSellers.length} of {sellers.length} sellers
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#F0E7FC] px-3 py-2 text-xs font-semibold text-[#6D28D9]">
          <FiShield size={14} />
          Seller Accounts
        </span>
      </div>

      {/* Seller Cards */}
      {filteredSellers.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-[#EAE3F2] bg-white px-6 py-16 text-center shadow-sm">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0E7FC] text-[#6D28D9]">
            <FiUsers size={28} />
          </span>

          <h3 className="mt-4 text-lg font-bold text-[#352047]">
            {search ? "No matching sellers" : "No sellers found"}
          </h3>

          <p className="mt-2 text-sm text-[#897A98]">
            {search
              ? "Try searching with another name, email or phone number."
              : "Registered seller accounts will appear here."}
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
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {filteredSellers.map((seller) => (
            <article
              key={seller._id}
              className="group overflow-hidden rounded-2xl border border-[#EAE3F2] bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#D7C2F3] hover:shadow-lg hover:shadow-purple-900/5"
            >
              <div className="h-1.5 bg-gradient-to-r from-[#6D28D9] to-[#A78BFA]" />

              <div className="p-5 sm:p-6">
                {/* Seller Profile */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#4C1D95] text-xl font-bold text-white shadow-md shadow-purple-900/15">
                      {(seller.name || "S").trim().charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <h3 className="break-words text-lg font-bold text-[#352047]">
                        {seller.name || "Unnamed Seller"}
                      </h3>

                      <p className="mt-1 flex items-start gap-2 break-all text-sm text-[#796B87]">
                        <FiMail
                          size={15}
                          className="mt-0.5 shrink-0 text-[#8B6AAF]"
                        />
                        {seller.email || "No email provided"}
                      </p>

                      <p className="mt-2 flex items-center gap-2 text-sm text-[#796B87]">
                        <FiPhone
                          size={15}
                          className="shrink-0 text-[#8B6AAF]"
                        />
                        {seller.phoneNumber || "Not Provided"}
                      </p>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="shrink-0 sm:max-w-[145px]">
                    <label
                      htmlFor={`seller-status-${seller._id}`}
                      className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-[#897A98]"
                    >
                      Account Status
                    </label>

                    <select
                      id={`seller-status-${seller._id}`}
                      value={seller.sellerStatus || "pending"}
                      disabled={updatingSellerId === seller._id}
                      onChange={(e) => updateStatus(seller._id, e.target.value)}
                      className={`w-full cursor-pointer rounded-xl border px-3 py-2.5 text-xs font-bold capitalize outline-none transition focus:ring-4 focus:ring-[#7C3AED]/10 disabled:cursor-wait disabled:opacity-60 ${getStatusStyle(
                        seller.sellerStatus,
                      )}`}
                    >
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                    </select>

                    {updatingSellerId === seller._id && (
                      <p className="mt-1.5 text-[10px] text-[#6D28D9]">
                        Updating status...
                      </p>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="my-5 border-t border-[#EEE7F5]" />

                {/* Seller Actions */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/admin/seller/${seller._id}/dashboard`)
                    }
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#6D28D9] px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-purple-900/10 transition hover:bg-[#5B21B6] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/15"
                  >
                    <FiLayout size={17} />
                    Dashboard
                    <FiArrowUpRight size={15} className="ml-auto opacity-70" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/admin/seller/${seller._id}/products`)
                    }
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#DCC8F6] bg-[#F5EEFF] px-4 py-3 text-sm font-semibold text-[#5B21B6] transition hover:border-[#BFA0ED] hover:bg-[#EDE3FF] focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/10"
                  >
                    <FiPackage size={17} />
                    Products
                    <FiArrowUpRight size={15} className="ml-auto opacity-70" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSellersPage;
