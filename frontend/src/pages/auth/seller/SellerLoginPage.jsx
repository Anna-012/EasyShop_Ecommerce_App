import { useState, useContext } from "react";
import API from "../../../services/api";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

const SellerLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post("/auth/login", {
        email,
        password,
      });

      if (!data.isVerified) {
        alert("Please verify your email first.");

        navigate("/verify-otp", {
          state: {
            email,
          },
        });

        return;
      }

      if (data.user.role !== "seller") {
        alert("This account is not registered as a seller.");

        return;
      }

      login(data);

      alert("Seller login successful");

      navigate("/seller/dashboard");
    } catch (error) {
      console.log("FULL ERROR:", error);

      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Card */}
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Seller Login 🛍️</h1>

        <p className="text-center text-gray-500 mb-6">
          Access your seller dashboard
        </p>
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h3 className="font-semibold text-blue-800">Demo Credentials</h3>

          <p className="text-sm mt-2">
            <strong>Seller</strong>
            <br />
            Email: afreenshabbagh@gmail.com
            <br />
            Password: 123456
          </p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p
            className="text-sm text-blue-500 cursor-pointer text-left mt-2"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </p>
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Login
          </button>

          <p className="text-center text-sm">
            Don't have a seller account?{" "}
            <Link
              to="/seller/register"
              className="text-blue-500 hover:underline"
            >
              Register as Seller
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SellerLoginPage;
