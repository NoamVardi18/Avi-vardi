/**
 * Guards the invariants that make the static landing pages worth having. Each one here has a
 * specific failure it is watching for — none of them announce themselves in a browser, which is
 * why they need a test rather than a look:
 *
 *  - a canonical pointing at the wrong slug tells Google eight pages are one page
 *  - invalid JSON-LD costs the rich results the pages exist to earn
 *  - a wa.me link without ?text= opens an empty composer (0 of 134 such links in this system
 *    once carried one, and every tap died in the composer)
 *  - a phone number that drifts from shared/const.ts splits the business's local identity
 */

import { describe, expect, it } from "vitest";
import { PAGES, BIZ } from "../shared/seo-pages.mjs";
import { renderPage, sitemap, llmsTxt, assertNapMatchesSource } from "./gen-seo-pages.mjs";

const rendered = PAGES.map((p) => ({ page: p, html: renderPage(p) }));

describe("seo page data", () => {
  it("has unique slugs", () => {
    const slugs = PAGES.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("gives every page an FAQ and at least one content section", () => {
    for (const p of PAGES) {
      expect(p.faq.length, `${p.slug} faq`).toBeGreaterThan(0);
      expect(p.sections.length, `${p.slug} sections`).toBeGreaterThan(0);
    }
  });

  it("only links related pages that exist", () => {
    const slugs = new Set(PAGES.map((p) => p.slug));
    for (const p of PAGES) {
      for (const r of p.related) expect(slugs.has(r), `${p.slug} -> ${r}`).toBe(true);
    }
  });

  it("keeps meta descriptions inside the length Google will render", () => {
    for (const p of PAGES) {
      expect(p.description.length, `${p.slug} description`).toBeLessThanOrEqual(165);
      expect(p.description.length, `${p.slug} description`).toBeGreaterThan(50);
    }
  });
});

describe("rendered pages", () => {
  it("renders real text without needing JavaScript", () => {
    for (const { page, html } of rendered) {
      const text = html
        .replace(/<script[\s\S]*?<\/script>/g, "")
        .replace(/<style[\s\S]*?<\/style>/g, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      expect(text.length, `${page.slug} visible text`).toBeGreaterThan(1500);
    }
  });

  it("gives each page exactly one h1 and a self-referencing canonical", () => {
    for (const { page, html } of rendered) {
      expect(html.match(/<h1>/g)?.length, `${page.slug} h1 count`).toBe(1);
      expect(html).toContain(`<link rel="canonical" href="${BIZ.origin}/${page.slug}/">`);
    }
  });

  it("emits valid JSON-LD carrying the four schema types", () => {
    for (const { page, html } of rendered) {
      const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
      expect(blocks.length, `${page.slug} ld+json blocks`).toBe(1);
      const parsed = JSON.parse(blocks[0][1].replace(/\\u003c/g, "<"));
      const types = parsed["@graph"].map((n: { "@type": string }) => n["@type"]);
      expect(types).toEqual(["LocalBusiness", "BreadcrumbList", "Service", "FAQPage"]);
      // every page must resolve to the SAME business entity, not eight look-alikes
      expect(parsed["@graph"][0]["@id"]).toBe(`${BIZ.origin}/#business`);
    }
  });

  it("links the business entity to its Google Business Profile", () => {
    // Without sameAs, Google and the AI engines treat the website and the Maps listing as two
    // unrelated things, and the site inherits none of the trust from the profile's real reviews.
    for (const { page, html } of rendered) {
      const g = JSON.parse(
        html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)![1].replace(/\\u003c/g, "<"),
      );
      expect(g["@graph"][0].sameAs, `${page.slug} sameAs`).toContain(BIZ.googleBusinessProfile);
    }
  });

  it("prefills every WhatsApp link", () => {
    for (const { page, html } of rendered) {
      const links = [...html.matchAll(/href="(https:\/\/wa\.me\/[^"]*)"/g)].map((m) => m[1]);
      expect(links.length, `${page.slug} wa.me links`).toBeGreaterThan(0);
      for (const l of links) expect(l, `${page.slug} link without ?text=`).toContain("?text=");
    }
  });

  it("publishes the phone number from shared/const.ts", () => {
    for (const { page, html } of rendered) {
      expect(html, `${page.slug} tel link`).toContain(`href="tel:${BIZ.phone}"`);
    }
  });

  it("states no star rating or review count anywhere", () => {
    // The four 5-star reviews this business advertised were invented; commit 81ff3a5 pulled the
    // schema markup and the claim then survived in llms.txt for another week. Nothing generated
    // here may reintroduce it.
    for (const { page, html } of rendered) {
      expect(html, `${page.slug}`).not.toMatch(/aggregateRating|ratingValue|reviewCount/);
      expect(html, `${page.slug}`).not.toMatch(/\d[\d.,]* ?כוכבים|\d+ ?ביקורות/);
    }
    expect(llmsTxt()).not.toMatch(/\d[\d.,]* ?כוכבים|\d+ ?ביקורות/);
  });
});

describe("sitemap", () => {
  it("lists the homepage plus every page, absolute and https", () => {
    const locs = [...sitemap().matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    expect(locs.length).toBe(PAGES.length + 1);
    expect(locs[0]).toBe(`${BIZ.origin}/`);
    for (const p of PAGES) expect(locs).toContain(`${BIZ.origin}/${p.slug}/`);
    for (const l of locs) expect(l.startsWith("https://")).toBe(true);
  });
});

describe("llms.txt", () => {
  it("links every service page so an AI crawler can reach them all from one file", () => {
    const txt = llmsTxt();
    for (const p of PAGES) expect(txt, `${p.slug} missing`).toContain(`${BIZ.origin}/${p.slug}/`);
    expect(txt).toContain(BIZ.phoneDisplay);
  });
});

describe("NAP guard", () => {
  it("passes while seo-pages.mjs and shared/const.ts agree", () => {
    expect(() => assertNapMatchesSource()).not.toThrow();
  });
});
