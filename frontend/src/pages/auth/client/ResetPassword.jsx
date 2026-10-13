import { useParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import API from "../../../services/api";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiShoppingBag,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setErrorMessage("");

    try {
      const { data } = await API.put(`/auth/reset-password/${token}`, {
        password,
      });

      setSuccess(
        data.message || "Your password has been updated successfully.",
      );
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
          "Failed to update your password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF9FF] px-4 py-6 sm:px-6">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-xl shadow-purple-100/50 md:grid-cols-2">
        {/* Welcome panel */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#4C1D95] via-[#6D28D9] to-[#7C3AED] p-8 text-white md:flex lg:p-10">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/10" />
          <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full border border-white/10" />

          <div className="relative z-10">
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
              <FiShoppingBag size={25} />
            </div>

            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-purple-200">
              Account Security
            </p>

            <h1 className="text-3xl font-bold leading-tight lg:text-4xl">
              A new password,
              <span className="mt-1 block text-purple-200">a fresh start.</span>
            </h1>

            <p className="mt-4 max-w-sm text-sm leading-6 text-purple-100">
              Choose a new password to secure your BIRD account and get back to
              shopping.
            </p>
          </div>

          <p className="relative z-10 mt-6 text-xs text-purple-200">
            Your account security matters to us.
          </p>
        </section>

        {/* Reset password form */}
        <section className="flex items-center justify-center p-6 sm:p-8 lg:p-10">
          <div className="w-full max-w-md">
            <div className="mb-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#EDE9FE] text-[#6D28D9] md:hidden">
                <FiLock size={24} />
              </div>

              <p className="mb-2 text-xs font-semibold text-[#6D28D9]">
                PASSWORD RECOVERY
              </p>

              <h2 className="text-2xl font-bold tracking-tight text-[#4C1D95] sm:text-3xl">
                Reset password
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Enter a new password for your account below.
              </p>
            </div>

            <form onSubmit={submitHandler} className="space-y-5">
              <div>
                <label
                  htmlFor="new-password"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  New password
                </label>

                <div className="relative">
                  <FiLock
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                    disabled={Boolean(success)}
                    className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#6D28D9] focus:ring-4 focus:ring-purple-100 disabled:bg-gray-50"
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

                <p className="mt-2 text-xs text-gray-400">
                  Use at least 6 characters.
                </p>
              </div>

              {/* Success message */}
              {success && (
                <div
                  role="status"
                  className="flex items-start gap-2.5 rounded-xl border border-green-100 bg-green-50 p-3.5 text-sm leading-5 text-green-700"
                >
                  <FiCheckCircle size={18} className="mt-0.5 shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              {/* Error message */}
              {errorMessage && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 p-3.5 text-sm leading-5 text-red-600"
                >
                  <FiAlertCircle size={18} className="mt-0.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || Boolean(success)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6D28D9] px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-[#4C1D95] focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Updating password..."
                  : success
                    ? "Password Updated"
                    : "Update Password"}

                {!loading && !success && <FiArrowRight size={18} />}
              </button>

              {success && (
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="w-full rounded-xl border border-purple-200 px-5 py-3 font-semibold text-[#6D28D9] transition hover:bg-purple-50"
                >
                  Continue to Login
                </button>
              )}
            </form>

            {!success && (
              <div className="mt-6 border-t border-purple-100 pt-5">
                <Link
                  to="/login"
                  className="block text-center text-sm font-semibold text-[#6D28D9] transition hover:text-[#4C1D95] hover:underline"
                >
                  ← Back to Login
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default ResetPassword;
