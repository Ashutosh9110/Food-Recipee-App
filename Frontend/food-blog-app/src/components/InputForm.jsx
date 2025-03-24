import React, { useState } from 'react'
import axios from 'axios'
import { baseUrl } from '../../url'

export default function InputForm({ setIsOpen }) {
  const [isLogin, setIsLogin] = useState(true)
  const [userData, setUserData] = useState({
    email: "", password: "", confirmPassword: ""
  })
  const [errorMsg, setErrorMsg] = useState("")

  const handleChange = (e) => {
    let { name, value } = e.target
    setUserData({ ...userData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg("")

    try {
      if (isLogin) {
        // Login
        await axios.post(`${baseUrl}/user/login`, userData)
          .then(response => {
            localStorage.setItem("token", response.data.token)
            localStorage.setItem("user", JSON.stringify(response.data.user))
            setIsOpen()
            window.location.reload()
          })
          .catch(error => {
            setErrorMsg("Invalid credentials")
          })
      } else {
        // Register
        if (userData.password !== userData.confirmPassword) {
          setErrorMsg("Passwords do not match")
          return
        }

        await axios.post(`${baseUrl}/user/register`, userData)
          .then(response => {
            localStorage.setItem("token", response.data.token)
            localStorage.setItem("user", JSON.stringify(response.data.user))
            setIsOpen()
            window.location.reload()
          })
          .catch(error => {
            setErrorMsg("Registration failed. Email may already be in use.")
          })
      }
    } catch (error) {
      setErrorMsg("Something went wrong")
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
        {isLogin ? 'Login' : 'Register'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>
        
        {!isLogin && (
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>
        )}
        
        {errorMsg && (
          <p className="text-red-500 mb-4 text-sm">{errorMsg}</p>
        )}
        
        <button 
          type="submit"
          className="btn w-full mb-4"
        >
          {isLogin ? 'Login' : 'Register'}
        </button>
        
        <p className="text-center text-gray-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-pink-500 hover:text-pink-400 focus:outline-none"
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </form>
    </div>
  )
}
