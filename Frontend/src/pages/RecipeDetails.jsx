import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import { BsStopwatchFill, BsPersonCircle } from 'react-icons/bs'

export default function RecipeDetails() {
    const [recipe, setRecipe] = useState(null)
    const [loading, setLoading] = useState(true)
    const { id } = useParams()
    
    useEffect(() => {
        const fetchRecipeDetails = async () => {
            setLoading(true)
            try {
                const recipeResponse = await axios.get(`http://localhost:5000/recipe/${id}`)
                const recipeData = recipeResponse.data
                
                // Set recipe data without trying to fetch user info
                setRecipe({
                    ...recipeData,
                    email: "Recipe Author" // Default value in case user info is not available
                })
                
                // Try to get user information if available, but don't let it block displaying the recipe
                try {
                    const userResponse = await axios.get(`http://localhost:5000/user/${recipeData.createdBy}`)
                    if (userResponse.data && userResponse.data.email) {
                        setRecipe(prev => ({
                            ...prev,
                            email: userResponse.data.email
                        }))
                    }
                } catch {
                    console.log("Could not fetch user details, using default author name")
                }
            } catch (error) {
                console.error("Error fetching recipe details:", error)
            } finally {
                setLoading(false)
            }
        }
        
        fetchRecipeDetails()
    }, [id])
    
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        )
    }
    
    if (!recipe) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-bold text-red-500">Recipe not found</h2>
            </div>
        )
    }
    
    return (
        <>
            <div className="max-w-4xl mx-auto px-4 py-12">
                <motion.div 
                    className="card overflow-hidden mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="relative h-80 md:h-96">
                        <motion.img 
                            src={`http://localhost:5000/images/${recipe.coverImage}`} 
                            alt={recipe.title}
                            className="w-full h-full object-cover"
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.8 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                        
                        <div className="absolute bottom-0 left-0 w-full p-6 md:p-8">
                            <motion.h1 
                                className="text-3xl md:text-4xl font-bold mb-2 text-white"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                            >
                                {recipe.title}
                            </motion.h1>
                            
                            <motion.div 
                                className="flex items-center space-x-4 mb-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                            >
                                <div className="flex items-center space-x-2 text-gray-300">
                                    <BsStopwatchFill className="text-pink-500" />
                                    <span>{recipe.time}</span>
                                </div>
                            </motion.div>
                            
                            <motion.div 
                                className="flex items-center space-x-2 text-sm text-gray-300"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.6 }}
                            >
                                <BsPersonCircle className="text-purple-500" />
                                <span>Created by {recipe.email}</span>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <motion.div 
                        className="md:col-span-1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        <div className="card p-6">
                            <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
                                Ingredients
                            </h3>
                            <ul className="space-y-3">
                                {recipe.ingredients.map((item, index) => (
                                    <motion.li 
                                        key={index}
                                        className="flex items-start"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + (index * 0.1), duration: 0.5 }}
                                    >
                                        <span className="inline-block w-2 h-2 mt-2 mr-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600"></span>
                                        <span className="text-gray-300">{item.trim()}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        className="md:col-span-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    >
                        <div className="card p-6">
                            <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
                                Instructions
                            </h3>
                            <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                                {recipe.instructions}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    )
}
