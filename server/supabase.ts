import { createClient } from "@supabase/supabase-js";

// Supabase project: avi-vardi-bus
const SUPABASE_URL = "https://nlwkksivgubcgfzqivcs.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sd2trc2l2Z3ViY2dmenFpdmNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5NjI1NTUsImV4cCI6MjA5NTUzODU1NX0.Z0rNzhIAxUVG33c4hnj4bNWPwDGbqV-WnWPkixnUzUI";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Save a booking lead to the avi-vardi-bus Supabase project (public.leads table).
 */
// NOTE: Run this SQL to add the email column if it doesn't exist:
// ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS email text;

export async function saveLeadToSupabase(data: {
  name: string;
  phone: string;
  email?: string | null;
  date?: string | null;
  notes?: string | null;
}) {
  const { error } = await supabase.from("leads").insert({
    name: data.name,
    phone: data.phone,
    email: data.email ?? null,
    date: data.date ?? null,
    notes: data.notes ?? null,
  });

  if (error) {
    console.error("[Supabase] Failed to save lead:", error.message);
    throw new Error(`Supabase insert failed: ${error.message}`);
  }

  console.log("[Supabase] Lead saved successfully:", data.name);
}
