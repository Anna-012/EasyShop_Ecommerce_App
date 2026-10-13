import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiShield,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiAlertCircle,
  FiShoppingBag,
} from "react-icons/fi";
import API from "../../../services/api";
import { AuthContext } from "../../../context/AuthContext";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await API.post("/auth/login", {
        email,
        password,
      });

      if (!data.isVerified) {
        navigate("/verify-otp", {
          state: { email },
        });
        return;
      }

      if (data.user?.role !== "admin") {
        setError("Access denied. Only administrators can log in here.");
        return;
      }

      login(data);
      navigate("/admin/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF9FF] p-4">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-lg md:grid-cols-[0.85fr_1.15fr]">
        {/* Left purple panel */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#4C1D95] to-[#7C3AED] p-8 text-white md:flex">
          <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-20 -left-16 h-52 w-52 rounded-full border border-white/10" />

          <div className="relative">
            <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
              <FiShield size={25} />
            </div>

            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple-200">
              BIRD Administration
            </p>

            <h1 className="text-3xl font-bold leading-tight">
              Manage your
              <br />
              store with
              <br />
              confidence.
            </h1>

            <p className="mt-4 max-w-xs text-sm leading-6 text-purple-100">
              Access your dashboard to manage products, users, sellers, and
              orders from one place.
            </p>

            <div className="mt-7 flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15">
                <FiShoppingBag size={20} />
              </div>

              <div>
                <p className="text-sm font-semibold">BIRD Admin Portal</p>
                <p className="mt-0.5 text-xs text-purple-200">
                  Secure administrative access
                </p>
              </div>
            </div>
          </div>

          <p className="relative mt-8 text-xs text-purple-200">
            BIRD — Shop Something Awesome.
          </p>
        </section>

        {/* Login form */}
        <section className="flex items-center justify-center p-5 sm:p-8">
          <div className="w-full max-w-sm">
            <div className="mb-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-700 md:hidden">
                <FiShield size={23} />
              </div>

              <p className="text-xs font-semibold uppercase tracking-wider text-purple-600">
                Administrator Login
              </p>

              <h2 className="mt-1 text-3xl font-bold tracking-tight text-[#4C1D95]">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Sign in to access your admin dashboard.
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mb-5 rounded-xl border border-purple-100 bg-purple-50/70 p-4">
              <div className="mb-2 flex items-center gap-2">
                <FiShield className="text-purple-700" size={17} />
                <h3 className="text-sm font-semibold text-purple-900">
                  Demo Credentials
                </h3>
              </div>

              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium text-gray-800">Email:</span>{" "}
                  afreensabbagh01@gmail.com
                </p>
                <p>
                  <span className="font-medium text-gray-800">Password:</span>{" "}
                  123456
                </p>
              </div>

              <p className="mt-2 text-xs text-purple-600">
                Use these credentials to explore the admin dashboard.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-4 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700"
              >
                <FiAlertCircle className="mt-0.5 shrink-0" size={17} />
                <span>{error}</span>
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="admin-email"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>

                <div className="relative">
                  <FiMail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={17}
                  />

                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="username"
                    placeholder="Enter admin email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="admin-password"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Password
                </label>

                <div className="relative">
                  <FiLock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={17}
                  />

                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClass} pr-11`}
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
              </div>

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-purple-700 transition hover:text-purple-900"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-[#5B21B6] hover:to-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Login to Dashboard"}
                {!loading && <FiArrowRight size={18} />}
              </button>
            </form>
            <div className="mt-6 border-t border-purple-100 pt-4 text-center">
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

export default AdminLoginPage;
