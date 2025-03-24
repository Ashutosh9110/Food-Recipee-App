import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import InputForm from './InputForm'
import { NavLink } from 'react-router-dom'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  let token = localStorage.getItem("token")
  const [isLogin, setIsLogin] = useState(token ? false : true)
  let user = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {
    setIsLogin(token ? false : true)
  }, [token])

  const checkLogin = () => {
    if (token) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setIsLogin(true) // by making it true, it will show the login option
    }
    else { // if token is not there..that means user wants to login and it will open the pop up window
      setIsOpen(true)
    }
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Food Recipe
          </div>
          
          <nav>
            <ul className="flex space-x-2">
              <li>
                <NavLink 
                  to="/" 
                  className={({ isActive }) => 
                    isActive 
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full" 
                      : "text-white px-4 py-2 rounded-full hover:bg-gray-800/50 transition-colors"
                  }
                >
                  Home
                </NavLink>
              </li>
              <li onClick={() => isLogin && setIsOpen(true)}>
                <NavLink 
                  to={!isLogin ? "/myRecipe" : "/"} 
                  className={({ isActive }) => 
                    isActive 
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full" 
                      : "text-white px-4 py-2 rounded-full hover:bg-gray-800/50 transition-colors"
                  }
                >
                  My Recipes
                </NavLink>
              </li>
              <li onClick={() => isLogin && setIsOpen(true)}>
                <NavLink 
                  to={!isLogin ? "/favRecipe" : "/"} 
                  className={({ isActive }) => 
                    isActive 
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full" 
                      : "text-white px-4 py-2 rounded-full hover:bg-gray-800/50 transition-colors"
                  }
                >
                  Favorites
                </NavLink>
              </li>
              <li>
                <button 
                  onClick={checkLogin} 
                  className="bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
                >
                  {isLogin ? "Login" : `Logout ${user?.email ? `(${user.email})` : ""}`}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      {(isOpen) && <Modal onClose={() => setIsOpen(false)}><InputForm setIsOpen={() => setIsOpen(false)} /></Modal>}
    </>
  )
}
