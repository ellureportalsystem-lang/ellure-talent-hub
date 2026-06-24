import fs from "node:fs";
import path from "node:path";

const names = [
  "nvite-response",
  "send-nvite",
  "on-applicant-registered",
  "on-application-submitted",
  "on-application-stage-changed",
  "on-client-approved",
  "expire-subscriptions",
  "run-job-alerts",
  "run-saved-search-alerts",
  "verify-payment",
];

const batchDir = path.resolve("deploy-batch");
const results = [];

for (const name of names) {
  const file = path.join(batchDir, `mcp-${name}.json`);
  try {
    const payload = JSON.parse(fs.readFileSync(file, "utf8"));
    results.push({
      name: payload.name,
      entrypoint_path: payload.entrypoint_path,
      verify_jwt: payload.verify_jwt,
      fileCount: payload.files.length,
      bytes: fs.statSync(file).size,
    });
  } catch (e) {
    results.push({ name, error: String(e) });
  }
}

console.log(JSON.stringify(results, null, 2));
