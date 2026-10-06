import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
  const leaf = (path: string) => router.matchRoutes(path).at(-1)?.routeId;

  it("matches a page for / instead of falling back to not found", () => {
    expect(leaf("/")).not.toBe(rootRouteId);
  });

  it.each([
    ["/boutique", "/boutique/"],
    ["/boutique/refrigerateurs", "/boutique/$category/"],
    ["/boutique/refrigerateurs/combines", "/boutique/$category/$subcategory"],
    ["/produit/lave-linge-hublot-8-kg", "/produit/$slug"],
    ["/promotions", "/promotions"],
    ["/marques", "/marques/"],
    ["/marques/marque-01", "/marques/$brand"],
    ["/panier", "/panier"],
    ["/commande", "/commande/"],
    ["/commande/confirmation/BI-20261006-ABCD", "/commande/confirmation/$ref"],
    ["/favoris", "/favoris"],
    ["/a-propos", "/a-propos"],
    ["/livraison-paiement", "/livraison-paiement"],
    ["/garantie-sav", "/garantie-sav"],
    ["/conseils", "/conseils/"],
    ["/conseils/choisir-son-refrigerateur", "/conseils/$slug"],
    ["/contact", "/contact"],
    ["/faq", "/faq"],
    ["/cgv", "/cgv"],
    ["/mentions-legales", "/mentions-legales"],
  ])("matches %s", (path, id) => {
    expect(leaf(path)).toBe(id);
  });

  it("falls back to the root for unknown pages (404)", () => {
    expect(leaf("/nimporte-quoi/introuvable")).toBe(rootRouteId);
  });
});
