import { useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`/api/users/reset-password/${token}`, { password });
      alert("Password updated");
    } catch (err) {
      alert("Error");
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <input
        type="password"
        placeholder="New password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button>Update Password</button>
    </form>
  );
};

export default ResetPassword;
