import { useState, useEffect, useRef } from 'react'
import foodRecipe from '../assets/foodRecipe.png'
import RecipeItems from '../components/RecipeItems'
import { useNavigate } from 'react-router-dom'
import Modal from '../components/Modal'
import InputForm from '../components/InputForm'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CustomCursor from '../components/CustomCursor'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    const { isDarkMode } = useTheme()
    
    const heroRef = useRef(null)
    const recipesRef = useRef(null)
    const titleRef = useRef(null)
    const imgRef = useRef(null)
    const btnRef = useRef(null)

    useEffect(() => {
        // Hero section animation
        gsap.fromTo(
            titleRef.current,
            { opacity: 0, y: 50 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 1, 
                ease: "power3.out" 
            }
        );

        gsap.fromTo(
            imgRef.current,
            { opacity: 0, scale: 0.8 },
            { 
                opacity: 1, 
                scale: 1, 
                duration: 1, 
                delay: 0.3, 
                ease: "back.out(1.7)" 
            }
        );

        gsap.fromTo(
            btnRef.current,
            { opacity: 0, y: 20 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 0.8, 
                delay: 0.6, 
                ease: "power2.out" 
            }
        );

        // Scroll animations for recipe cards
        const animateRecipes = () => {
            ScrollTrigger.batch(".card", {
                onEnter: (elements) => {
                    gsap.to(elements, {
                        opacity: 1,
                        y: 0,
                        stagger: 0.15,
                        overwrite: true,
                        ease: "power2.out"
                    });
                },
                onLeave: (elements) => {
                    gsap.set(elements, {
                        opacity: 0,
                        y: 50,
                        overwrite: true
                    });
                },
                onEnterBack: (elements) => {
                    gsap.to(elements, {
                        opacity: 1,
                        y: 0,
                        stagger: 0.15,
                        overwrite: true
                    });
                },
                onLeaveBack: (elements) => {
                    gsap.set(elements, {
                        opacity: 0,
                        y: -50,
                        overwrite: true
                    });
                }
            });
        };

        // Call on component mount
        animateRecipes();

        // Clean up
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    const addRecipe = () => {
        let token = localStorage.getItem("token")
        if (token)
            navigate("/addRecipe")
        else {
            setIsOpen(true)
        }
    }

    return (
        <>
            <CustomCursor />
            <motion.section 
                className='home dark:bg-gray-900 dark:text-white transition-colors duration-500'
                ref={heroRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className='left'>
                    <h1 ref={titleRef} className="text-4xl md:text-6xl font-bold mb-6">Food Recipe</h1>
                    <h5 className="text-gray-600 dark:text-gray-300 mb-8">
                        Discover delicious recipes from around the world. Share your own creations and connect with food lovers everywhere.
                    </h5>
                    <motion.button 
                        ref={btnRef}
                        onClick={addRecipe}
                        className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg 
                                   transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Share your recipe
                    </motion.button>
                </div>
                <div className='right'>
                    <motion.img 
                        ref={imgRef}
                        src={foodRecipe} 
                        width="320px" 
                        height="300px"
                        whileHover={{ 
                            rotate: [0, 5, -5, 0],
                            transition: { duration: 0.5, repeat: Infinity, repeatType: "mirror" }
                        }}
                    />
                </div>
            </motion.section>

            <div className='bg dark:bg-gray-800'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                    <path 
                        fill={isDarkMode ? "#1f2937" : "#d4f6e8"} 
                        fillOpacity="1" 
                        d="M0,32L40,32C80,32,160,32,240,58.7C320,85,400,139,480,149.3C560,160,640,128,720,101.3C800,75,880,53,960,80C1040,107,1120,181,1200,213.3C1280,245,1360,235,1400,229.3L1440,224L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z">
                    </path>
                </svg>
            </div>

            {(isOpen) && <Modal onClose={() => setIsOpen(false)}><InputForm setIsOpen={() => setIsOpen(false)} /></Modal>}
            
            <div ref={recipesRef} className='recipe dark:bg-gray-800 dark:text-white transition-colors duration-500'>
                <RecipeItems />
            </div>
        </>
    )
}
