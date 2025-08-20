// src/components/OtpForm.jsx
import { useState } from "react"
import axios from "axios"
import PropTypes from "prop-types"
import { baseUrl } from "../url"
import { setAutoLogout } from "../utils/auth"

export default function OtpForm({ userId, setIsOpen }) {
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await axios.post(`${baseUrl}/api/verifyOtp`, { userId, otp })
      const { token, user } = res.data

      // Save token + user in localStorage
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
      setAutoLogout(token)

      alert("OTP verified successfully ✅")
      setIsOpen() // close modal
    } catch (err) {
      console.error("OTP error:", err)
      setError(err.response?.data?.message || "Invalid or expired OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-green-600">
        Verify OTP
      </h2>
      <form onSubmit={handleVerifyOtp}>
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Enter OTP</label>
          <input
            type="text"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
        <button
          className="btn w-full mt-7"
          disabled={loading}
          type="submit"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
        {error && <h6 className="text-red-500 mt-4 text-sm text-center">{error}</h6>}
      </form>
    </div>
  )
}

OtpForm.propTypes = {
  userId: PropTypes.string.isRequired,
  setIsOpen: PropTypes.func.isRequired,
}
