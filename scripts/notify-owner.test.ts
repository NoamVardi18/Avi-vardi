/**
 * notify-owner (supabase/functions/notify-owner) builds HTML email from visitor input and runs at a
 * public URL, so the parts worth pinning are: input is escaped, only real addresses get mail, and
 * only a just-created lead is acted on.
 */
import { describe, expect, it } from "vitest";
import { customerEmail, esc, isEmail, isFresh, ownerEmail, type Lead } from "../supabase/functions/notify-owner/lib.ts";

const lead: Lead = {
  id: 1,
  name: `<img src=x onerror=alert(1)>`,
  phone: `050"><script>`,
  date: "2026-11-01",
  notes: "<b>hi</b>",
  email: "a@b.co",
  created_at: new Date().toISOString(),
};

describe("notify-owner", () => {
  it("escapes every visitor field in both emails", () => {
    for (const { html } of [ownerEmail(lead, "now"), customerEmail(lead)]) {
      expect(html).not.toContain("<img");
      expect(html).not.toContain("<script");
      expect(html).not.toContain("<b>hi");
    }
    expect(esc(`<&"'>`)).toBe("&lt;&amp;&quot;&#39;&gt;");
  });

  it("only treats plausible addresses as email", () => {
    expect(isEmail("a@b.co")).toBe(true);
    for (const bad of ["", null, undefined, "a@b", "a b@c.co", "<a@b.co>", 42]) expect(isEmail(bad)).toBe(false);
  });

  it("acts only on a lead created in the last few minutes", () => {
    const now = Date.parse("2026-10-28T12:00:00Z");
    expect(isFresh("2026-10-28T11:55:00Z", now)).toBe(true);
    expect(isFresh("2026-10-28T11:45:00Z", now)).toBe(false);
    expect(isFresh("not a date", now)).toBe(false);
  });

  it("writes the customer confirmation in Hebrew, with the phone number", () => {
    const { subject, html } = customerEmail(lead);
    expect(subject).toContain("קיבלנו את הפנייה שלך");
    expect(html).toContain('dir="rtl"');
    expect(html).toContain("052-480-4842");
  });
});
