import { registerApiRoute } from "@mastra/core/server";

export const workflowEndpoint = registerApiRoute("/workflow", {
  method: "POST",
  handler: async (c) => {
    const body = await c.req.json();
    const { userQuery } = body;

    const mastra = c.get("mastra");
    const workflow = mastra.getWorkflow("foodWorkflow");
    const run = await workflow.createRunAsync();

    const result = await run.start({
      inputData: { userQuery },
    });

    if (result.status === "success") {
      return c.json({
        reply: result.result.reply,
      });
    }

    return c.json(
      {
        error: "Workflow execution failed",
      },
      500
    );
  },
});
