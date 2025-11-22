import { createWorkflow } from "@mastra/core";
import { z } from "zod";
import { fetchMemoryStep } from "./step_1";
import { generateResponseStep } from "./step_2";
import { storeConversationStep } from "./step_3";

export const foodWorkflow = createWorkflow({
  id: "food-workflow",
  inputSchema: z.object({
    userQuery: z.string(),
  }),
  outputSchema: z.object({
    reply: z.string(),
  }),
})
  .then(fetchMemoryStep)      
  .then(generateResponseStep)  
  .then(storeConversationStep)  
  .commit();