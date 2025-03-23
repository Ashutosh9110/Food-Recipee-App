import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import InputForm from './InputForm'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaMoon, FaSun } from 'react-icons/fa'
import { useTheme } from '../context/ThemeContext'

export default function Navbar() {
  const [isOpen,setIsOpen]=useState(false)
  let token=localStorage.getItem("token")
  const [isLogin,setIsLogin]=useState(token ? false : true)
  let user=JSON.parse(localStorage.getItem("user"))
  const { isDarkMode, toggleTheme } = useTheme()

  useEffect(()=>{
    setIsLogin(token ? false : true)
  },[token])

  const checkLogin=()=>{
    if(token){
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setIsLogin(true) // by making it true, it will show the login option

    }
    else{ // if token is not there..that means user wants to login and it will open the pop up window
      setIsOpen(true)
    }
  }

  const navbarVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 120, 
        damping: 20,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      }
    }
  }

  return (
    <>
        <motion.header
          className="dark:bg-gray-900 dark:text-white transition-colors duration-300"
          variants={navbarVariants}
          initial="hidden"
          animate="visible"
        >
            <motion.h2 
              variants={itemVariants}
              className="ml-6"
            >
              Food Blog
            </motion.h2>
            <motion.ul
              variants={navbarVariants}
              className="dark:text-white"
            >
                <motion.li variants={itemVariants}>
                  <NavLink 
                    to="/"
                    className={({ isActive }) => 
                      isActive ? "bg-teal-100 dark:bg-teal-800 dark:text-white" : "hover:bg-teal-50 dark:hover:bg-teal-900"
                    }
                  >
                    Home
                  </NavLink>
                </motion.li>
                <motion.li 
                  onClick={()=>isLogin && setIsOpen(true)}
                  variants={itemVariants}
                >
                  <NavLink 
                    to={ !isLogin ? "/myRecipe" : "/"}
                    className={({ isActive }) => 
                      isActive ? "bg-teal-100 dark:bg-teal-800 dark:text-white" : "hover:bg-teal-50 dark:hover:bg-teal-900"
                    }
                  >
                    My Recipe
                  </NavLink>
                </motion.li>
                <motion.li 
                  onClick={()=>isLogin && setIsOpen(true)}
                  variants={itemVariants}
                >
                  <NavLink 
                    to={ !isLogin ? "/favRecipe" : "/"}
                    className={({ isActive }) => 
                      isActive ? "bg-teal-100 dark:bg-teal-800 dark:text-white" : "hover:bg-teal-50 dark:hover:bg-teal-900"
                    }
                  >
                    Favourites
                  </NavLink>
                </motion.li>
                <motion.li onClick={checkLogin} variants={itemVariants}>
                  <p className='login dark:text-white'>
                    { (isLogin)? "Login": "Logout" }{user?.email ? `(${user?.email})` : ""}
                  </p>
                </motion.li>
                <motion.li variants={itemVariants}>
                  <button 
                    onClick={toggleTheme} 
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Toggle dark mode"
                  >
                    {isDarkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-700" />}
                  </button>
                </motion.li>
            </motion.ul>
        </motion.header>
       { (isOpen) && <Modal onClose={()=>setIsOpen(false)}><InputForm setIsOpen={()=>setIsOpen(false)}/></Modal>}
    </>
  )
}
