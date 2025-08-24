import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BsStopwatchFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { motion } from "framer-motion";
import axios from "axios";
import Modal from "./Modal";
import InputForm from "./InputForm";

export default function RecipeItems({ initialRecipes = [] }) {
  const [allRecipes, setAllRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false); // 👈 modal state
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname === "/myRecipe";

  let favItems = JSON.parse(localStorage.getItem("fav")) ?? [];

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      try {
        if (location.pathname === "/myRecipe") {
          const response = await axios.get(`http://localhost:5000/recipe`);
          const recipes = response.data;
          const user = JSON.parse(localStorage.getItem("user"));
          if (user && user._id) {
            const filteredRecipes = recipes.filter(
              (recipe) => recipe.createdBy?._id === user._id
            );
            setAllRecipes(filteredRecipes);
          } else {
            setAllRecipes([]);
          }
        } else if (location.pathname === "/favRecipe") {
          setAllRecipes(favItems);
        } else {
          const response = await axios.get(`http://localhost:5000/recipe`);
          setAllRecipes(response.data);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setAllRecipes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [location.pathname]);

  const onDelete = async (id) => {
    await axios.delete(`http://localhost:5000/recipe/${id}`);
    setAllRecipes((recipes) => recipes.filter((recipe) => recipe._id !== id));
    let filterItem = favItems.filter((recipe) => recipe._id !== id);
    localStorage.setItem("fav", JSON.stringify(filterItem));
  };

  const favRecipe = (item) => {
    let filterItem = favItems.filter((recipe) => recipe._id !== item._id);
    favItems =
      favItems.filter((recipe) => recipe._id === item._id).length === 0
        ? [...favItems, item]
        : filterItem;
    localStorage.setItem("fav", JSON.stringify(favItems));
  };

  const handleRecipeClick = (id) => {
    let token = localStorage.getItem("token");
    if (token) {
      navigate(`/recipe/${id}`);
    } else {
      setIsOpen(true); // 👈 open modal instead
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <>
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
              onClick={() => handleRecipeClick(item._id)} // 👈 use new handler
              variants={item}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
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
                <p className="text-gray-500 text-sm mb-3">
                  By {item.createdBy?.name || "Anonymous"}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <BsStopwatchFill className="text-pink-500" />
                    <span>{item.time}</span>
                  </div>

                  {!path ? (
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        favRecipe(item);
                      }}
                      className="text-2xl focus:outline-none"
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <FaHeart
                        className={
                          favItems.some((res) => res._id === item._id)
                            ? "text-red-500"
                            : "text-gray-400 hover:text-red-400"
                        }
                      />
                    </motion.button>
                  ) : (
                    <div className="flex space-x-4">
                      <Link
                        to={`/editRecipe/${item._id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-500 hover:text-blue-400 transition-colors"
                      >
                        <FaEdit size={20} />
                      </Link>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          const confirmDelete = window.confirm(
                            "Are you sure you want to delete this recipe?"
                          );
                          if (confirmDelete) {
                            onDelete(item._id);
                          }
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
            <p className="text-gray-400">Try adding more delicious recipes!</p>
          </motion.div>
        )}
      </motion.div>

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <InputForm setIsOpen={() => setIsOpen(false)} />
        </Modal>
      )}
    </>
  );
}
