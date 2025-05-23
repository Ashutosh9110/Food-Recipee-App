import { useRef } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import AddFoodRecipe from './pages/AddFoodRecipe'
import EditRecipe from './pages/EditRecipe'
import RecipeDetails from './pages/RecipeDetails'
import { baseUrl } from '../url'
import GradientBackground from './components/GradientBackground'
import FluidCursor from './components/FluidCursor'
import Navbar from './components/Navbar'

function App() {
  const containerRef = useRef(null)

  return (
    <BrowserRouter>
      <div className="relative bg-gray-900 text-gray-100 min-h-screen" ref={containerRef}>
        <GradientBackground />
        <FluidCursor />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/addRecipe" element={<AddFoodRecipe />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
          <Route path="/editRecipe/:id" element={<EditRecipe />} />
          <Route path="/myRecipe" element={<Home />} />
          <Route path="/favRecipe" element={<Home />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
