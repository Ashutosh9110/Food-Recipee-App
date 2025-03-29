import React, { useState } from 'react'
import axios from 'axios'
import { baseUrl } from '../../url'

export default function InputForm({ setIsOpen }) {
   const [email,setEmail]=useState("")
   const [password,setPassword]=useState("")
   const [isSignUp,setIsSignUp]=useState(false) 
   const [error,setError]=useState("")


  const handleOnSubmit=async(e)=>{
    e.preventDefault()
    let endpoint=(isSignUp) ? "signUp" : "login"
    await axios.post(`http://localhost:5000/${endpoint}`,{email,password})
    .then((res)=>{
        localStorage.setItem("token",res.data.token)
        localStorage.setItem("user",JSON.stringify(res.data.user))
        setIsOpen()
    })
    .catch(data=>setError(data.response?.data?.error))
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
                  onChange={(e)=>setEmail(e.target.value)} required></input>
            </div>
            <div className='mb-4'>
                <label className='block text-gray-300 mb-2'>Password</label>
                <input 
                  type="password" 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                  onChange={(e)=>setPassword(e.target.value)} required></input>
            </div>
            <button 
              className='btn w-full mt-7'
              type='submit'>{(isSignUp) ? "Sign Up": "Login"}</button><br></br>
          { (error!="") && <h6 className='text-red-500 mb-4 text-sm text-center mt-6'>{error}</h6>}<br></br>
            <p 
              className='text-center text-gray-400 cursor-pointer hover:text-gray-300'
              onClick={()=>setIsSignUp(pre=>!pre)}>{(isSignUp) ? "Already have an account": "Create new account"}</p>
        </form>
    </div>
  )
}
