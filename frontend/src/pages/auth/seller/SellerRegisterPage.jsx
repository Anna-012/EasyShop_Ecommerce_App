import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../../../services/api";

const SellerRegisterPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
  });

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await await API.post("/auth/seller/register", form);
      alert("Seller registration successful!");

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
        className="bg-white p-8 rounded-2xl shadow-lg w-[400px]"
      >
        <h2 className="text-2xl font-bold text-center mb-2">Become a Seller</h2>

        <p className="text-center text-gray-500 mb-6">
          Start selling your products today
        </p>

        <div className="mb-4">
          <label className="block text-sm mb-1">Full Name</label>

          <input
            type="text"
            placeholder="Enter your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Password</label>

          <input
            type="password"
            placeholder="Enter password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Phone Number</label>

          <input
            type="tel"
            placeholder="Enter phone number"
            value={form.phoneNumber}
            onChange={(e) =>
              setForm({
                ...form,
                phoneNumber: e.target.value,
              })
            }
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-1">Address</label>

          <textarea
            placeholder="Enter your address"
            value={form.address}
            onChange={(e) =>
              setForm({
                ...form,
                address: e.target.value,
              })
            }
            rows={3}
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Register as Seller
        </button>

        <p className="text-sm text-center mt-4">
          Already have a seller account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/seller/login")}
          >
            Seller Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default SellerRegisterPage;
