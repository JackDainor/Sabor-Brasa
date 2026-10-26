import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseReady = Boolean(url && key && !url.includes("TU-PROYECTO") && !key.includes("TU_SUPABASE"));
export const supabase = supabaseReady ? createClient(url!, key!) : null;
