import { useEffect, useState } from "react";
import API from "../../../services/api";
import SellerLayout from "../../../components/seller/SellerLayout";
import toast from "react-hot-toast";

const SellerProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    role: "",
    address: {
      houseNo: "",
      area: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await API.get("/seller/seller-profile");

      setProfile({
        name: response.data.seller.name || "",
        email: response.data.seller.email || "",
        phoneNumber: response.data.seller.phoneNumber || "",
        role: response.data.seller.role || "",
        address: {
          houseNo: response.data.seller.address?.houseNo || "",
          area: response.data.seller.address?.area || "",
          landmark: response.data.seller.address?.landmark || "",
          city: response.data.seller.address?.city || "",
          state: response.data.seller.address?.state || "",
          pincode: response.data.seller.address?.pincode || "",
        },
      });
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to fetch profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      ["houseNo", "area", "landmark", "city", "state", "pincode"].includes(name)
    ) {
      setProfile((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else {
      setProfile((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await API.put("/seller/seller-profile", {
        name: profile.name,
        phoneNumber: profile.phoneNumber,
        address: profile.address,
      });

      setProfile(response.data.seller);

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SellerLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Seller Profile</h1>

          <p className="text-gray-500 mt-2">
            Manage your seller account information
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-6 border-b pb-8 mb-8">
            <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-3xl font-bold">
              {profile.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-2xl font-semibold">{profile.name}</h2>

              <p className="text-gray-500">{profile.email}</p>

              <span className="inline-block mt-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                {profile.role}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block font-medium mb-2">Full Name</label>

              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter your name"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block font-medium mb-2">Phone Number</label>

              <input
                type="text"
                name="phoneNumber"
                value={profile.phoneNumber}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter phone number"
              />
            </div>

            {/* Email */}
            <div className="col-span-2">
              <label className="block font-medium mb-2">Email Address</label>

              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full border rounded-lg px-4 py-3 bg-gray-100 cursor-not-allowed"
              />

              <p className="text-sm text-gray-500 mt-1">
                Email cannot be changed.
              </p>
            </div>

            {/* Address Heading */}
            <div className="col-span-2 mt-2">
              <h3 className="text-xl font-semibold border-b pb-2">Address</h3>
            </div>

            {/* House No */}
            <div>
              <label className="block font-medium mb-2">House No</label>

              <input
                type="text"
                name="houseNo"
                value={profile.address.houseNo}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                placeholder="House No"
              />
            </div>

            {/* Area */}
            <div>
              <label className="block font-medium mb-2">Area</label>

              <input
                type="text"
                name="area"
                value={profile.address.area}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                placeholder="Area"
              />
            </div>

            {/* Landmark */}
            <div>
              <label className="block font-medium mb-2">Landmark</label>

              <input
                type="text"
                name="landmark"
                value={profile.address.landmark}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                placeholder="Landmark"
              />
            </div>

            {/* City */}
            <div>
              <label className="block font-medium mb-2">City</label>

              <input
                type="text"
                name="city"
                value={profile.address.city}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                placeholder="City"
              />
            </div>

            {/* State */}
            <div>
              <label className="block font-medium mb-2">State</label>

              <input
                type="text"
                name="state"
                value={profile.address.state}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                placeholder="State"
              />
            </div>

            {/* Pincode */}
            <div>
              <label className="block font-medium mb-2">Pincode</label>

              <input
                type="text"
                name="pincode"
                value={profile.address.pincode}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                placeholder="Pincode"
              />
            </div>

            {/* Button */}
            <div className="col-span-2 pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg text-white font-semibold transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800"
                }`}
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </SellerLayout>
  );
};

export default SellerProfilePage;
