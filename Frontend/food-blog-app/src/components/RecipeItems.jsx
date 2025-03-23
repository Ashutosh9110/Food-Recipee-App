import { useEffect, useState } from 'react'
import { Link, useLoaderData, useNavigate } from 'react-router-dom'
import { BsStopwatchFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from 'axios';
import { baseUrl } from '../../url';
import { motion } from 'framer-motion';

export default function RecipeItems() {
    const recipes = useLoaderData()
    const [allRecipes, setAllRecipes] = useState()
    let path = window.location.pathname === "/myRecipe" ? true : false
    let favItems = JSON.parse(localStorage.getItem("fav")) ?? []
    const navigate=useNavigate()

    useEffect(() => {
        setAllRecipes(recipes)
    }, [recipes])

    const onDelete = async (id) => {
        await axios.delete(`${baseUrl}/recipe/${id}`)
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

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        show: { 
            opacity: 1, 
            y: 0,
            transition: {
                type: "spring",
                damping: 15
            }
        },
        hover: {
            y: -10,
            boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
            transition: {
                type: "spring",
                stiffness: 300
            }
        }
    };

    return (
        <>
            <motion.div 
                className='card-container'
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {
                    allRecipes?.map((item, index) => {
                        return (
                            <motion.div 
                                key={index} 
                                className='card dark:bg-gray-800 dark:text-white'
                                variants={cardVariants}
                                whileHover="hover"
                                onDoubleClick={()=>navigate(`/recipe/${item._id}`)}
                            >
                                <motion.img 
                                    src={`${baseUrl}/images/${item.coverImage}`} 
                                    width="120px" 
                                    height="100px"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.3 }}
                                />
                                <div className='card-body'>
                                    <motion.div 
                                        className='title'
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        {item.title}
                                    </motion.div>
                                    <div className='icons'>
                                        <div className='timer'><BsStopwatchFill />{item.time}</div>
                                        {(!path) ? (
                                            <motion.div
                                                whileTap={{ scale: 1.3 }}
                                            >
                                                <FaHeart 
                                                    onClick={() => favRecipe(item)}
                                                    style={{ color: (favItems.some(res => res._id === item._id)) ? "red" : "" }} 
                                                />
                                            </motion.div>
                                        ) : (
                                            <div className='action'>
                                                <motion.div whileHover={{ scale: 1.2 }}>
                                                    <Link to={`/editRecipe/${item._id}`} className="editIcon">
                                                        <FaEdit />
                                                    </Link>
                                                </motion.div>
                                                <motion.div whileHover={{ scale: 1.2 }}>
                                                    <MdDelete 
                                                        onClick={() => onDelete(item._id)} 
                                                        className='deleteIcon' 
                                                    />
                                                </motion.div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })
                }
            </motion.div>
        </>
    )
}
