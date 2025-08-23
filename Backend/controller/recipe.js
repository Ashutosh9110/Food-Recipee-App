const Recipes=require("../models/recipe")
const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/images")
    },
    filename: function (req, file, cb) {
      const filename = Date.now() + '-' + file.fieldname
      cb(null, filename)
    }
  })
  
  const upload = multer({ storage: storage })

  const getRecipes = async (req, res) => {
    try {
      const recipes = await Recipes.find().populate("createdBy", "name email"); 
      return res.json(recipes);
    } catch (err) {
      console.error("Error fetching recipes:", err);
      res.status(500).json({ message: "Error fetching recipes" });
    }
  };
  
  const getRecipe = async (req, res) => {
    try {
      const recipe = await Recipes.findById(req.params.id).populate("createdBy", "name email");
      if (!recipe) return res.status(404).json({ message: "Recipe not found" });
      res.json(recipe);
    } catch (err) {
      res.status(500).json({ message: "Error fetching recipe" });
    }
  };
  

const addRecipe=async(req,res)=>{
    console.log(req.user)
    const {title,ingredients,instructions,time}=req.body 

    if(!title || !ingredients || !instructions)
    {
        res.json({message:"Required fields can't be empty"})
    }

    const newRecipe=await Recipes.create({
        title,ingredients,instructions,time,coverImage:req.file.filename,
        createdBy:req.user.id
    })
   return res.json(newRecipe)
}

const editRecipe=async(req,res)=>{
    const {title,ingredients,instructions,time}=req.body 
    let recipe=await Recipes.findById(req.params.id)

    try{
        if(recipe){
            let coverImage=req.file?.filename ? req.file?.filename : recipe.coverImage
            await Recipes.findByIdAndUpdate(req.params.id,{...req.body,coverImage},{new:true})
            res.json({title,ingredients,instructions,time})
        }
    }
    catch(err){
        return res.status(404).json({message:err})
    }
    
}
const deleteRecipe=async(req,res)=>{
    try{
        await Recipes.deleteOne({_id:req.params.id})
        res.json({status:"ok"})
    }
    catch(err){
        return res.status(400).json({message:"error"})
    }
}




module.exports={getRecipes,getRecipe,addRecipe,editRecipe,deleteRecipe,upload}