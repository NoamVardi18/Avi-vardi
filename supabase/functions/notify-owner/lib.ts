// Pure helpers for notify-owner (no Deno APIs), so Vitest can cover them: scripts/notify-owner.test.ts.

export type Lead = {
  id: number;
  name: string | null;
  phone: string | null;
  date: string | null;
  notes: string | null;
  email: string | null;
  created_at: string;
};

export const OWNER_PHONE = "+972524804842";
export const OWNER_PHONE_DISPLAY = "052-480-4842";

// Every lead field is visitor input; it goes into HTML email, so it is always escaped.
export const esc = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const isEmail = (s: unknown): s is string =>
  typeof s === "string" && s.length <= 254 && /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/.test(s.trim());

// The function's URL is public (the DB trigger can't send a JWT), so it only acts on a lead it has
// just read back from the table and that was created moments ago. A replayed or forged call can at
// most re-send one notification for a real, fresh lead — never mail an address the caller chose.
export const FRESH_MS = 10 * 60 * 1000;
export const isFresh = (createdAt: string, now = Date.now()) => {
  const t = Date.parse(createdAt);
  return Number.isFinite(t) && now - t >= -60_000 && now - t <= FRESH_MS;
};

const row = (label: string, value: string | null, html?: string) =>
  value
    ? `<tr><td style="padding:8px 0;color:#666;">${label}</td><td style="padding:8px 0;font-weight:bold;">${html ?? esc(value)}</td></tr>`
    : "";

export function ownerEmail(lead: Lead, time: string) {
  const phone = esc(lead.phone);
  const html = `
<div dir="rtl" style="font-family:Arial,sans-serif;max-width:500px;padding:24px;border:2px solid #1e3a5f;border-radius:12px;">
  <h2 style="color:#1e3a5f;margin-bottom:16px;">🚌 פנייה חדשה מהאתר</h2>
  <table style="width:100%;border-collapse:collapse;">
    ${row("שם", lead.name)}
    ${row("טלפון", lead.phone, `<a href="tel:${phone}">${phone}</a>`)}
    ${row("מייל", lead.email)}
    ${row("תאריך", lead.date)}
    ${row("פרטים", lead.notes)}
    <tr><td style="padding:8px 0;color:#666;">נשלח</td><td style="padding:8px 0;color:#999;">${esc(time)}</td></tr>
  </table>
  <a href="tel:${phone}" style="display:inline-block;margin-top:20px;background:#f59e0b;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">📞 חייג עכשיו</a>
</div>`;
  return { subject: `🚌 פנייה חדשה מהאתר - ${lead.name ?? ""}`.trim(), html };
}

export function customerEmail(lead: Lead) {
  const html = `
<div dir="rtl" style="font-family:Arial,sans-serif;max-width:500px;padding:24px;border:2px solid #f59e0b;border-radius:12px;color:#333;">
  <h2 style="color:#1e3a5f;margin:0 0 12px;">תודה${lead.name ? `, ${esc(lead.name)}` : ""}!</h2>
  <p style="margin:0 0 12px;">קיבלנו את הפנייה שלך, ואבי יחזור אליך בהקדם.</p>
  <p style="margin:0 0 16px;">אם זה דחוף, אפשר להתקשר ישירות: <a href="tel:${OWNER_PHONE}" dir="ltr">${OWNER_PHONE_DISPLAY}</a></p>
  <p style="margin:0;color:#1e3a5f;font-weight:bold;">אבי ורדי הסעות</p>
  <p style="margin:12px 0 0;font-size:12px;color:#888;">קיבלת את המייל הזה כי השארת את הכתובת בטופס באתר avivardi.online. לא נשלח לך דיוור.</p>
</div>`;
  return { subject: "קיבלנו את הפנייה שלך - אבי ורדי הסעות", html };
}
