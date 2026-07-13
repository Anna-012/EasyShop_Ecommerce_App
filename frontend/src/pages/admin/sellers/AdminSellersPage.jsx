import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";

const AdminSellersPage = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const { data } = await API.get("/admin/get-all-sellers");
      setSellers(data.sellers);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch sellers");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/admin/seller-status/${id}`, {
        sellerStatus: status,
      });

      fetchSellers();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const filteredSellers = sellers.filter(
    (seller) =>
      seller.name.toLowerCase().includes(search.toLowerCase()) ||
      seller.email.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <h2 className="text-2xl font-semibold">Loading Sellers...</h2>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5">
          <div>
            <h1 className="text-4xl font-bold">Seller Management</h1>

            <p className="text-gray-500 mt-2">
              Manage all registered sellers from one place.
            </p>
          </div>

          <input
            type="text"
            placeholder="Search seller..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-xl px-5 py-3 w-full lg:w-80 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">Total Sellers</p>

          <h2 className="text-4xl font-bold mt-2">{sellers.length}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">Approved</p>

          <h2 className="text-4xl font-bold text-green-600 mt-2">
            {
              sellers.filter((seller) => seller.sellerStatus === "approved")
                .length
            }
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-gray-500">Pending / Rejected</p>

          <h2 className="text-4xl font-bold text-yellow-500 mt-2">
            {
              sellers.filter((seller) => seller.sellerStatus !== "approved")
                .length
            }
          </h2>
        </div>
      </div>

      {/* Seller Cards */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredSellers.map((seller) => (
          <div
            key={seller._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6"
          >
            {/* Top */}

            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
                  {seller.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h2 className="text-xl font-bold">{seller.name}</h2>

                  <p className="text-gray-500">{seller.email}</p>

                  <p className="text-gray-500">
                    📞 {seller.phoneNumber || "Not Provided"}
                  </p>
                </div>
              </div>

              {/* Status Dropdown */}

              <select
                value={seller.sellerStatus}
                onChange={(e) => updateStatus(seller._id, e.target.value)}
                className={`px-4 py-2 rounded-full text-sm font-semibold outline-none cursor-pointer
                ${
                  seller.sellerStatus === "approved"
                    ? "bg-green-100 text-green-700"
                    : seller.sellerStatus === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                }`}
              >
                <option value="approved">Approved</option>

                <option value="pending">Pending</option>

                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="border-t my-6"></div>

            {/* Buttons */}

            <div className="flex gap-4">
              <button
                onClick={() =>
                  navigate(`/admin/seller/${seller._id}/dashboard`)
                }
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-3 font-medium transition"
              >
                Dashboard
              </button>

              <button
                onClick={() => navigate(`/admin/seller/${seller._id}/products`)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-medium transition"
              >
                Products
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSellersPage;
