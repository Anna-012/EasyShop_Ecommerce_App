import { useEffect, useState } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiHome,
  FiMap,
  FiNavigation,
  FiHash,
  FiSave,
  FiRefreshCw,
  FiShield,
} from "react-icons/fi";
import API from "../../../services/api";
import SellerLayout from "../../../components/seller/SellerLayout";
import toast from "react-hot-toast";

const initialProfile = {
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
};

const inputClass =
  "w-full rounded-xl border border-[#EAE5EF] bg-white px-4 py-3 text-sm text-[#352047] placeholder:text-[#A49AAF] outline-none transition focus:border-[#8B6BB0] focus:ring-4 focus:ring-[#5B3488]/10";

const labelClass = "mb-2 block text-sm font-medium text-[#493957]";

const SellerProfilePage = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    setFetchError(false);

    try {
      const response = await API.get("/seller/seller-profile");
      const seller = response.data.seller;

      setProfile({
        name: seller.name || "",
        email: seller.email || "",
        phoneNumber: seller.phoneNumber || "",
        role: seller.role || "",
        address: {
          houseNo: seller.address?.houseNo || "",
          area: seller.address?.area || "",
          landmark: seller.address?.landmark || "",
          city: seller.address?.city || "",
          state: seller.address?.state || "",
          pincode: seller.address?.pincode || "",
        },
      });
    } catch (error) {
      console.error(error);
      setFetchError(true);
      toast.error(error.response?.data?.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const addressFields = [
      "houseNo",
      "area",
      "landmark",
      "city",
      "state",
      "pincode",
    ];

    if (addressFields.includes(name)) {
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

    if (!profile.name.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    setSaving(true);

    try {
      const response = await API.put("/seller/seller-profile", {
        name: profile.name.trim(),
        phoneNumber: profile.phoneNumber.trim(),
        address: profile.address,
      });

      const seller = response.data.seller;

      setProfile((prev) => ({
        ...prev,
        name: seller.name ?? prev.name,
        phoneNumber: seller.phoneNumber ?? prev.phoneNumber,
        address: {
          ...prev.address,
          ...(seller.address || {}),
        },
      }));

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const firstLetter = profile.name?.trim()?.charAt(0).toUpperCase() || "S";

  const roleLabel = profile.role
    ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
    : "Seller";

  const Field = ({
    label,
    name,
    value,
    placeholder,
    icon: Icon,
    type = "text",
  }) => (
    <div className="min-w-0">
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>

      <div className="relative">
        <Icon
          size={17}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9585A5]"
        />

        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`${inputClass} pl-10`}
        />
      </div>
    </div>
  );

  return (
    <SellerLayout>
      <div className="min-w-0 bg-[#F8F7FA] px-1 py-2 sm:px-2 sm:py-3">
        {/* Page Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#7B6590]">
              <FiUser size={14} />
              Account settings
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#241A31] sm:text-3xl">
              Seller Profile
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#82768D]">
              Manage your personal information and business address.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchProfile}
            disabled={loading}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-[#EAE5EF] bg-white px-4 py-2.5 text-sm font-medium text-[#5B3488] shadow-sm transition hover:border-[#D5C6E5] hover:bg-[#FDFBFF] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FiRefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh profile
          </button>
        </div>

        {fetchError && !loading ? (
          <div className="rounded-2xl border border-[#EAE5EF] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#F1EBF8] text-[#5B3488]">
              <FiUser size={22} />
            </div>

            <h2 className="text-lg font-semibold text-[#352047]">
              Unable to load your profile
            </h2>

            <p className="mt-2 text-sm text-[#82768D]">
              Please check your connection and try again.
            </p>

            <button
              type="button"
              onClick={fetchProfile}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#5B3488] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#49276F]"
            >
              <FiRefreshCw size={15} />
              Try again
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[#EAE5EF] bg-white shadow-[0_4px_24px_rgba(53,32,71,0.04)]">
            {/* Profile Banner */}
            <div className="border-b border-[#EEE8F3] bg-gradient-to-r from-[#F5F0FA] via-[#FBF9FD] to-white px-5 py-7 sm:px-8 sm:py-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-2xl border border-[#E4D8F0] bg-white text-3xl font-bold text-[#5B3488] shadow-sm">
                  {firstLetter}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#8B78A0]">
                    Your account
                  </p>

                  <h2 className="break-words text-xl font-bold text-[#352047] sm:text-2xl">
                    {profile.name || "Seller Name"}
                  </h2>

                  <p className="mt-1 break-all text-sm text-[#82768D]">
                    {profile.email || "Your email address"}
                  </p>

                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#E4D8F0] bg-white px-3 py-1 text-xs font-semibold text-[#5B3488]">
                    <FiShield size={13} />
                    {roleLabel}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start rounded-xl border border-[#EAE5EF] bg-white px-3 py-2 text-xs font-medium text-[#82768D] sm:self-center">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Seller account
                </div>
              </div>
            </div>

            {loading ? (
              <div className="space-y-6 p-5 sm:p-8">
                <div className="h-5 w-40 animate-pulse rounded bg-[#F0ECF4]" />
                <div className="grid gap-5 sm:grid-cols-2">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index}>
                      <div className="mb-2 h-4 w-24 animate-pulse rounded bg-[#F0ECF4]" />
                      <div className="h-12 animate-pulse rounded-xl bg-[#F7F4F9]" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Personal Information */}
                <section className="border-b border-[#EEE8F3] px-5 py-7 sm:px-8 sm:py-8">
                  <div className="mb-6 flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1EBF8] text-[#5B3488]">
                      <FiUser size={19} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-[#352047]">
                        Personal information
                      </h3>
                      <p className="mt-1 text-sm text-[#9589A0]">
                        Your basic account details.
                      </p>
                    </div>
                  </div>

                  <div className="grid min-w-0 gap-5 sm:grid-cols-2">
                    <Field
                      label="Full name"
                      name="name"
                      value={profile.name}
                      placeholder="Enter your full name"
                      icon={FiUser}
                    />

                    <Field
                      label="Phone number"
                      name="phoneNumber"
                      value={profile.phoneNumber}
                      placeholder="Enter phone number"
                      icon={FiPhone}
                      type="tel"
                    />

                    <div className="min-w-0 sm:col-span-2">
                      <label htmlFor="email" className={labelClass}>
                        Email address
                      </label>

                      <div className="relative">
                        <FiMail
                          size={17}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9585A5]"
                        />

                        <input
                          id="email"
                          type="email"
                          value={profile.email}
                          disabled
                          className={`${inputClass} cursor-not-allowed bg-[#F7F5F9] pl-10 text-[#968BA0]`}
                        />
                      </div>

                      <p className="mt-2 text-xs text-[#9589A0]">
                        Your registered email address cannot be changed here.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Address */}
                <section className="px-5 py-7 sm:px-8 sm:py-8">
                  <div className="mb-6 flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F1EBF8] text-[#5B3488]">
                      <FiMapPin size={19} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-[#352047]">
                        Business address
                      </h3>
                      <p className="mt-1 text-sm text-[#9589A0]">
                        Add the address associated with your seller account.
                      </p>
                    </div>
                  </div>

                  <div className="grid min-w-0 gap-5 sm:grid-cols-2">
                    <Field
                      label="House / Building"
                      name="houseNo"
                      value={profile.address.houseNo}
                      placeholder="House or building number"
                      icon={FiHome}
                    />

                    <Field
                      label="Area / Locality"
                      name="area"
                      value={profile.address.area}
                      placeholder="Enter area or locality"
                      icon={FiMap}
                    />

                    <Field
                      label="Landmark"
                      name="landmark"
                      value={profile.address.landmark}
                      placeholder="Nearby landmark (optional)"
                      icon={FiNavigation}
                    />

                    <Field
                      label="City"
                      name="city"
                      value={profile.address.city}
                      placeholder="Enter city"
                      icon={FiMapPin}
                    />

                    <Field
                      label="State"
                      name="state"
                      value={profile.address.state}
                      placeholder="Enter state"
                      icon={FiMap}
                    />

                    <Field
                      label="PIN code"
                      name="pincode"
                      value={profile.address.pincode}
                      placeholder="Enter PIN code"
                      icon={FiHash}
                      type="text"
                    />
                  </div>
                </section>

                {/* Form Actions */}
                <div className="flex flex-col-reverse gap-3 border-t border-[#EEE8F3] bg-[#FCFBFD] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                  <p className="text-xs leading-5 text-[#9589A0]">
                    Make sure your information is correct before saving.
                  </p>

                  <button
                    type="submit"
                    disabled={saving || loading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#5B3488] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#49276F] focus:outline-none focus:ring-4 focus:ring-[#5B3488]/15 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {saving ? (
                      <>
                        <FiRefreshCw size={16} className="animate-spin" />
                        Saving changes...
                      </>
                    ) : (
                      <>
                        <FiSave size={16} />
                        Save changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </SellerLayout>
  );
};

export default SellerProfilePage;
