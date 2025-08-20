import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function toList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") {
    // split by newline or comma/semicolon, trim blanks
    return value
      .split(/\r?\n|,|;/)
      .map(s => s.trim())
      .filter(Boolean);
  }
  return [];
}

function toSteps(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") {
    // split on newlines or numbered bullets like "1. Step"
    return value
      .split(/\r?\n+(?=\d+\.|\-|\•)?|\r?\n|(?<=\.)\s+(?=[A-Z])/)
      .map(s => s.replace(/^\s*(\d+\.|\-|\•)\s*/, "").trim())
      .filter(Boolean);
  }
  return [];
}

export default function RecipeDetails() {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [improved, setImproved] = useState(null); // was "", now object or null
  const [improving, setImproving] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      setLoading(true);
      try {
        const recipeResponse = await axios.get(`http://localhost:5000/recipe/${id}`);
        const recipeData = recipeResponse.data || {};

        // Normalize fields we render
        const normalized = {
          ...recipeData,
          title: recipeData.title || "Untitled Recipe",
          ingredients: toList(recipeData.ingredients),
          instructions: toSteps(recipeData.instructions),
        };

        setRecipe(normalized);

        // Try to hydrate author email; silence 404 noise
        if (recipeData.createdBy) {
          try {
            const userResponse = await axios.get(`http://localhost:5000/user/${recipeData.createdBy}`);
            if (userResponse.data?.email) {
              setRecipe(prev => ({ ...prev, email: userResponse.data.email }));
            }
          } catch (e) {
            if (e?.response?.status !== 404) {
              console.log("Could not fetch user details:", e?.message || e);
            }
            // else: ignore 404
          }
        }
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  const improveRecipe = async () => {
    if (!recipe) return;
    setImproving(true);
    try {
      // Build a readable text for the model regardless of array/string shapes
      const instructionText = recipe.instructions?.length
        ? recipe.instructions.join("\n")
        : "";

      const ingredientText = recipe.ingredients?.length
        ? recipe.ingredients.join("\n")
        : "";

      const prompt = [
        `Title: ${recipe.title}`,
        ingredientText ? `Ingredients:\n${ingredientText}` : "",
        instructionText ? `Instructions:\n${instructionText}` : "",
      ]
        .filter(Boolean)
        .join("\n\n");

      const res = await fetch("http://localhost:5000/ai/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipe: prompt }),
      });

      const data = await res.json();

      // backend returns { improvedRecipe: {...} } or string on error
      const out = data.improvedRecipe;
      setImproved(
        out && typeof out === "object"
          ? {
              title: out.title || "Healthier Version",
              ingredients: toList(out.ingredients),
              steps: toSteps(out.steps),
              macros: out.macros || {},
            }
          : null
      );
    } catch (err) {
      console.error(err);
      setImproved(null);
    }
    setImproving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-red-500">Recipe not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* LEFT: Original Recipe */}
      <div className="bg-gray-800 p-6 rounded-lg text-white shadow-lg">
        <h2 className="text-2xl font-bold">{recipe.title}</h2>
        <p className="text-sm text-gray-400 mt-1">
          By: {recipe.email || recipe.author || "Unknown"}
        </p>

        {recipe.image && (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="mt-4 w-full rounded-lg object-cover"
          />
        )}

        <h3 className="mt-6 font-semibold">Ingredients</h3>
        {recipe.ingredients.length ? (
          <ul className="list-disc list-inside">
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-300">No ingredients provided.</p>
        )}

        <h3 className="mt-6 font-semibold">Instructions</h3>
        {recipe.instructions.length ? (
          <ol className="list-decimal list-inside space-y-1">
            {recipe.instructions.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        ) : (
          <p className="text-gray-300">No instructions provided.</p>
        )}
      </div>

      {/* RIGHT: Healthier Version */}
      <div className="bg-gray-900 p-6 rounded-lg text-white shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-green-400">Make It Healthier</h3>
        <button
          onClick={improveRecipe}
          disabled={improving}
          className={`px-4 py-2 rounded-md ${improving ? "bg-green-700 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
        >
          {improving ? "Improving..." : "Make Healthier"}
        </button>

        {/* Placeholder panel so layout stays balanced before generation */}
        {!improved && !improving && (
          <div className="mt-4 p-4 border border-gray-700 rounded-lg text-gray-300">
            Click “Make Healthier” to generate a higher-protein, lower-fat version here.
          </div>
        )}

        {improved && (
          <div className="mt-4 p-3 bg-gray-800 rounded-md">
            <h3 className="text-lg font-bold">{improved.title}</h3>

            <h4 className="mt-2 font-semibold">Ingredients</h4>
            {improved.ingredients?.length ? (
              <ul className="list-disc list-inside">
                {improved.ingredients.map((ing, i) => (
                  <li key={i}>{ing}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-300">No ingredients returned.</p>
            )}

            <h4 className="mt-2 font-semibold">Steps</h4>
            {improved.steps?.length ? (
              <ol className="list-decimal list-inside">
                {improved.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            ) : (
              <p className="text-gray-300">No steps returned.</p>
            )}

            <h4 className="mt-2 font-semibold">Macros</h4>
            <p>Protein: {improved.macros?.protein ?? "—"}</p>
            <p>Fat: {improved.macros?.fat ?? "—"}</p>
            <p>Carbs: {improved.macros?.carbs ?? "—"}</p>
            <p>Calories: {improved.macros?.calories ?? "—"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
