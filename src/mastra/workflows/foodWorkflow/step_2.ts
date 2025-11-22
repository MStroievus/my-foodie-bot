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

      ЗАПИТ КОРИСТУВАЧА: "${userQuery}"

      Відповідь на запит, враховуючи інформацію про користувача вище.
      Якщо треба знайти рецепт, використовуй searchRecipesTool.

      ВАЖЛИВО: Форматуй відповідь правильно:
      - Кожен рецепт на новому рядку
      - Використовуй нумерований список: 1. 2. 3.
      - Назву рецепту роби жирною: **Назва**
      - Додавай картинки: ![Назва](url)
      - Додавай порожні рядки між пунктами
    `;

    const result = await chefBot.generate([{ role: "user", content: prompt }]);
  
    return { 
      assistantReply: result.text, 
      userQuery: userQuery 
    };
  },
});