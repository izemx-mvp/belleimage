import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { buildSitemap, sitemapPaths } from "@/lib/sitemap";

const file = resolve(__dirname, "../../public/sitemap.xml");

describe("public/sitemap.xml", () => {
  it("lists every public page once", () => {
    const paths = sitemapPaths();
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths).toContain("/produit/lave-linge-hublot-8-kg");
    expect(paths.some((p) => p.startsWith("/panier") || p.startsWith("/commande"))).toBe(false);
  });

  it("is up to date with the data (regenerated locally, strict in CI)", () => {
    const expected = buildSitemap();
    const current = existsSync(file) ? readFileSync(file, "utf8") : "";
    if (current !== expected && !process.env["CI"]) writeFileSync(file, expected);
    expect(existsSync(file) ? readFileSync(file, "utf8") : "").toBe(expected);
  });
});
