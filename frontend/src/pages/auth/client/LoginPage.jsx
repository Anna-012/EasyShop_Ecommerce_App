import { useState, useContext } from "react";
import API from "../../../services/api";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiShoppingBag,
} from "react-icons/fi";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const { data } = await API.post("/auth/login", {
        email,
        password,
      });

      login(data);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to log in. Please check your email and password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-104px)] items-center justify-center bg-[#FAF9FF] px-4 py-10 sm:px-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-xl shadow-purple-100/50 md:grid-cols-2">
        {/* Left decorative panel */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#4C1D95] via-[#6D28D9] to-[#7C3AED] p-10 text-white md:flex lg:p-12">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full border border-white/10" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full border border-white/10" />

          <div className="relative z-10">
            <div className="mb-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
              <FiShoppingBag size={28} />
            </div>

            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-purple-200">
              Welcome to BIRD
            </p>

            <h1 className="text-4xl font-bold leading-tight lg:text-5xl">
              Shopping made
              <span className="mt-2 block text-purple-200">simple.</span>
            </h1>

            <p className="mt-5 max-w-sm leading-7 text-purple-100">
              Sign in to access your account, manage your orders, and continue
              discovering products you love.
            </p>
          </div>

          <p className="relative z-10 text-sm text-purple-200">
            Your shopping journey starts here.
          </p>
        </section>

        {/* Login form */}
        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#EDE9FE] text-[#6D28D9] md:hidden">
                <FiShoppingBag size={24} />
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-[#4C1D95]">
                Welcome back!
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Enter your details below to log in to your account.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="login-email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Email address
                </label>

                <div className="relative">
                  <FiMail
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#6D28D9] focus:ring-4 focus:ring-purple-100"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="login-password"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-[#6D28D9] transition hover:text-[#4C1D95] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <FiLock
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#6D28D9] focus:ring-4 focus:ring-purple-100"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-400 transition hover:bg-purple-50 hover:text-[#6D28D9]"
                  >
                    {showPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {errorMessage && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600"
                >
                  {errorMessage}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6D28D9] px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-[#4C1D95] focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Login to Your Account"}

                {!loading && <FiArrowRight size={18} />}
              </button>

              <p className="pt-2 text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-[#6D28D9] transition hover:text-[#4C1D95] hover:underline"
                >
                  Register
                </Link>
              </p>
            </form>

            <div className="mt-8 border-t border-purple-100 pt-5">
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

export default LoginPage;
