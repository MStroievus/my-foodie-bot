import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const timeTool = createTool({
  id: "get-current-time", // Unique tool ID
  description: "Returns the current date and time. Use this when the user asks 'what time is it', 'what day is it', etc.",

  inputSchema: z.object({}),

  // Define what the function will return (for typing)
  outputSchema: z.object({
    currentTime: z.string(),
  }),

  execute: async ({  }) => {
    const now = new Date();

    const timeString = now.toLocaleString("uk-UA", {
      timeZone: "Europe/Kiev",
      dateStyle: "full",
      timeStyle: "medium",
    });

    // Return an object that matches outputSchema
    return {
      currentTime: timeString,
    };
  },
});