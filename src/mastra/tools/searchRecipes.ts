import { createTool } from "@mastra/core/tools";
import { z } from "zod";

const recipeSchema = z.object({
  id: z.number(),
  title: z.string(),
  image: z.string().optional(),
});

export const searchRecipesTool = createTool({
  id: "search-recipes",
  description: "Searches for food recipes based on dish name or ingredients. Use this when the user asks for recipe ideas, wants to find dishes with specific ingredients, or needs recipes that match dietary restrictions (vegan, keto, vegetarian) or avoid allergens (gluten, nuts, dairy, etc.).",

  // Input data: What the LLM should provide
  inputSchema: z.object({
    query: z.string().describe("Name of the dish or main ingredient, for example: 'pasta', 'chicken', 'tomato soup'"),
    intolerances: z.string().optional().describe("Allergens to exclude, comma-separated (e.g., 'gluten, peanut, dairy')"),
    diet: z.string().optional().describe("Dietary restriction (e.g., 'vegetarian', 'vegan', 'ketogenic', 'paleo')"),
  }),

  // Output data: What we return to the LLM
  outputSchema: z.object({
    results: z.array(recipeSchema),
  }),

  execute: async ({ context }) => {
    // Get parameters that the LLM filled in
    const { query, intolerances, diet } = context;

    const apiKey = process.env.SPOONACULAR_API_KEY;

    // Build the URL
    const url = new URL("https://api.spoonacular.com/recipes/complexSearch");
    url.searchParams.append("apiKey", apiKey!);
    url.searchParams.append("query", query);
    url.searchParams.append("number", "3"); // Limit to 3 recipes to save tokens
    
    if (intolerances) url.searchParams.append("intolerances", intolerances);
    if (diet) url.searchParams.append("diet", diet);


    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`Spoonacular API Error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        results: data.results.map((r: any) => ({
          id: r.id,
          title: r.title,
          image: r.image
        }))
      };

    } catch (error) {
      console.error("Error fetching recipes:", error);
      return { results: [] }; // Return empty array in case of error
    }
  },
});