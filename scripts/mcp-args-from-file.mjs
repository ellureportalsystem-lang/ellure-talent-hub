import fs from "node:fs";
import path from "node:path";

const name = process.argv[2];
if (!name) {
  console.error("Usage: node mcp-args-from-file.mjs <function-name>");
  process.exit(1);
}

const file = path.resolve("deploy-batch", `mcp-${name}.json`);
const payload = JSON.parse(fs.readFileSync(file, "utf8"));
process.stdout.write(JSON.stringify({
  name: payload.name,
  entrypoint_path: payload.entrypoint_path,
  verify_jwt: payload.verify_jwt,
  files: payload.files,
}));
