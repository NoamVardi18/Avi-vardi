// notify-owner — called by the on_lead_inserted trigger on public.leads (Supabase project
// avi-vardi-bus). Emails the lead to the owner and, if the visitor left an email, a short Hebrew
// confirmation to them. Deployed with verify_jwt=false because pg_net sends no JWT; the body is
// therefore untrusted and only its lead id is used — everything else is read back from the table.
//
// The Resend key: Edge Function secret RESEND_API_KEY if set, otherwise Supabase Vault
// ('avi_resend_api_key', via the service_role-only RPC public.avi_resend_api_key — see
// supabase/migrations/20261028_notify_owner_hardening.sql). RESEND_FROM (optional secret): until a
// domain is verified in Resend the default test sender can only reach the account owner, so
// customer confirmations are rejected by Resend — logged, never surfaced as an error.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { customerEmail, isEmail, isFresh, ownerEmail, type Lead } from "./lib.ts";

let RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM = Deno.env.get("RESEND_FROM") || "אבי ורדי הסעות <onboarding@resend.dev>";
const OWNER_EMAILS = ["vardi197@gmail.com"];
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

async function sendEmail(to: string[], subject: string, html: string) {
  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  });
  const body = await resp.json().catch(() => ({}));
  // Log the outcome only (Resend id or error), never the recipient or lead contents.
  return { ok: resp.ok, status: resp.status, id: body?.id, error: resp.ok ? undefined : body?.message };
}

const restHeaders = () => ({ apikey: SERVICE_KEY!, Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "application/json" });

async function resendKey(): Promise<string | undefined> {
  if (RESEND_API_KEY) return RESEND_API_KEY;
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/rpc/avi_resend_api_key`, { method: "POST", headers: restHeaders(), body: "{}" });
  if (!resp.ok) return undefined;
  RESEND_API_KEY = (await resp.json()) || undefined; // cached for the life of the worker
  return RESEND_API_KEY;
}

async function loadLead(id: number): Promise<Lead | null> {
  const url = `${SUPABASE_URL}/rest/v1/leads?id=eq.${id}&select=id,name,phone,date,notes,email,created_at`;
  const resp = await fetch(url, { headers: restHeaders() });
  if (!resp.ok) throw new Error(`lead lookup failed: ${resp.status}`);
  const rows = await resp.json();
  return rows[0] ?? null;
}

Deno.serve(async (req: Request) => {
  try {
    if (!SUPABASE_URL || !SERVICE_KEY || !(await resendKey())) {
      console.error("[notify-owner] not configured: Resend key (secret or Vault) / SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
      return json({ ok: false, error: "not configured" }, 500);
    }
    const payload = await req.json().catch(() => null);
    const id = Number(payload?.record?.id);
    if (!Number.isSafeInteger(id) || id <= 0) return json({ ok: false, error: "no lead id" }, 400);

    const lead = await loadLead(id);
    if (!lead || !isFresh(lead.created_at)) {
      console.log(`[notify-owner] lead ${id} ignored (${lead ? "not fresh" : "not found"})`);
      return json({ ok: true, ignored: true });
    }

    const time = new Date(lead.created_at).toLocaleString("he-IL", { timeZone: "Asia/Jerusalem" });
    const owner = ownerEmail(lead, time);
    const ownerResult = await sendEmail(OWNER_EMAILS, owner.subject, owner.html);
    console.log(`[notify-owner] lead ${id} owner email:`, JSON.stringify(ownerResult));

    let customerResult: Awaited<ReturnType<typeof sendEmail>> | "no email" = "no email";
    if (isEmail(lead.email)) {
      const c = customerEmail(lead);
      customerResult = await sendEmail([lead.email.trim()], c.subject, c.html);
    }
    console.log(`[notify-owner] lead ${id} customer email:`, JSON.stringify(customerResult));

    return json({ ok: ownerResult.ok, owner: ownerResult.ok, customer: customerResult === "no email" ? "none" : customerResult.ok });
  } catch (err) {
    console.error("[notify-owner] error:", String(err));
    return json({ ok: false, error: "internal" }, 500);
  }
});
