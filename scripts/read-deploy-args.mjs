import fs from "node:fs";
import path from "node:path";

const name = process.argv[2];
if (!name) {
  console.error("Usage: node read-deploy-args.mjs <function-name>");
  process.exit(1);
}

const file = path.resolve("deploy-args", `${name}.args.json`);
const payload = JSON.parse(fs.readFileSync(file, "utf8"));
process.stdout.write(JSON.stringify(payload));
