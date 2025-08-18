import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../url";

export default function ResetPassword() {
  const { token } = useParams();   // get token from URL
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post(`${baseUrl}/api/password/reset/${token}`, {
        password,
      });
      setMessage(res.data.message || "Password reset successful!");
      setTimeout(() => navigate("/"), 2000); // redirect to login
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to reset password");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-white text-center">
          Reset Password
        </h2>
        <input
          type="password"
          placeholder="New Password"
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg"
        >
          Reset
        </button>
        {message && (
          <p className="text-center text-sm text-gray-300 mt-3">{message}</p>
        )}
      </form>
    </div>
  );
}
