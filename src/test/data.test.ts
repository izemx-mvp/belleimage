import { describe, expect, it } from "vitest";
import { answer } from "@/components/assistant";
import { imageManifest } from "@/data/images";
import { getBrands, getCategories, getCategory, getPosts, getProducts } from "@/lib/catalogue";
import { getImage, missingImages } from "@/lib/images";

const names = new Set(imageManifest.map((i) => i.name));

describe("sample data integrity", () => {
  const products = getProducts();

  it("has ~40 sample products with unique slugs", () => {
    expect(products.length).toBeGreaterThanOrEqual(38);
    expect(new Set(products.map((p) => p.slug)).size).toBe(products.length);
  });

  it("references existing categories, subcategories and brands", () => {
    const brands = new Set(getBrands().map((b) => b.slug));
    for (const p of products) {
      const c = getCategory(p.category);
      expect(c, p.slug).toBeDefined();
      expect(c!.subcategories.some((s) => s.slug === p.subcategory), p.slug).toBe(true);
      expect(brands.has(p.brand)).toBe(true);
      expect(p.sample).toBe(true);
      if (p.oldPrice) expect(p.oldPrice).toBeGreaterThan(p.price);
    }
  });

  it("uses only image names from the manifest", () => {
    for (const p of products) for (const img of [p.image, ...p.gallery]) expect(names.has(img), img).toBe(true);
    for (const c of getCategories()) expect(names.has(c.image), c.image).toBe(true);
    for (const p of getPosts()) expect(names.has(p.image), p.image).toBe(true);
  });

  it("covers every product image of the manifest", () => {
    const used = new Set(products.map((p) => p.image));
    for (const i of imageManifest.filter((x) => x.name.startsWith("prod-"))) expect(used.has(i.name), i.name).toBe(true);
  });
});

describe("image system", () => {
  it("returns undefined for a missing image instead of throwing", () => {
    expect(getImage("does-not-exist")).toBeUndefined();
    expect(getImage(undefined)).toBeUndefined();
  });
  it("lists missing manifest images", () => {
    expect(missingImages().every((n) => names.has(n))).toBe(true);
  });
});

describe("assistant (local, no AI)", () => {
  const text = (msgs: ReturnType<typeof answer>) => msgs.map((m) => (m.kind === "text" ? m.text : m.kind)).join(" | ");

  it("answers FAQ keywords", () => {
    expect(text(answer("Comment je peux payer ?"))).toContain("à la livraison");
    expect(text(answer("quels sont vos horaires"))).toContain("09:00");
  });
  it("finds products with accents removed", () => {
    expect(answer("lave linge").some((m) => m.kind === "products")).toBe(true);
  });
  it("offers WhatsApp when nothing matches", () => {
    const r = answer("xyzzy plop");
    expect(r.some((m) => m.kind === "whatsapp" && m.question === "xyzzy plop")).toBe(true);
  });
});
