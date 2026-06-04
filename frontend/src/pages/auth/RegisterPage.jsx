import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/api/auth/register", form);

      alert("Registration successful!");
      navigate("/verify-otp", {
        state: {
          email: form.email,
        },
      });
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={submitHandler}
        className="bg-white p-8 rounded-2xl shadow-lg w-[350px]"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        <div className="mb-4">
          <label className="block text-sm mb-1">Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Register
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
