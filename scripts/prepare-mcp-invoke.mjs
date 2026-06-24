import fs from "node:fs";
import path from "node:path";

const names = process.argv.slice(2);
const batchDir = path.resolve("deploy-batch");
const resultsPath = path.resolve("deploy-results.json");

function loadResults() {
  if (!fs.existsSync(resultsPath)) return [];
  try {
    return JSON.parse(fs.readFileSync(resultsPath, "utf8"));
  } catch {
    return [];
  }
}

function saveResults(results) {
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
}

const results = loadResults();

for (const name of names) {
  const file = path.join(batchDir, `mcp-${name}.json`);
  if (!fs.existsSync(file)) {
    results.push({ name, status: "FAILED", error: `Missing ${file}` });
    continue;
  }
  const payload = JSON.parse(fs.readFileSync(file, "utf8"));
  fs.writeFileSync(path.join(batchDir, `_invoke-${name}.json`), JSON.stringify({
    name: payload.name,
    entrypoint_path: payload.entrypoint_path,
    verify_jwt: payload.verify_jwt,
    files: payload.files,
  }));
  console.log(`READY ${name} (${payload.files.length} files)`);
}

saveResults(results);
