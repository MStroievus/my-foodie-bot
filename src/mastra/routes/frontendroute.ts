import { registerApiRoute } from "@mastra/core/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

export const frontendRoute = registerApiRoute("/", {
  method: "GET",
  handler: async (c) => {
    try {
      // Try multiple possible paths
      const possiblePaths = [
        join(process.cwd(), "public", "index.html"),                    // Root level
        join(process.cwd(), "..", "public", "index.html"),             // One level up
        join(process.cwd(), "..", "..", "public", "index.html"),       // Two levels up
        join(process.cwd(), ".mastra", "output", "public", "index.html"), // In build output
      ];

      let htmlPath = null;
      for (const path of possiblePaths) {
        if (existsSync(path)) {
          htmlPath = path;
          console.log(`Found index.html at: ${path}`);
          break;
        }
      }

      if (!htmlPath) {
        console.error("Could not find index.html in any of the expected locations:");
        possiblePaths.forEach(p => console.error(`  - ${p}`));
        throw new Error("index.html not found");
      }

      const html = readFileSync(htmlPath, "utf-8");
      return c.html(html);
      
    } catch (error) {
      console.error("Error serving frontend:", error);
      console.error("Current working directory:", process.cwd());
      
      return c.text(
        `Frontend not found. Server is running at ${process.cwd()}. 
        Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        404
      );
    }
  },
});