import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const email = location.state?.email;

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await API.post("/auth/verify-otp", {
        email,
        otp,
      });

      login(data);

      alert("OTP verified successfully!");

      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={submitHandler}
        className="bg-white p-8 rounded-2xl shadow-lg w-[400px]"
      >
        <h2 className="text-2xl font-bold text-center mb-2">Verify OTP</h2>

        <p className="text-center text-gray-500 mb-6">
          OTP has been sent to your email
        </p>

        <input
          type="text"
          maxLength="6"
          placeholder="Enter OTP"
          className="w-full border px-3 py-2 rounded-lg mb-4 text-center tracking-[10px]"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-lg"
        >
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;
