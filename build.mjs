import * as esbuild from "esbuild";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function build() {
  try {
    await esbuild.build({
      entryPoints: ["src/index.ts"],
      bundle: true,
      platform: "node",
      target: "node22",
      format: "esm",
      outfile: "dist/index.js",
      outExtension: { ".js": ".mjs" },
      logLevel: "info",
      alias: {
        "@workspace/api-zod": path.resolve(__dirname, "lib/api-zod/src/index.ts"),
        // We will mock other workspace dependencies if needed or point to their source if available
      },
      external: [
        "*.node",
        "better-sqlite3",
        "pg-native",
        "@workspace/db",
        "@workspace/db/schema"
      ],
      sourcemap: true,
      minify: process.env.NODE_ENV === "production",
    });
    console.log("Build completed successfully!");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

build();
