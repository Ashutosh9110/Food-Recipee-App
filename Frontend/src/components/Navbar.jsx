import { useEffect, useState } from 'react'
import Modal from './Modal'
import InputForm from './InputForm'
import { NavLink, Link } from 'react-router-dom'
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useMotionValueEvent 
} from 'framer-motion'
import { cn } from '../lib/utils'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const { scrollYProgress } = useScroll()
  let token = localStorage.getItem("token")
  const [isLogin, setIsLogin] = useState(token ? false : true)
  let user = JSON.parse(localStorage.getItem("user"))

  // Use motion value event to track scroll position
  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === "number") {
      const direction = current - scrollYProgress.getPrevious();
      
      if (scrollYProgress.get() < 0.05) {
        // At the top of the page, always show navbar with transparent background
        setVisible(true);
      } else {
        // Show when scrolling up, hide when scrolling down
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

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

  const navItems = [
    { name: "Home", link: "/" },
    { name: "MyRecipes", link: !isLogin ? "/myRecipe" : "/" },
    { name: "Favorites", link: !isLogin ? "/favRecipe" : "/" }
  ];

  // Determine background transparency based on scroll position
  const isAtTop = scrollYProgress.get() < 0.05;

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.header 
          className="fixed top-0 left-0 right-0 z-50"
          initial={{ opacity: 1, y: -100 }}
          animate={{ 
            opacity: visible ? 1 : 0,
            y: visible ? 0 : -100
          }}
          transition={{ duration: 0.3 }}
        >
          <div className={cn(
            "w-full transition-all duration-300",
            isAtTop 
              ? "bg-transparent" 
              : "bg-[#111827] backdrop-blur-md"
          )}>
            <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
              <Link to="/" className="z-10">
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
              </Link>
              
              <nav>
                <ul className="flex items-center gap-3">
                  {navItems.map((navItem, idx) => (
                    <motion.li
                      key={`nav-item-${idx}`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + (idx * 0.1), duration: 0.5 }}
                      onClick={() => {
                        if ((navItem.name === "MyRecipes" || navItem.name === "Favorites") && isLogin) {
                          setIsOpen(true);
                        }
                      }}
                    >
                      <NavLink 
                        to={navItem.link} 
                        className={({ isActive }) => 
                          isActive 
                            ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white px-5 py-2 rounded-full font-medium" 
                            : cn(
                                "text-white px-5 py-2 rounded-full transition-colors font-medium",
                                !isAtTop && "hover:bg-white/10"
                              )
                        }
                      >
                        {navItem.name}
                      </NavLink>
                    </motion.li>
                  ))}
                  <motion.li
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <button 
                      onClick={checkLogin} 
                      className="relative bg-gradient-to-r from-pink-500 to-purple-600 text-white px-5 py-2 rounded-full hover:opacity-90 transition-opacity font-medium ml-2"
                    >
                      {isLogin ? "Login" : `Logout ${user?.email ? `(${user.email})` : ""}`}
                      <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-white to-transparent h-px" />
                    </button>
                  </motion.li>
                </ul>
              </nav>
            </div>
          </div>
        </motion.header>
      </AnimatePresence>
      {(isOpen) && <Modal onClose={() => setIsOpen(false)}><InputForm setIsOpen={() => setIsOpen(false)} /></Modal>}
    </>
  )
}
