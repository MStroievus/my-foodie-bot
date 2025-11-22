import { createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { MemoryClient } from "mem0ai";

export const storeConversationStep = createStep({
  id: "store-conversation",
  inputSchema: z.object({
    userQuery: z.string(),
    assistantReply: z.string(),
  }),
  outputSchema: z.object({
    reply: z.string(), 
  }),
  execute: async ({ inputData }) => {
    const { userQuery, assistantReply } = inputData;
    const client = new MemoryClient({ apiKey: process.env.MEM0_API_KEY! });

    const messages = [
        { role: "user" as const, content: userQuery },
        { role: "assistant" as const, content: assistantReply },
      ];
    
  await client.add(messages, { user_id: "test-user-1" });
  return { reply: assistantReply };
  
  },
});