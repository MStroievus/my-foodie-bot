import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { Mem0Integration } from "@mastra/mem0";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Mem0 integration with user ID
const mem0 = new Mem0Integration({
  config: {
    apiKey: process.env.MEM0_API_KEY || "",
    user_id: "test-user-1",
  },
});

// Tool for saving new memories
export const mem0MemorizeTool = createTool({
  id: "mem0-memorize",
  description: "Save ONLY user's permanent food preferences to mem0. DO NOT save temporary requests or what user wants right now. Save only: favorite ingredients, dietary restrictions (vegan, vegetarian), allergies, dislikes. Example: Save 'User loves shrimp' but NOT 'User wants pizza'.",
  inputSchema: z.object({
    statement: z.string().describe("A statement to save into memory. Example: 'User is vegan' or 'User loves shrimp'. DO NOT save temporary requests like 'User wants pizza'."),
  }),
  execute: async ({ context }) => {
    void mem0.createMemory(context.statement).then(() => {
    });

    return { success: true };
  },
});

// Tool for remembering saved memories
export const mem0RememberTool = createTool({
  id: "mem0-remember",
  description: "Remember your agent memories that you've previously saved using the Mem0-memorize tool.",
  inputSchema: z.object({
    question: z.string().describe("Question used to look up the answer in saved memories. Example: 'food allergies'"),
  }),
  outputSchema: z.object({
    answer: z.string().describe("Remembered answer"),
  }),
  execute: async ({ context }) => {
    const memory = await mem0.searchMemory(context.question);
    return {
      answer: memory,
    };
  },
});
