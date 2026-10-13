import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiShoppingBag,
} from "react-icons/fi";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      await axios.post("/api/auth/register", form);

      navigate("/verify-otp", {
        state: {
          email: form.email,
        },
      });
    } catch (error) {
      console.error("Registration failed:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to create your account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF9FF] px-4 py-4 sm:px-6">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-xl shadow-purple-100/50 md:grid-cols-2">
        {/* Left welcome panel */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#4C1D95] via-[#6D28D9] to-[#7C3AED] p-8 text-white md:flex lg:p-9">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/10" />
          <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full border border-white/10" />

          <div className="relative z-10">
            <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
              <FiShoppingBag size={25} />
            </div>

            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-purple-200">
              Join BIRD
            </p>

            <h1 className="text-3xl font-bold leading-tight lg:text-4xl">
              Your next
              <span className="mt-1 block text-purple-200">favorite find.</span>
            </h1>

            <p className="mt-4 max-w-sm text-sm leading-6 text-purple-100">
              Create your account to explore products, keep track of your
              orders, and enjoy a smoother shopping experience.
            </p>
          </div>

          <p className="relative z-10 mt-6 text-xs text-purple-200">
            Simple shopping starts with BIRD.
          </p>
        </section>

        {/* Registration form */}
        <section className="flex items-center justify-center p-5 sm:p-7 lg:p-8">
          <div className="w-full max-w-md">
            <div className="mb-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDE9FE] text-[#6D28D9] md:hidden">
                <FiShoppingBag size={21} />
              </div>

              <p className="mb-1.5 text-xs font-semibold text-[#6D28D9]">
                CREATE YOUR ACCOUNT
              </p>

              <h2 className="text-2xl font-bold tracking-tight text-[#4C1D95] sm:text-3xl">
                Get started
              </h2>

              <p className="mt-2 text-sm leading-5 text-gray-500">
                Fill in your details to create your BIRD account.
              </p>
            </div>

            <form onSubmit={submitHandler} className="space-y-4">
              {/* Name */}
              <div>
                <label
                  htmlFor="register-name"
                  className="mb-1.5 block text-sm font-semibold text-gray-700"
                >
                  Full name
                </label>

                <div className="relative">
                  <FiUser
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="register-name"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#6D28D9] focus:ring-4 focus:ring-purple-100"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="register-email"
                  className="mb-1.5 block text-sm font-semibold text-gray-700"
                >
                  Email address
                </label>

                <div className="relative">
                  <FiMail
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="register-email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#6D28D9] focus:ring-4 focus:ring-purple-100"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="register-password"
                  className="mb-1.5 block text-sm font-semibold text-gray-700"
                >
                  Password
                </label>

                <div className="relative">
                  <FiLock
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#6D28D9] focus:ring-4 focus:ring-purple-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-400 transition hover:bg-purple-50 hover:text-[#6D28D9]"
                  >
                    {showPassword ? (
                      <FiEyeOff size={17} />
                    ) : (
                      <FiEye size={17} />
                    )}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {errorMessage && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5 text-sm leading-5 text-red-600"
                >
                  {errorMessage}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6D28D9] px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-[#4C1D95] focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create Account"}

                {!loading && <FiArrowRight size={18} />}
              </button>

              <p className="pt-1 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-[#6D28D9] transition hover:text-[#4C1D95] hover:underline"
                >
                  Login
                </Link>
              </p>
            </form>

            <div className="mt-5 border-t border-purple-100 pt-4">
              <Link
                to="/"
                className="block text-center text-sm font-medium text-gray-500 transition hover:text-[#6D28D9]"
              >
                ← Back to shopping
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Register;
