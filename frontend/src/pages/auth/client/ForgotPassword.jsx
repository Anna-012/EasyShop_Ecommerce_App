import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../../services/api";
import {
  FiMail,
  FiArrowRight,
  FiShoppingBag,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setErrorMessage("");
    setLoading(true);

    try {
      const { data } = await API.post("/auth/forgot-password", {
        email,
      });

      setMessage(
        data.message ||
          "If your account exists, password reset instructions will be sent to your email.",
      );
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Unable to send reset instructions. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF9FF] px-4 py-6 sm:px-6">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-xl shadow-purple-100/50 md:grid-cols-2">
        {/* Left welcome panel */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#4C1D95] via-[#6D28D9] to-[#7C3AED] p-8 text-white md:flex lg:p-10">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/10" />
          <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full border border-white/10" />

          <div className="relative z-10">
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
              <FiShoppingBag size={25} />
            </div>

            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-purple-200">
              Account Recovery
            </p>

            <h1 className="text-3xl font-bold leading-tight lg:text-4xl">
              A fresh start
              <span className="mt-1 block text-purple-200">begins here.</span>
            </h1>

            <p className="mt-4 max-w-sm text-sm leading-6 text-purple-100">
              Forgot your password? Don't worry. Follow a few simple steps to
              get back to your BIRD account.
            </p>
          </div>

          <p className="relative z-10 mt-6 text-xs text-purple-200">
            We're here to help you get back to shopping.
          </p>
        </section>

        {/* Forgot password form */}
        <section className="flex items-center justify-center p-6 sm:p-8 lg:p-10">
          <div className="w-full max-w-md">
            <div className="mb-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#EDE9FE] text-[#6D28D9] md:hidden">
                <FiMail size={24} />
              </div>

              <p className="mb-2 text-xs font-semibold text-[#6D28D9]">
                PASSWORD RECOVERY
              </p>

              <h2 className="text-2xl font-bold tracking-tight text-[#4C1D95] sm:text-3xl">
                Forgot password?
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Enter the email address associated with your account. We'll help
                you reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="forgot-email"
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
                    id="forgot-email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#6D28D9] focus:ring-4 focus:ring-purple-100"
                  />
                </div>
              </div>

              {/* Success message */}
              {message && (
                <div
                  role="status"
                  className="flex items-start gap-2.5 rounded-xl border border-green-100 bg-green-50 p-3.5 text-sm leading-5 text-green-700"
                >
                  <FiCheckCircle size={18} className="mt-0.5 shrink-0" />
                  <span>{message}</span>
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

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6D28D9] px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-[#4C1D95] focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending instructions..." : "Send Reset Link"}

                {!loading && <FiArrowRight size={18} />}
              </button>
            </form>

            <div className="mt-6 border-t border-purple-100 pt-5">
              <Link
                to="/login"
                className="block text-center text-sm font-semibold text-[#6D28D9] transition hover:text-[#4C1D95] hover:underline"
              >
                ← Back to Login
              </Link>

              <p className="mt-4 text-center text-xs text-gray-400">
                Need a new account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-[#6D28D9] hover:underline"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ForgotPassword;
