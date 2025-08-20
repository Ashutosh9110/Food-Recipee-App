const { InferenceClient } = require("@huggingface/inference");
const { jsonrepair } = require("jsonrepair");

const hf = new InferenceClient(process.env.HF_API_TOKEN);

async function improveRecipe(recipeText) {
  try {
    const res = await hf.chatCompletion({
      model: "meta-llama/Llama-3.1-8B-Instruct",
      messages: [
        {
          role: "system",
          content: `You are a culinary nutritionist. 
Rewrite any recipe to increase protein and reduce fat while preserving flavor. 
Always respond with **valid JSON only** in this structure:

{
  "title": "string",
  "ingredients": ["list", "of", "ingredients"],
  "steps": ["list of preparation steps"],
  "macros": {
    "protein": "xx g",
    "fat": "xx g",
    "carbs": "xx g",
    "calories": "xx kcal"
  }
}

⚠️ DO NOT include explanations, markdown, or text outside the JSON.
If you cannot produce JSON, return {}.`
        },
        { role: "user", content: recipeText }
      ],
      max_tokens: 1500, // increase so JSON doesn’t truncate
      temperature: 0.7
    });

    const raw = res.choices?.[0]?.message?.content?.trim() ?? "";
    let cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();

    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) {
      console.error("No JSON found in model response:", raw);
      return {};
    }

    let json;
    try {
      json = JSON.parse(match[0]);
    } catch {
      // auto-fix incomplete/broken JSON
      try {
        json = JSON.parse(jsonrepair(match[0]));
      } catch (err) {
        console.error("Even jsonrepair failed:", err);
        return {};
      }
    }

    return json;
  } catch (error) {
    console.error("HF chatCompletion failed:", error?.message || error);
    return {};
  }
}

module.exports = { improveRecipe };
