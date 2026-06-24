import fs from "node:fs";
import path from "node:path";

const names = process.argv.slice(2);
if (!names.length) {
  console.error("Usage: node print-mcp-args.mjs <function-name> [...]");
  process.exit(1);
}

for (const name of names) {
  const file = path.resolve("deploy-batch", `mcp-${name}.json`);
  const payload = JSON.parse(fs.readFileSync(file, "utf8"));
  console.log(`---${name}---`);
  console.log(JSON.stringify({
    name: payload.name,
    entrypoint_path: payload.entrypoint_path,
    verify_jwt: payload.verify_jwt,
    files: payload.files,
  }));
}
