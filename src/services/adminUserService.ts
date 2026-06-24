import { supabase } from "@/lib/supabase";

export interface CreateAdminUserInput {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export async function createAdminUser(
  input: CreateAdminUserInput
): Promise<{ data?: { user_id: string }; error: Error | null }> {
  const { data, error } = await supabase.functions.invoke("admin-create-user", {
    body: {
      email: input.email.trim().toLowerCase(),
      password: input.password,
      full_name: input.fullName.trim(),
      phone: input.phone?.trim() || null,
    },
  });

  if (error) {
    return { error: new Error(error.message) };
  }

  if (data && typeof data === "object" && "error" in data && data.error) {
    return { error: new Error(String(data.error)) };
  }

  return { data: data as { user_id: string }, error: null };
}
