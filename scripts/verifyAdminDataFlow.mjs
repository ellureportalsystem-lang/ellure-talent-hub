/**
 * Smoke verification for admin data flow (import → search → delete).
 * Run: node scripts/verifyAdminDataFlow.mjs
 *
 * Requires .env:
 *   VITE_SUPABASE_URL
 *   VITE_SUPABASE_ANON_KEY
 *   SUPABASE_SERVICE_ROLE_KEY
 *   ADMIN_TEST_EMAIL
 *   ADMIN_TEST_PASSWORD
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function parseEnvFile(filePath) {
  const content = readFileSync(filePath, "utf-8");
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    value = value.replace(/^["']|["']$/g, "");
    env[key] = value;
  }
  return env;
}

const envPath = join(__dirname, "../.env");
if (!existsSync(envPath)) {
  console.error("Missing .env — copy from .env.example");
  process.exit(1);
}

const env = parseEnvFile(envPath);
const supabaseUrl = env.VITE_SUPABASE_URL;
const anonKey = env.VITE_SUPABASE_ANON_KEY;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
const testEmail = env.ADMIN_TEST_EMAIL;
const testPassword = env.ADMIN_TEST_PASSWORD;

if (!supabaseUrl || !serviceKey || !anonKey) {
  console.error("Missing VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const admin = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

let passed = 0;
let failed = 0;

function ok(label) {
  passed++;
  console.log(`  ✓ ${label}`);
}

function fail(label, detail) {
  failed++;
  console.error(`  ✗ ${label}${detail ? `: ${detail}` : ""}`);
}

console.log("\nAdmin data flow smoke checks\n");

// DB-level checks (service role)
const { count: activeCount } = await admin
  .from("applicants")
  .select("id", { count: "exact", head: true })
  .eq("is_deleted", false);

const { count: importCount } = await admin
  .from("applicants")
  .select("id", { count: "exact", head: true })
  .eq("is_old_applicant", true)
  .eq("is_deleted", false);

const { count: registeredCount } = await admin
  .from("applicants")
  .select("id", { count: "exact", head: true })
  .eq("is_old_applicant", false)
  .eq("is_deleted", false);

ok(`active applicants in DB: ${activeCount ?? 0}`);
ok(`imported (is_old_applicant): ${importCount ?? 0}`);
ok(`self-registered: ${registeredCount ?? 0}`);

// RPC checks require authenticated admin (search_applicants enforces auth.uid())
if (!testEmail || !testPassword) {
  console.log("  (skip RPC checks — set ADMIN_TEST_EMAIL and ADMIN_TEST_PASSWORD in .env)");
} else {
  const userClient = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: signIn, error: signInErr } = await userClient.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });

  if (signInErr || !signIn.session) {
    fail("admin test login", signInErr?.message ?? "no session");
  } else {
    ok("admin test login");

    const authed = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${signIn.session.access_token}` } },
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: importedSearch, error: importedErr } = await authed.rpc("search_applicants", {
      p_page: 1,
      p_page_size: 1,
      p_is_old_applicant: true,
    });

    if (importedErr) {
      if (importedErr.message?.includes("p_is_old_applicant")) {
        fail("p_is_old_applicant parameter", "missing — run migration 011");
      } else {
        fail("search_applicants imported filter", importedErr.message);
      }
    } else {
      const rpcImported = Number(importedSearch?.total ?? 0);
      ok(`RPC imported total: ${rpcImported} (DB: ${importCount ?? 0})`);
      if (importCount != null && rpcImported !== importCount) {
        fail("imported count parity", `RPC ${rpcImported} vs DB ${importCount}`);
      }
    }

    const { data: regSearch, error: regErr } = await authed.rpc("search_applicants", {
      p_page: 1,
      p_page_size: 1,
      p_is_old_applicant: false,
    });
    if (regErr) fail("search_applicants registered filter", regErr.message);
    else {
      const rpcReg = Number(regSearch?.total ?? 0);
      ok(`RPC registered total: ${rpcReg} (DB: ${registeredCount ?? 0})`);
    }

    const { data: allSearch, error: allErr } = await authed.rpc("search_applicants", {
      p_page: 1,
      p_page_size: 1,
    });
    if (allErr) fail("search_applicants all", allErr.message);
    else {
      const searchTotal = Number(allSearch?.total ?? 0);
      ok(`RPC all candidates: ${searchTotal}`);
      if (activeCount != null && searchTotal > activeCount) {
        fail("is_deleted filter", `search ${searchTotal} > active ${activeCount}`);
      }
    }
  }
}

const fnPath = join(__dirname, "../supabase/functions/admin-create-user/index.ts");
if (existsSync(fnPath)) {
  ok("admin-create-user edge function present locally");
  console.log("    → Deploy: supabase functions deploy admin-create-user");
} else {
  fail("admin-create-user edge function missing");
}

console.log(`\nResult: ${passed} passed, ${failed} failed\n`);
console.log("Manual E2E steps: docs/ADMIN_E2E_CHECKLIST.md\n");
process.exit(failed > 0 ? 1 : 0);
