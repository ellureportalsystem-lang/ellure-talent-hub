import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const names = process.argv.slice(2);
if (!names.length) {
  console.error("Usage: node mcp-deploy-runner.mjs <function-name> [...]");
  process.exit(1);
}

const dir = path.resolve("deploy-args");
const resultsPath = path.resolve("deploy-results.json");
let results = [];
if (fs.existsSync(resultsPath)) {
  try {
    results = JSON.parse(fs.readFileSync(resultsPath, "utf8"));
  } catch {
    results = [];
  }
}

for (const name of names) {
  const file = path.join(dir, `${name}.args.json`);
  if (!fs.existsSync(file)) {
    results.push({ name, status: "FAILED", error: `Missing ${file}` });
    continue;
  }
  const payload = JSON.parse(fs.readFileSync(file, "utf8"));
  const argsFile = path.resolve("deploy-batch", `${name}.mcp-args.json`);
  fs.mkdirSync(path.dirname(argsFile), { recursive: true });
  fs.writeFileSync(argsFile, JSON.stringify(payload), "utf8");
  console.log(`PREPARED ${name} -> ${argsFile}`);
}

fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
console.log(`Prepared ${names.length} MCP arg files`);
