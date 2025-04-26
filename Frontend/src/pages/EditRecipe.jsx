import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { baseUrl } from '../../url'
import { motion } from 'framer-motion'
import { FiUpload } from 'react-icons/fi'

export default function EditRecipe() {
    const [recipeData, setRecipeData] = useState({})
    const [fileName, setFileName] = useState('No file selected')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const { id } = useParams()

    useEffect(() => {
        const fetchRecipeData = async () => {
            setIsLoading(true)
            try {
                const response = await axios.get(`http://localhost:5000/recipe/${id}`)
                const data = response.data
                setRecipeData({
                    title: data.title,
                    ingredients: data.ingredients.join(","),
                    instructions: data.instructions,
                    time: data.time
                })
                setFileName('Current image (only select a new one to change)')
            } catch (error) {
                console.error("Error fetching recipe:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchRecipeData()
    }, [id])

    const onHandleChange = (e) => {
        if (e.target.name === "file") {
            setFileName(e.target.files[0]?.name || 'No file selected')
            setRecipeData(prev => ({ ...prev, [e.target.name]: e.target.files[0] }))
        } else {
            let val = (e.target.name === "ingredients") ? e.target.value.split(",") : e.target.value
            setRecipeData(prev => ({ ...prev, [e.target.name]: val }))
        }
    }

    const onHandleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        
        try {
            await axios.put(`${baseUrl}/recipe/${id}`, recipeData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'authorization': 'bearer ' + localStorage.getItem("token")
                }
            })
            navigate("/myRecipe")
        } catch (error) {
            console.error('Error updating recipe:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

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

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        )
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
                    Edit Recipe
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
                            value={recipeData.title || ''}
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
                            value={recipeData.time || ''}
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
                            value={recipeData.ingredients || ''}
                            required
                            placeholder="Enter ingredients separated by commas"
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
                            value={recipeData.instructions || ''}
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
                            disabled={isSubmitting}
                            className="btn w-full flex items-center justify-center"
                        >
                            {isSubmitting ? 'Updating...' : 'Update Recipe'}
                        </button>
                    </motion.div>
                </motion.form>
            </div>
        </>
    )
}
