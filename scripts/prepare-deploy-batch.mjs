import fs from "node:fs";
import path from "node:path";

const names = process.argv.slice(2);
if (!names.length) {
  console.error("Usage: node deploy-one-args.mjs <function-name> [...]");
  process.exit(1);
}

const dir = path.resolve("deploy-args");
for (const name of names) {
  const file = path.join(dir, `${name}.args.json`);
  if (!fs.existsSync(file)) {
    console.error(`Missing ${file}`);
    process.exit(1);
  }
  const payload = JSON.parse(fs.readFileSync(file, "utf8"));
  const out = path.resolve("deploy-batch", `${name}.json`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(payload), "utf8");
  console.log(`${name}: ${payload.files.length} files, verify_jwt=${payload.verify_jwt}`);
}
