import { registerApiRoute } from "@mastra/core/server";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const frontendRoute = registerApiRoute("/", {
  method: "GET",
  handler: async (c) => {
    try {
      // Try multiple possible paths for the public folder
      let htmlPath = join(process.cwd(), "public", "index.html");
      
      // If not found, try relative to this file
      try {
        readFileSync(htmlPath);
      } catch {
        htmlPath = join(__dirname, "..", "..", "..", "public", "index.html");
      }
      
      const html = readFileSync(htmlPath, "utf-8");
      
      return c.html(html);
    } catch (error) {
      console.error("Error serving frontend:", error);
      return c.text("Frontend not found. Server is running correctly.", 404);
    }
  },
});