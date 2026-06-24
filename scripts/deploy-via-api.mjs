import fs from "node:fs";
import path from "node:path";

const projectRef = "togxwenqypmxohqguscg";
const token = process.env.SUPABASE_ACCESS_TOKEN;
if (!token) {
  console.error("SUPABASE_ACCESS_TOKEN not set");
  process.exit(1);
}

const name = process.argv[2];
if (!name) {
  console.error("Usage: node deploy-via-api.mjs <function-name>");
  process.exit(1);
}

const payload = JSON.parse(
  fs.readFileSync(path.resolve("deploy-batch", `mcp-${name}.json`), "utf8"),
);

const metadata = {
  entrypoint_path: payload.entrypoint_path,
  name: payload.name,
  verify_jwt: payload.verify_jwt,
};

const form = new FormData();
form.append("metadata", JSON.stringify(metadata));

for (const file of payload.files) {
  form.append("file", new Blob([file.content], { type: "text/plain" }), file.name);
}

const url = `https://api.supabase.com/v1/projects/${projectRef}/functions/deploy?slug=${encodeURIComponent(name)}`;
const res = await fetch(url, {
  method: "POST",
  headers: { Authorization: `Bearer ${token}` },
  body: form,
});

const text = await res.text();
let body;
try {
  body = JSON.parse(text);
} catch {
  body = text;
}

if (!res.ok) {
  console.error(JSON.stringify({ name, status: "FAILED", http: res.status, error: body }));
  process.exit(1);
}

console.log(JSON.stringify({ name, status: body.status || "ACTIVE", version: body.version, id: body.id }));
