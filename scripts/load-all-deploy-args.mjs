import fs from "node:fs";
import path from "node:path";

const names = [
  "generate-invoice",
  "on-client-signup",
  "on-message-received",
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

const dir = path.resolve("deploy-args");
const results = [];

for (const name of names) {
  const file = path.join(dir, `${name}.args.json`);
  const payload = JSON.parse(fs.readFileSync(file, "utf8"));
  results.push({
    name: payload.name,
    entrypoint_path: payload.entrypoint_path,
    verify_jwt: payload.verify_jwt,
    files: payload.files,
  });
}

process.stdout.write(JSON.stringify(results));
