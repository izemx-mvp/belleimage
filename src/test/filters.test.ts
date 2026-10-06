import { describe, expect, it } from "vitest";
import { discount, facets, filterProducts, getProducts, scopeProducts, searchCategories, searchProducts } from "@/lib/catalogue";
import { activeFilterCount, cleanSearch, searchToFilters, toggleInList, validateCatalogueSearch } from "@/lib/catalogue-search";

describe("catalogue search params", () => {
  it("keeps valid params and coerces types", () => {
    expect(validateCatalogueSearch({ q: " frigo ", min: "1000", max: 5000, promo: "true", stock: true, sort: "prix-asc", view: "list", page: "2", capacite: "350 L" }))
      .toEqual({ q: "frigo", min: 1000, max: 5000, promo: true, stock: true, sort: "prix-asc", view: "list", page: 2, capacite: "350 L" });
  });
  it("drops invalid values without throwing", () => {
    expect(validateCatalogueSearch({ min: "abc", max: -5, sort: "hack", view: "table", page: "0", pillar: "cuisine", promo: "no", foo: "bar" })).toEqual({});
  });
  it("toggles comma-separated values", () => {
    expect(toggleInList(undefined, "a")).toBe("a");
    expect(toggleInList("a,b", "a")).toBe("b");
    expect(toggleInList("b", "b")).toBeUndefined();
  });
  it("counts active filters and cleans empty keys", () => {
    expect(activeFilterCount({ brand: "m1,m2", promo: true, min: 100, capacite: "350 L", sort: "prix-asc" })).toBe(5);
    expect(cleanSearch({ q: "x", brand: undefined, promo: undefined, page: undefined })).toEqual({ q: "x" });
  });
});

describe("filterProducts", () => {
  const all = getProducts();

  it("filters by category scope and price range", () => {
    const r = filterProducts(all, searchToFilters({ min: 3000, max: 6000 }, { category: "lave-linge" }));
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((p) => p.category === "lave-linge" && p.price >= 3000 && p.price <= 6000)).toBe(true);
  });

  it("filters promotions only and sorts by price", () => {
    const r = filterProducts(all, searchToFilters({ promo: true, sort: "prix-asc" }));
    expect(r.every((p) => p.oldPrice)).toBe(true);
    expect(r.map((p) => p.price)).toEqual([...r.map((p) => p.price)].sort((a, b) => a - b));
  });

  it("filters by attribute values and in-stock", () => {
    const r = filterProducts(all, searchToFilters({ capacite: "350 L,450 L", stock: true }, { category: "refrigerateurs" }));
    expect(r.map((p) => p.attrs["capacite"]).sort()).toEqual(["350 L", "450 L"]);
    expect(r.every((p) => p.stock !== "order")).toBe(true);
  });

  it("filters by brand list and pillar", () => {
    const brand = all[0]!.brand;
    const r = filterProducts(all, searchToFilters({ brand, pillar: "electromenager" }));
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((p) => p.brand === brand)).toBe(true);
  });

  it("sorts by biggest discount", () => {
    const r = filterProducts(all, searchToFilters({ sort: "promotions" }));
    expect(discount(r[0]!)).toBeGreaterThanOrEqual(discount(r[1]!));
  });

  it("builds facets with counts and a price range", () => {
    const f = facets(scopeProducts({ category: "tv-image" }));
    expect(f.priceMin).toBeLessThanOrEqual(2999);
    expect(f.priceMax).toBeGreaterThanOrEqual(14999);
    expect(f.attrValues("taille").reduce((s, v) => s + v.count, 0)).toBe(4);
  });
});

describe("local search", () => {
  it("is accent-insensitive", () => {
    expect(searchProducts("refrigerateur").length).toBeGreaterThan(0);
    expect(searchProducts("réfrigérateur")[0]?.category).toBe("refrigerateurs");
  });
  it("tolerates a typo", () => {
    expect(searchProducts("climatiseru").some((p) => p.category === "climatisation")).toBe(true);
    expect(searchCategories("canapes").map((c) => c.slug)).toContain("salons");
  });
  it("returns nothing for gibberish", () => {
    expect(searchProducts("zzqxw")).toEqual([]);
  });
});
