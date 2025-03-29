import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import InputForm from './InputForm'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

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
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-black/80 backdrop-blur-md border-b border-gray-800 w-screen">
          <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
            <motion.div 
              className="text-2xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Food Recipe
              </span>
            </motion.div>
            
            <nav>
              <ul className="flex items-center gap-3">
                <motion.li
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <NavLink 
                    to="/" 
                    className={({ isActive }) => 
                      isActive 
                        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white px-5 py-2 rounded-full font-medium" 
                        : "text-white px-5 py-2 rounded-full hover:bg-gray-800 transition-colors font-medium"
                    }
                  >
                    Home
                  </NavLink>
                </motion.li>
                <motion.li 
                  onClick={() => isLogin && setIsOpen(true)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <NavLink 
                    to={!isLogin ? "/myRecipe" : "/"} 
                    className={({ isActive }) => 
                      isActive 
                        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white px-5 py-2 rounded-full font-medium" 
                        : "text-white px-5 py-2 rounded-full hover:bg-gray-800 transition-colors font-medium"
                    }
                  >
                    MyRecipes
                  </NavLink>
                </motion.li>
                <motion.li 
                  onClick={() => isLogin && setIsOpen(true)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <NavLink 
                    to={!isLogin ? "/favRecipe" : "/"} 
                    className={({ isActive }) => 
                      isActive 
                        ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white px-5 py-2 rounded-full font-medium" 
                        : "text-white px-5 py-2 rounded-full hover:bg-gray-800 transition-colors font-medium"
                    }
                  >
                    Favorites
                  </NavLink>
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <button 
                    onClick={checkLogin} 
                    className="bg-gray-900 border border-gray-700 text-white px-5 py-2 rounded-full hover:bg-gray-800 transition-colors font-medium ml-2"
                  >
                    {isLogin ? "Login" : `Logout ${user?.email ? `(${user.email})` : ""}`}
                  </button>
                </motion.li>
              </ul>
            </nav>
          </div>
        </div>
      </motion.header>
      {(isOpen) && <Modal onClose={() => setIsOpen(false)}><InputForm setIsOpen={() => setIsOpen(false)} /></Modal>}
    </>
  )
}
