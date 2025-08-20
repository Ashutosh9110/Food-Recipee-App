const { improveRecipe } = require("../utils/huggingface");

async function improveRecipeController(req, res) {
  try {
    const { recipe } = req.body;

    if (!recipe) {
      return res.status(400).json({ error: "Recipe text is required" });
    }

    const improved = await improveRecipe(recipe);

    // ✅ Return JSON directly
    res.json({ improvedRecipe: improved });
  } catch (err) {
    console.error("Improve Recipe API Error:", err?.message || err);
    res.status(500).json({ error: "Failed to improve recipe" });
  }
}

module.exports = { improveRecipeController };
