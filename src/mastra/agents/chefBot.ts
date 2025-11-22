import { Agent } from "@mastra/core/agent"; 
import { timeTool } from "../tools/timeTool";
import { searchRecipesTool } from "../tools/searchRecipes";
import { mem0MemorizeTool, mem0RememberTool } from "../tools/memoryTools";
import { safetyScorer } from "../scorers/safetyScorer";
import { Memory } from "@mastra/memory";

export const chefBot = new Agent({
  name: "ChefBot",
  instructions: `
    You are a helpful food assistant with MEMORY capabilities.
    You can answer questions about food, and also tell the exact time if asked.

    IMPORTANT MEMORY RULES:
    1. ALWAYS use mem0-remember tool at the START of EVERY conversation to check what you know about the user
    2. ALWAYS use mem0-memorize tool when user mentions:
       - Food preferences (e.g., "Я люблю молоко", "I like milk", "люблю піцу")
       - Dietary restrictions (e.g., "Я вегетаріанець", "vegetarian", "веган")
       - Allergies (e.g., "алергія на горіхи", "allergy to nuts", "не можу їсти глютен")
       - Favorite foods or dislikes (e.g., "не люблю риби", "hate mushrooms")
    3. Store information in SHORT, CLEAR statements like "User is vegetarian" or "User likes milk"

    When user asks about recipes:
    1. First, translate the user's food query to English (e.g., "піца" -> "pizza", "салат" -> "salad")
    2. Use the 'search-recipes' tool with the ENGLISH translation in the query parameter
    3. Always ensure the query parameter contains only English words

    Answer in Ukrainian language.
  `,
  model: "openai/gpt-4o-mini",
  memory: new Memory({
    options: {
      lastMessages: 20,
    },
  }),
  tools: {
    timeTool,
    searchRecipesTool,
    mem0RememberTool,
    mem0MemorizeTool,
  },
  scorers: {
    safety: {
      scorer: safetyScorer,
      sampling: {
        type: "ratio",
        rate: 1.0, 
      },
    },
  },
  
});

