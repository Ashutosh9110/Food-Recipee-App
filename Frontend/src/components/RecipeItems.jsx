import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BsStopwatchFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { motion } from "framer-motion";
import axios from 'axios';

export default function RecipeItems({ initialRecipes = [] }) {
    const [allRecipes, setAllRecipes] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    let path = window.location.pathname === "/myRecipe" ? true : false
    let favItems = JSON.parse(localStorage.getItem("fav")) ?? []
    const navigate = useNavigate()

    useEffect(() => {
        const fetchRecipes = async () => {
            setIsLoading(true)
            try {
                // If we're on the myRecipes page, filter recipes
                if (path) {
                    const response = await axios.get(`http://localhost:5000/recipe`)
                    const recipes = response.data
                    const user = JSON.parse(localStorage.getItem("user"))
                    if (user && user._id) {
                        const filteredRecipes = recipes.filter(recipe => recipe.createdBy === user._id)
                        setAllRecipes(filteredRecipes)
                    } else {
                        setAllRecipes([])
                    }
                } 
                // If we're on the favorites page
                else if (window.location.pathname === "/favRecipe") {
                    setAllRecipes(favItems)
                }
                // Default home page with all recipes
                else {
                    const response = await axios.get(`http://localhost:5000/recipe`)
                    setAllRecipes(response.data)
                }
            } catch (error) {
                console.error("Error fetching recipes:", error)
                setAllRecipes([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchRecipes()
    }, [path])

    const onDelete = async (id) => {
        await axios.delete(`http://localhost:5000/recipe/${id}`)
            .then((res) => console.log(res))
        setAllRecipes(recipes => recipes.filter(recipe => recipe._id !== id))
        let filterItem = favItems.filter(recipe => recipe._id !== id)
        localStorage.setItem("fav", JSON.stringify(filterItem))
    }

    const favRecipe = (item) => {
        let filterItem = favItems.filter(recipe => recipe._id !== item._id)
        favItems = favItems.filter(recipe => recipe._id === item._id).length === 0 ? [...favItems, item] : filterItem
        localStorage.setItem("fav", JSON.stringify(favItems))
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };
      
    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        )
    }

    return (
        <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            animate="show"
        >
            {allRecipes?.length > 0 ? (
                allRecipes.map((item, index) => (
                    <motion.div 
                        key={index} 
                        className="card group cursor-pointer"
                        onClick={() => navigate(`/recipe/${item._id}`)}
                        variants={item}
                        whileHover={{ 
                            y: -10,
                            transition: { duration: 0.3 }
                        }}
                    >
                        <div className="relative h-52 overflow-hidden rounded-t-lg">
                            <img 
                                src={`http://localhost:5000/images/${item.coverImage}`} 
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600 group-hover:from-purple-600 group-hover:to-pink-500 transition-all duration-300">
                                {item.title}
                            </h3>
                            <div className="flex justify-between items-center mt-4">
                                <div className="flex items-center space-x-2 text-gray-400">
                                    <BsStopwatchFill className="text-pink-500" />
                                    <span>{item.time}</span>
                                </div>
                                
                                {(!path) ? (
                                    <motion.button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            favRecipe(item);
                                        }} 
                                        className="text-2xl focus:outline-none"
                                        whileTap={{ scale: 0.9 }}
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        <FaHeart className={favItems.some(res => res._id === item._id) ? "text-red-500" : "text-gray-400 hover:text-red-400"} />
                                    </motion.button>
                                ) : (
                                    <div className="flex space-x-4">
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <Link 
                                                to={`/editRecipe/${item._id}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="text-blue-500 hover:text-blue-400 transition-colors"
                                            >
                                                <FaEdit size={20} />
                                            </Link>
                                        </motion.div>
                                        <motion.button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(item._id);
                                            }} 
                                            className="text-red-500 hover:text-red-400 transition-colors"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <MdDelete size={20} />
                                        </motion.button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))
            ) : (
                <motion.div 
                    className="col-span-full text-center p-8 card"
                    variants={item}
                >
                    <h3 className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
                        No recipes found
                    </h3>
                    <p className="text-gray-400">
                        Try adding some delicious recipes!
                    </p>
                </motion.div>
            )}
        </motion.div>
    )
}