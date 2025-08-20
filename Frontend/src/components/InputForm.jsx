import { useState } from "react"
import axios from "axios"
import PropTypes from "prop-types"
import { baseUrl } from "../url"
import OtpForm from "./OtpForm"   // <-- import

export default function InputForm({ setIsOpen }) {
  const [name, setName] = useState("")      // for signup
  const [phone, setPhone] = useState("")    // for signup
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState("auth") // "auth" | "otp"
  const [userId, setUserId] = useState(null)

  const backendUrl = baseUrl

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    let endpoint = isSignUp ? "api/signUp" : "api/login"

    try {
      const config = { headers: { "Content-Type": "application/json" } }
      const payload = isSignUp
        ? { name, email, phone, password }
        : { email, password }

      const response = await axios.post(`${backendUrl}/${endpoint}`, payload, config)

      // Backend sends back: { message, userId }
      setUserId(response.data.userId)
      setStep("otp") // move to OTP step
    } catch (err) {
      console.error("Auth error:", err)
      if (err.response) {
        setError(err.response.data.error || err.response.data.message || "Authentication failed")
      } else if (err.request) {
        setError("No response from server. Please check your internet connection.")
      } else {
        setError("Failed to connect to server")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    const resetEmail = prompt("Enter your registered email:")
    if (!resetEmail) return

    try {
      const res = await axios.post(`${backendUrl}/api/password/forgot`, { email: resetEmail })
      alert(res.data.message || "Password reset link sent to your email.")
    } catch (err) {
      alert(err.response?.data?.message || "Error sending password reset email")
    }
  }

  // if we are in OTP step, show OtpForm
  if (step === "otp" && userId) {
    return <OtpForm userId={userId} setIsOpen={setIsOpen} />
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
        {isSignUp ? "Register" : "Login"}
      </h2>

      <form onSubmit={handleOnSubmit}>
        {isSignUp && (
          <>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Name</label>
              <input
                type="text"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Phone</label>
              <input
                type="tel"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Email</label>
          <input
            type="email"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Password</label>
          <input
            type="password"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="btn w-full mt-7" disabled={loading} type="submit">
          {loading ? "Processing..." : isSignUp ? "Sign Up" : "Login"}
        </button>

        {error && (
          <h6 className="text-red-500 mb-4 text-sm text-center mt-6">{error}</h6>
        )}

        {!isSignUp && (
          <p
            className="text-center text-blue-400 cursor-pointer hover:text-blue-300 mt-4"
            onClick={handleForgotPassword}
          >
            Forgot password?
          </p>
        )}

        <p
          className="text-center text-gray-400 cursor-pointer hover:text-gray-300 mt-4"
          onClick={() => setIsSignUp((pre) => !pre)}
        >
          {isSignUp ? "Already have an account" : "Create new account"}
        </p>
      </form>
    </div>
  )
}

InputForm.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
}
