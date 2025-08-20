import { useState } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { baseUrl } from "../url";  
import { setAutoLogout } from "../utils/auth"

export default function InputForm({ setIsOpen }) {
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [isSignUp,setIsSignUp]=useState(false) 
  const [error,setError]=useState("")
  const [loading, setLoading] = useState(false)


  // const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const backendUrl = baseUrl;
  const handleOnSubmit=async(e)=> {
    e.preventDefault()
    setLoading(true)
    setError("")
    let endpoint=(isSignUp) ? "api/signUp" : "api/login"
    
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      };
      
      const response = await axios.post(
        `${backendUrl}/${endpoint}`, 
        {email, password}, 
        config
      );
      
    const token = response.data.token
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(response.data.user))
    setAutoLogout(token)

      setIsOpen()
    } catch (err) {
      console.error("Auth error:", err);
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

  return (
    <div className='p-4'>
      <h2 className='text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600'>
        {isSignUp ? 'Register' : 'Login'}
      </h2>
        <form onSubmit={handleOnSubmit}>
            <div className='mb-4'>
                <label className='block text-gray-300 mb-2'>Email</label>
                <input 
                  type="email" 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)} required></input>
            </div>
            <div className='mb-4'>
                <label className='block text-gray-300 mb-2'>Password</label>
                <input 
                  type="password" 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)} required></input>
            </div>
            <button 
              className='btn w-full mt-7'
              disabled={loading}
              type='submit'>{loading ? "Processing..." : (isSignUp ? "Sign Up" : "Login")}</button><br></br>
          { (error!="") && <h6 className='text-red-500 mb-4 text-sm text-center mt-6'>{error}</h6>}<br></br>

          {!isSignUp && (
          <p
            className='text-center text-blue-400 cursor-pointer hover:text-blue-300 mt-4'
            onClick={handleForgotPassword}
          >
            Forgot password?
          </p>
          )} 
            <p 
              className='text-center text-gray-400 cursor-pointer hover:text-gray-300 mt-4'
              onClick={()=>setIsSignUp(pre=>!pre)}>{(isSignUp) ? "Already have an account": "Create new account"}</p>
        </form>
    </div>
  )
}

// PropTypes validation
InputForm.propTypes = {
  setIsOpen: PropTypes.func.isRequired
}
