/* global process */
import { createClient } from "@supabase/supabase-js";

const isNode = typeof process !== "undefined" && process.release && process.release.name === "node";

const SUPABASE_URL = isNode ? process.env.VITE_SUPABASE_URL : import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = isNode ? process.env.VITE_SUPABASE_ANON_KEY : import.meta.env.VITE_SUPABASE_ANON_KEY;

export function createSupabaseClient(role) {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    headers: {
      role: role,
    },
  });
}
