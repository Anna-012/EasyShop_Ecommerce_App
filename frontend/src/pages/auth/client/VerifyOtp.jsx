import { useState, useContext } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import API from "../../../services/api";
import { AuthContext } from "../../../context/AuthContext";
import {
  FiShield,
  FiMail,
  FiArrowRight,
  FiCheckCircle,
  FiAlertCircle,
  FiShoppingBag,
} from "react-icons/fi";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const email = location.state?.email;

  const submitHandler = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!email) {
      setErrorMessage(
        "Email address is missing. Please register or request OTP again.",
      );
      return;
    }

    if (!otp.trim()) {
      setErrorMessage("Please enter the OTP sent to your email.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await API.post("/auth/verify-otp", {
        email,
        otp: otp.trim(),
      });

      login(data);
      setSuccessMessage("OTP verified successfully!");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "OTP verification failed. Please try again.",
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
              Account Verification
            </p>

            <h1 className="text-3xl font-bold leading-tight lg:text-4xl">
              One quick step,
              <span className="mt-1 block text-purple-200">
                then you're in.
              </span>
            </h1>

            <p className="mt-4 max-w-sm text-sm leading-6 text-purple-100">
              Verify your email to secure your BIRD account and get started with
              your shopping experience.
            </p>

            <div className="mt-8 flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-4">
              <FiShield className="shrink-0 text-purple-200" size={22} />
              <p className="text-sm leading-5 text-purple-100">
                Your account security matters to us.
              </p>
            </div>
          </div>

          <p className="relative z-10 mt-6 text-xs text-purple-200">
            Welcome to BIRD — Shop Something Awesome.
          </p>
        </section>

        {/* OTP form */}
        <section className="flex items-center justify-center p-6 sm:p-8 lg:p-10">
          <div className="w-full max-w-md">
            <div className="mb-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#EDE9FE] text-[#6D28D9] md:hidden">
                <FiShield size={24} />
              </div>

              <p className="mb-2 text-xs font-semibold text-[#6D28D9]">
                EMAIL VERIFICATION
              </p>

              <h2 className="text-2xl font-bold tracking-tight text-[#4C1D95] sm:text-3xl">
                Verify your OTP
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Enter the verification code sent to your email address.
              </p>
            </div>

            {email && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-purple-100 bg-[#FAF9FF] p-3.5">
                <FiMail className="mt-0.5 shrink-0 text-[#6D28D9]" size={18} />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Code sent to</p>
                  <p className="break-all text-sm font-semibold text-gray-800">
                    {email}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={submitHandler} className="space-y-5">
              <div>
                <label
                  htmlFor="otp"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  One-time password
                </label>

                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={7}
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\s/g, ""));
                    setErrorMessage("");
                  }}
                  required
                  disabled={loading || Boolean(successMessage)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-center text-lg font-semibold tracking-[0.35em] text-gray-900 outline-none transition placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-400 focus:border-[#6D28D9] focus:ring-4 focus:ring-purple-100 disabled:bg-gray-50"
                />

                <p className="mt-2 text-xs text-gray-400">
                  Check your inbox for the verification code.
                </p>
              </div>

              {errorMessage && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-xl border border-red-100 bg-red-50 p-3.5 text-sm leading-5 text-red-600"
                >
                  <FiAlertCircle size={18} className="mt-0.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div
                  role="status"
                  className="flex items-start gap-2.5 rounded-xl border border-green-100 bg-green-50 p-3.5 text-sm leading-5 text-green-700"
                >
                  <FiCheckCircle size={18} className="mt-0.5 shrink-0" />
                  <span>{successMessage} Redirecting...</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || Boolean(successMessage)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6D28D9] px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-[#4C1D95] focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Verifying OTP..."
                  : successMessage
                    ? "Verified Successfully"
                    : "Verify OTP"}

                {!loading && !successMessage && <FiArrowRight size={18} />}
              </button>
            </form>

            <div className="mt-6 border-t border-purple-100 pt-5">
              <Link
                to="/register"
                className="block text-center text-sm font-semibold text-[#6D28D9] transition hover:text-[#4C1D95] hover:underline"
              >
                ← Back to Register
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default VerifyOtp;
