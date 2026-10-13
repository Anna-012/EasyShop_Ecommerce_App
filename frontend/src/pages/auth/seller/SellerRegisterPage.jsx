import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiShoppingBag,
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiMapPin,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiAlertCircle,
} from "react-icons/fi";
import API from "../../../services/api";

const SellerRegisterPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (error) setError("");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await API.post("/auth/seller/register", form);

      navigate("/verify-otp", {
        state: { email: form.email },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create your seller account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100";

  const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF9FF] p-3 sm:p-5">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-lg md:grid-cols-[0.78fr_1.22fr]">
        {/* Compact purple panel */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#4C1D95] to-[#7C3AED] p-7 text-white md:flex">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-20 -left-16 h-48 w-48 rounded-full border border-white/10" />

          <div className="relative">
            <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
              <FiShoppingBag size={23} />
            </div>

            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple-200">
              BIRD Seller Portal
            </p>

            <h1 className="text-3xl font-bold leading-tight">
              Start your
              <br />
              selling journey.
            </h1>

            <p className="mt-4 max-w-xs text-sm leading-6 text-purple-100">
              Create your seller account and manage your business with BIRD.
            </p>
          </div>

          <p className="relative mt-8 text-xs text-purple-200">
            BIRD — Shop Something Awesome.
          </p>
        </section>

        {/* Registration form */}
        <section className="flex items-center justify-center p-4 sm:p-6 md:p-7">
          <div className="w-full max-w-md">
            <div className="mb-5">
              <div className="mb-1.5 flex items-center gap-2 md:hidden">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                  <FiShoppingBag size={17} />
                </span>
                <span className="text-xs font-bold tracking-wider text-purple-700">
                  BIRD SELLER PORTAL
                </span>
              </div>

              <p className="text-xs font-semibold uppercase tracking-wider text-purple-600">
                Seller Registration
              </p>

              <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#4C1D95] sm:text-3xl">
                Become a Seller
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Enter your details to create your account.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-4 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700"
              >
                <FiAlertCircle className="mt-0.5 shrink-0" size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={submitHandler} className="space-y-3.5">
              {/* Full name */}
              <div>
                <label htmlFor="name" className={labelClass}>
                  Full name
                </label>

                <div className="relative">
                  <FiUser
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={17}
                  />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              {/* Email and phone */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email address
                  </label>

                  <div className="relative">
                    <FiMail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={17}
                    />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Enter email"
                      value={form.email}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phoneNumber" className={labelClass}>
                    Phone number
                  </label>

                  <div className="relative">
                    <FiPhone
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={17}
                    />
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      autoComplete="tel"
                      placeholder="Phone number"
                      value={form.phoneNumber}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className={labelClass}>
                  Password
                </label>

                <div className="relative">
                  <FiLock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={17}
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    value={form.password}
                    onChange={handleChange}
                    className={`${inputClass} pr-11`}
                    minLength={6}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-purple-700"
                  >
                    {showPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>

                <p className="mt-1 text-xs text-gray-400">
                  Use at least 6 characters.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-[#5B21B6] hover:to-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Register as Seller"}
                {!loading && <FiArrowRight size={18} />}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-500">
              Already have a seller account?{" "}
              <Link
                to="/seller/login"
                className="font-semibold text-purple-700 hover:text-purple-900"
              >
                Seller Login
              </Link>
            </p>

            <div className="mt-4 border-t border-purple-100 pt-3 text-center">
              <Link
                to="/"
                className="text-sm text-gray-500 transition hover:text-purple-700"
              >
                ← Back to BIRD
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default SellerRegisterPage;
