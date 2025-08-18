import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUpload } from 'react-icons/fi'
// import { baseUrl } from '../url'

export default function AddFoodRecipe() {
    const [recipeData, setRecipeData] = useState({})
    const [fileName, setFileName] = useState('No file selected')
    const navigate = useNavigate()
    
    // This is the original working code for handling form changes
    const onHandleChange = (e) => {
        if (e.target.name === "file") {
            setFileName(e.target.files[0]?.name || 'No file selected')
            let val = e.target.files[0]
            setRecipeData(pre => ({ ...pre, [e.target.name]: val }))
        } else {
            let val = (e.target.name === "ingredients") ? e.target.value.split(",") : e.target.value
            setRecipeData(pre => ({ ...pre, [e.target.name]: val }))
        }
    }
    
    // This is the original working code for form submission
    const onHandleSubmit = async (e) => {
        e.preventDefault()
        console.log(recipeData)
        await axios.post(`http://localhost:5000/recipe`, recipeData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'authorization': 'bearer ' + localStorage.getItem("token")
            }
        })
        .then(() => navigate("/"))
        .catch(error => {
            console.error("Error adding recipe:", error)
            alert("Error adding recipe: " + (error.response?.data?.message || error.message))
        })
    }

    // Animation variants for the form
    const formVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }
    
    return (
        <>
            <div className="w-full max-w-4xl mx-auto px-4 py-24">
                <motion.h1 
                    className="text-4xl font-bold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Create New Recipe
                </motion.h1>
                
                <motion.form 
                    className="card p-8 w-full max-w-3xl mx-auto"
                    onSubmit={onHandleSubmit}
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div className="mb-6" variants={itemVariants}>
                        <label className="block text-gray-300 mb-2 font-medium">Title</label>
                        <input 
                            type="text" 
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" 
                            name="title" 
                            onChange={onHandleChange}
                            required
                            placeholder="e.g. Creamy Garlic Pasta"
                        />
                    </motion.div>

                    <motion.div className="mb-6" variants={itemVariants}>
                        <label className="block text-gray-300 mb-2 font-medium">Preparation Time</label>
                        <input 
                            type="text" 
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" 
                            name="time" 
                            onChange={onHandleChange}
                            required
                            placeholder="e.g. 30 mins"
                        />
                    </motion.div>

                    <motion.div className="mb-6" variants={itemVariants}>
                        <label className="block text-gray-300 mb-2 font-medium">Ingredients</label>
                        <textarea 
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" 
                            name="ingredients" 
                            rows="4" 
                            onChange={onHandleChange}
                            required
                            placeholder="Add ingredients separated by commas"
                        ></textarea>
                        <p className="text-gray-400 text-sm mt-1">Separate ingredients with commas</p>
                    </motion.div>

                    <motion.div className="mb-6" variants={itemVariants}>
                        <label className="block text-gray-300 mb-2 font-medium">Instructions</label>
                        <textarea 
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" 
                            name="instructions" 
                            rows="6" 
                            onChange={onHandleChange}
                            required
                            placeholder="Write step by step instructions here"
                        ></textarea>
                    </motion.div>

                    <motion.div className="mb-8" variants={itemVariants}>
                        <label className="block text-gray-300 mb-2 font-medium">Recipe Image</label>
                        <div className="relative">
                            <input 
                                type="file" 
                                id="file" 
                                className="hidden" 
                                name="file" 
                                onChange={onHandleChange}
                                required
                            />
                            <label 
                                htmlFor="file" 
                                className="flex items-center justify-center w-full p-4 bg-gray-800 border border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                            >
                                <FiUpload className="text-purple-500 mr-2" size={20} />
                                <span className="text-gray-300">{fileName}</span>
                            </label>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <button 
                            type="submit"
                            className="btn w-full flex items-center justify-center"
                        >
                            Create Recipe
                        </button>
                    </motion.div>
                </motion.form>
            </div>
        </>
    )
} 