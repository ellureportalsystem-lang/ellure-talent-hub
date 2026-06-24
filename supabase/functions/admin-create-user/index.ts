import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { jsonResponse, handleOptions } from "../_shared/cors.ts";

type CreateAdminBody = {
  email?: string;
  password?: string;
  full_name?: string;
  phone?: string | null;
};

Deno.serve(async (req) => {
  const opt = handleOptions(req);
  if (opt) return opt;

  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return jsonResponse({ error: "Unauthorized" }, 401);

  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const { data: { user: caller } } = await supabase.auth.getUser(authHeader.slice(7));
  if (!caller) return jsonResponse({ error: "Unauthorized" }, 401);

  const { data: callerProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", caller.id)
    .single();

  if (callerProfile?.role !== "admin") {
    return jsonResponse({ error: "Admin access required" }, 403);
  }

  const body = (await req.json().catch(() => ({}))) as CreateAdminBody;
  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";
  const fullName = body.full_name?.trim() ?? "";
  const phone = body.phone?.trim() || null;

  if (!email) return jsonResponse({ error: "email is required" }, 400);
  if (password.length < 8) return jsonResponse({ error: "Password must be at least 8 characters" }, 400);
  if (!fullName) return jsonResponse({ error: "full_name is required" }, 400);

  const { data: existingAdmin } = await supabase
    .from("admin_users")
    .select("id, status")
    .eq("email", email)
    .maybeSingle();

  if (existingAdmin) {
    return jsonResponse({ error: "An admin account with this email already exists" }, 409);
  }

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role: "admin" },
  });

  if (authError || !authData.user) {
    const msg = authError?.message ?? "Failed to create auth user";
    if (msg.toLowerCase().includes("already")) {
      return jsonResponse({ error: "This email is already registered in auth" }, 409);
    }
    return jsonResponse({ error: msg }, 500);
  }

  const userId = authData.user.id;

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: userId,
      email,
      full_name: fullName,
      phone,
      role: "admin",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (profileError) {
    await supabase.auth.admin.deleteUser(userId).catch(() => {});
    return jsonResponse({ error: `Profile setup failed: ${profileError.message}` }, 500);
  }

  const { data: adminRow, error: adminError } = await supabase
    .from("admin_users")
    .insert({
      user_id: userId,
      email,
      full_name: fullName,
      phone,
      admin_role: "admin",
      status: "approved",
    })
    .select("id, email, full_name, status")
    .single();

  if (adminError) {
    await supabase.auth.admin.deleteUser(userId).catch(() => {});
    return jsonResponse({ error: `Admin record failed: ${adminError.message}` }, 500);
  }

  return jsonResponse({
    ok: true,
    user_id: userId,
    admin: adminRow,
  });
});
