import { useState, useEffect, useRef } from 'react'
import RecipeItems from '../components/RecipeItems'
import { useNavigate } from 'react-router-dom'
import Modal from '../components/Modal'
import InputForm from '../components/InputForm'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    const recipesRef = useRef(null)
    const titleRef = useRef(null)
    const subtitleRef = useRef(null)
    const btnRef = useRef(null)
    
    useEffect(() => {
        // Hero section animation
        gsap.fromTo(
            titleRef.current,
            { opacity: 0, y: -50 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 1.5, 
                ease: "power3.out" 
            }
        );

        gsap.fromTo(
            subtitleRef.current,
            { opacity: 0 },
            { 
                opacity: 1, 
                duration: 1.5, 
                delay: 0.5, 
                ease: "power2.out" 
            }
        );

        gsap.fromTo(
            btnRef.current,
            { opacity: 0, y: 30 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 1, 
                delay: 1, 
                ease: "back.out(1.7)" 
            }
        );

        // Scroll animations for recipe cards
        ScrollTrigger.batch(".card", {
            onEnter: (elements) => {
                gsap.to(elements, {
                    opacity: 1,
                    y: 0,
                    stagger: 0.15,
                    ease: "power2.out"
                });
            },
            onLeave: (elements) => {
                gsap.set(elements, {
                    opacity: 0.5,
                    y: 30
                });
            },
            onEnterBack: (elements) => {
                gsap.to(elements, {
                    opacity: 1,
                    y: 0,
                    stagger: 0.15
                });
            },
            onLeaveBack: (elements) => {
                gsap.set(elements, {
                    opacity: 0.5,
                    y: -30
                });
            }
        });

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
            <div className="content-container min-h-screen flex flex-col justify-center items-center pt-20 pb-10">
                <motion.h1 
                    ref={titleRef}
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="text-6xl md:text-7xl font-extrabold tracking-tight"
                >
                    Culinary <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">Inspirations</span>
                </motion.h1>
                <motion.p 
                    ref={subtitleRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="text-lg md:text-xl text-gray-300 mt-6 max-w-2xl text-center"
                >
                    Discover culinary masterpieces from around the world. Share your own creations and explore a universe of flavors crafted by passionate food enthusiasts.
                </motion.p>
                <motion.button 
                    ref={btnRef}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    onClick={addRecipe} 
                    className="btn mt-10"
                >
                    Create Recipe
                </motion.button>
            </div>

            {(isOpen) && <Modal onClose={() => setIsOpen(false)}><InputForm setIsOpen={() => setIsOpen(false)} /></Modal>}
            
            <div ref={recipesRef} className="w-full max-w-7xl mx-auto px-4 py-16">
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600"
                >
                    Trending Recipes
                </motion.h2>
                <RecipeItems />
            </div>
        </>
    )
}