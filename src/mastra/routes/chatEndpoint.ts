import { registerApiRoute } from "@mastra/core/server";

export const chatEndpoint =  registerApiRoute("/chat", {
    method: "POST",
    handler: async (c) => {
      const body = await c.req.json();


      const { message, userId = "test-user-1" } = body;
      
      const mastra = c.get("mastra");
      const agent = mastra.getAgent("chefBot");

      const result = await agent.generate([{ role: "user", content: message }]);

      return c.json({
        reply: result.text,
        userId,
      });
    },
  })