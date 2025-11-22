import { Mastra } from "@mastra/core/mastra";
import { DefaultExporter } from "@mastra/core/ai-tracing"; 
import { LangfuseExporter } from "@mastra/langfuse";
import { LibSQLStore } from "@mastra/libsql";
import { PinoLogger } from "@mastra/loggers";
import { chefBot } from "./agents/chefBot";
import { safetyScorer } from "./scorers/safetyScorer";
import { foodWorkflow } from "./workflows/foodWorkflow/foodWorkflow";

export const mastra = new Mastra({
  agents: { chefBot,  },
  workflows: { foodWorkflow },
  scorers: { safetyScorer },

  storage: new LibSQLStore({
    url: "file:mastra.db",
  }),

  logger: new PinoLogger(),

  observability: {
    default: {
      enabled: false,
    },
    configs: {
      langfuse: {
        serviceName: "foodie-bot",
        includeInternalSpans: false,
        runtimeContextKeys: ["userId", "sessionId", "environment"],
        exporters: [
          new DefaultExporter(),
          new LangfuseExporter({
            publicKey: process.env.LANGFUSE_PUBLIC_KEY!,
            secretKey: process.env.LANGFUSE_SECRET_KEY!,
            baseUrl: process.env.LANGFUSE_BASE_URL!,
          }),
        ],
      },
    },
    configSelector: () => "langfuse",
  },
});