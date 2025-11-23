import { createStep } from "@mastra/core";
import z from "zod";
import { chefBot } from "../../agents/chefBot";

export const generateResponseStep = createStep({
  id: "generate-response",
  inputSchema: z.object({
    userQuery: z.string(),
    memoryContext: z.string(),
  }),
  outputSchema: z.object({
    userQuery: z.string(),
    assistantReply: z.string(), 
  }),
  execute: async ({ inputData }) => {
    const { userQuery, memoryContext } = inputData;

    const prompt = `
      ${memoryContext}

      ЗАПИТ: "${userQuery}"

      SEARCHRECIPESTOOL - правила:
      - Перекладай інгредієнти на англійську ("креветки" → "shrimp")
      - Додавай улюблені інгредієнти ТІЛЬКИ якщо вони підходять до запиту
        → Запит "піца" + любить шоколад = НЕ додавай шоколад
        → Запит "десерт" + любить шоколад = додай chocolate
        → Запит "що приготувати" + любить креветки = додай shrimp
      - Встановлюй diet="vegetarian/vegan" якщо потрібно
      - Встановлюй intolerances для алергій
      
      Для кількох релевантних інгредієнтів:
      1. Спочатку шукай з усіма разом: query="shrimp chicken"
      2. Якщо results порожній → шукай окремо для кожного

      Форматуй: нумерований список, **жирні назви**, ![зображення](url), порожні рядки.
    `;

    const result = await chefBot.generate([{ role: "user", content: prompt }]);
  
    return { 
      assistantReply: result.text, 
      userQuery: userQuery 
    };
  },
})