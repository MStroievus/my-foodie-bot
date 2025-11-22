import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import MemoryClient from "mem0ai";

export const fetchMemoryStep = createStep({
  id: "fetch-memory",
  inputSchema: z.object({
    userQuery: z.string(),
  }),
  outputSchema: z.object({
    userQuery: z.string(),
    memoryContext: z.string(),
  }),
  execute: async ({ inputData, tracingContext }) => {
    const { userQuery } = inputData;
    const client = new MemoryClient({ apiKey: process.env.MEM0_API_KEY! });
    const results = await client.search(userQuery, { user_id: "test-user-1" });
    const memories = results.map((m: any) => m.memory).join("; ");
    const contextString = memories
      ? `Інформація про користувача: ${memories}`
      : "Немає попередньої інформації про користувача.";


    tracingContext.currentSpan?.update({
    metadata: {
      tag:'memory',
    },
  });
    return { userQuery, memoryContext: contextString };
  },
});