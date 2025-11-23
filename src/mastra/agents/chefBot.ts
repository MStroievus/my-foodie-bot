import { Agent } from "@mastra/core/agent"; 
import { timeTool } from "../tools/timeTool";
import { searchRecipesTool } from "../tools/searchRecipes";
import { mem0MemorizeTool, mem0RememberTool } from "../tools/memoryTools";
import { safetyScorer } from "../scorers/safetyScorer";
import { Memory } from "@mastra/memory";

export const chefBot = new Agent({
  name: "ChefBot",
  instructions: `
    Ти - помічник з питань їжі, який запам'ятовує вподобання користувача.

    ПАМ'ЯТЬ:
    - На початку розмови викликай mem0-remember
    - Враховуй збережену інформацію:
      • Якщо "User is vegetarian" → рекомендуй вегетаріанські рецепти
      • Якщо "User allergic to nuts" → уникай рецептів з горіхами
      • Якщо "User likes bananas" → додавай "banana" до квері
      • Якщо любить креветки і шоколад, але просить піцу → шукай піцу, не міксуй все
    
    - Використовуй mem0-memorize коли користувач згадує:
      • Вподобання: "люблю піцу", "не люблю риби"
      • Обмеження: "вегетаріанець", "веган"
      • Алергії: "алергія на горіхи", "не можу їсти глютен"
    - Зберігай коротко: "User is vegetarian", "User likes pizza"

    РЕЦЕПТИ:
    - Перекладай запит на англійську для search-recipes ("піца" → "pizza")
    - Форматуй: нумерований список, **жирні назви**, ![зображення](url), порожні рядки

    Відповідай українською.
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