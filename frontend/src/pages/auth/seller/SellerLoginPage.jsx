import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../../services/api";
import { AuthContext } from "../../../context/AuthContext";
import {
  FiShoppingBag,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiAlertCircle,
} from "react-icons/fi";

const SellerLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const { data } = await API.post("/auth/login", {
        email,
        password,
      });

      if (!data.isVerified) {
        navigate("/verify-otp", { state: { email } });
        return;
      }

      if (data.user.role !== "seller") {
        setErrorMessage("This account is not registered as a seller.");
        return;
      }

      login(data);
      navigate("/seller/dashboard");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF9FF] px-4 py-4 sm:px-6">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-xl shadow-purple-100/50 md:grid-cols-[0.8fr_1.2fr]">
        {/* Compact welcome panel */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#4C1D95] via-[#6D28D9] to-[#7C3AED] p-6 text-white md:flex lg:p-7">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-white/10" />
          <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full border border-white/10" />

          <div className="relative z-10">
            <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
              <FiShoppingBag size={24} />
            </div>

            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-purple-200">
              BIRD Seller Portal
            </p>

            <h1 className="text-3xl font-bold leading-tight">
              Your store.
              <span className="mt-1 block text-purple-200">Your success.</span>
            </h1>

            <p className="mt-4 text-sm leading-6 text-purple-100">
              Manage products, track customer orders and grow your business with
              BIRD.
            </p>

            <div className="mt-6 rounded-xl border border-white/15 bg-white/10 p-3.5">
              <p className="text-sm font-semibold">Everything in one place</p>
              <p className="mt-1 text-xs leading-5 text-purple-100">
                Your seller dashboard keeps your store operations organized.
              </p>
            </div>
          </div>

          <p className="relative z-10 mt-6 text-xs text-purple-200">
            BIRD — Shop Something Awesome.
          </p>
        </section>

        {/* Seller login form */}
        <section className="flex items-center justify-center p-5 sm:p-7 lg:p-8">
          <div className="w-full max-w-md">
            <div className="mb-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDE9FE] text-[#6D28D9] md:hidden">
                <FiShoppingBag size={22} />
              </div>

              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-[#6D28D9]">
                Seller Account
              </p>

              <h2 className="text-2xl font-bold tracking-tight text-[#4C1D95] sm:text-3xl">
                Welcome back
              </h2>

              <p className="mt-2 text-sm leading-5 text-gray-500">
                Sign in to continue to your seller dashboard.
              </p>
            </div>

            {/* Demo credentials */}
            <div className="mb-4 rounded-xl border border-purple-100 bg-[#FAF9FF] px-3.5 py-3">
              <p className="mb-1.5 text-sm font-semibold text-[#4C1D95]">
                Demo Seller Account
              </p>

              <p className="break-all text-sm text-gray-600">
                <span className="font-medium text-gray-800">Email:</span>{" "}
                afreenshabbagh@gmail.com
              </p>

              <p className="mt-1 text-sm text-gray-600">
                <span className="font-medium text-gray-800">Password:</span>{" "}
                123456
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label
                  htmlFor="seller-email"
                  className="mb-1.5 block text-sm font-semibold text-gray-700"
                >
                  Email address
                </label>

                <div className="relative">
                  <FiMail
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="seller-email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#6D28D9] focus:ring-4 focus:ring-purple-100 disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="seller-password"
                  className="mb-1.5 block text-sm font-semibold text-gray-700"
                >
                  Password
                </label>

                <div className="relative">
                  <FiLock
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="seller-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-11 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#6D28D9] focus:ring-4 focus:ring-purple-100 disabled:bg-gray-50"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 transition hover:bg-purple-50 hover:text-[#6D28D9]"
                  >
                    {showPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-[#6D28D9] transition hover:text-[#4C1D95] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {errorMessage && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm leading-5 text-red-600"
                >
                  <FiAlertCircle size={18} className="mt-0.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] px-4 py-3 font-semibold text-white shadow-md shadow-purple-200/60 transition hover:from-[#4C1D95] hover:to-[#6D28D9] focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Login to Seller Portal"}
                {!loading && <FiArrowRight size={18} />}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-500">
              Don't have a seller account?{" "}
              <Link
                to="/seller/register"
                className="font-semibold text-[#6D28D9] transition hover:text-[#4C1D95] hover:underline"
              >
                Register as Seller
              </Link>
            </p>

            <div className="mt-4 border-t border-purple-100 pt-3 text-center">
              <Link
                to="/"
                className="text-sm font-medium text-gray-500 transition hover:text-[#6D28D9]"
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

export default SellerLoginPage;
