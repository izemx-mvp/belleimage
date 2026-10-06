import { describe, expect, it } from "vitest";
import { site } from "@/config/site";
import { cartTotals, deliveryFee } from "@/lib/commerce";

describe("cart totals", () => {
  it("sums subtotal and item count", () => {
    const tot = cartTotals([{ price: 4999, qty: 2 }, { price: 899, qty: 1 }]);
    expect(tot.subtotal).toBe(4999 * 2 + 899);
    expect(tot.count).toBe(3);
  });

  it("has no delivery fee until a zone is chosen", () => {
    const tot = cartTotals([{ price: 1000, qty: 1 }]);
    expect(tot.fee).toBeNull();
    expect(tot.total).toBe(1000);
  });

  it("adds the zone fee below the free-delivery threshold", () => {
    const zone = site.deliveryZones.find((z) => z.fee > 0)!;
    const tot = cartTotals([{ price: 1000, qty: 1 }], zone.id);
    expect(tot.fee).toBe(zone.fee);
    expect(tot.total).toBe(1000 + zone.fee);
    expect(tot.toFreeDelivery).toBe(site.freeDeliveryThreshold - 1000);
  });

  it("offers delivery at or above the threshold", () => {
    const zone = site.deliveryZones.find((z) => z.fee > 0)!;
    const tot = cartTotals([{ price: site.freeDeliveryThreshold, qty: 1 }], zone.id);
    expect(tot.fee).toBe(0);
    expect(tot.toFreeDelivery).toBe(0);
  });

  it("handles an empty cart", () => {
    expect(cartTotals([])).toMatchObject({ subtotal: 0, count: 0, total: 0 });
  });
});

describe("delivery fees by zone", () => {
  it("returns each configured zone fee below the threshold", () => {
    for (const z of site.deliveryZones) expect(deliveryFee(z.id, 100)).toBe(z.fee);
  });
  it("returns 0 above the threshold for every zone", () => {
    for (const z of site.deliveryZones) expect(deliveryFee(z.id, site.freeDeliveryThreshold + 1)).toBe(0);
  });
  it("returns null for an unknown or missing zone", () => {
    expect(deliveryFee(undefined, 100)).toBeNull();
    expect(deliveryFee("mars", 100)).toBeNull();
  });
});
