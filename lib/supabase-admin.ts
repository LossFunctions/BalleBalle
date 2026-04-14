import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase-database.types";

let supabaseAdminClient: SupabaseClient<Database> | null = null;

const getSupabaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL.");
  }

  return url;
};

const getSupabaseSecretKey = () => {
  const secretKey =
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!secretKey) {
    throw new Error("Missing SUPABASE_SECRET_KEY.");
  }

  return secretKey;
};

export const getSupabaseAdmin = () => {
  if (!supabaseAdminClient) {
    supabaseAdminClient = createClient<Database>(
      getSupabaseUrl(),
      getSupabaseSecretKey(),
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );
  }

  return supabaseAdminClient;
};
