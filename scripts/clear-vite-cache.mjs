import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const cacheDir = join(process.cwd(), "node_modules", ".vite");

if (existsSync(cacheDir)) {
  try {
    rmSync(cacheDir, {
      recursive: true,
      force: true,
      maxRetries: 5,
      retryDelay: 200,
    });
    console.log("[vite] Cleared node_modules/.vite cache");
  } catch (err) {
    console.warn(
      "[vite] Could not clear cache (stop the dev server first):",
      err instanceof Error ? err.message : err
    );
  }
}
