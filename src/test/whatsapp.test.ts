import { describe, expect, it } from "vitest";
import { site } from "@/config/site";
import { buildRecap, emptyCheckout, validateCheckout, type CheckoutValues } from "@/lib/checkout";
import { buildContactMessage, buildOrderMessage, buildProductMessage, ORDER_REF_RE, waLink } from "@/lib/commerce";

const valid: CheckoutValues = {
  name: "Amina Benali",
  phone: "06 12 34 56 78",
  zone: "rabat-sale",
  address: "12 rue des Orangers, appt 4",
  district: "Agdal",
  note: "3e étage",
  cgv: true,
};
const items = [
  { name: "Lave-linge hublot 8 kg", price: 4999, qty: 1 },
  { name: "Matelas mousse", price: 2299, qty: 2, variant: "160×200" },
];

describe("checkout validation", () => {
  it("accepts a complete form", () => {
    expect(validateCheckout(valid)).toEqual({});
  });
  it("flags every missing required field", () => {
    const e = validateCheckout(emptyCheckout);
    expect(Object.keys(e).sort()).toEqual(["address", "cgv", "district", "name", "phone", "zone"]);
  });
  it("rejects non-Moroccan phone numbers", () => {
    expect(validateCheckout({ ...valid, phone: "0812345678" }).phone).toBeDefined();
    expect(validateCheckout({ ...valid, phone: "+212 7 12 34 56 78" }).phone).toBeUndefined();
  });
});

describe("WhatsApp order message", () => {
  const recap = buildRecap(valid, items, new Date(2026, 9, 6), () => 0);

  it("builds a recap with reference, fee and total", () => {
    expect(recap.ref).toMatch(ORDER_REF_RE);
    expect(recap.ref.startsWith("BI-20261006-")).toBe(true);
    expect(recap.subtotal).toBe(4999 + 2299 * 2);
    const zone = site.deliveryZones.find((z) => z.id === "rabat-sale")!;
    expect(recap.fee).toBe(recap.subtotal >= site.freeDeliveryThreshold ? 0 : zone.fee);
    expect(recap.total).toBe(recap.subtotal + recap.fee);
    expect(recap.customer.city).toBe(zone.label);
  });

  it("formats a readable message with every required part", () => {
    const msg = buildOrderMessage(recap);
    expect(msg).toContain(recap.ref);
    expect(msg).toContain("Nom : Amina Benali");
    expect(msg).toContain("Tél : 06 12 34 56 78");
    expect(msg).toContain("Quartier : Agdal");
    expect(msg).toContain("Adresse : 12 rue des Orangers, appt 4");
    expect(msg).toContain("Note : 3e étage");
    expect(msg).toContain("• 1 × Lave-linge hublot 8 kg — 4 999 DH");
    expect(msg).toContain("• 2 × Matelas mousse (160×200) — 4 598 DH");
    expect(msg).toContain("Paiement à la livraison");
    expect(msg).not.toContain("\u00a0");
  });

  it("omits the note line when empty", () => {
    const msg = buildOrderMessage(buildRecap({ ...valid, note: "  " }, items));
    expect(msg).not.toContain("Note :");
  });

  it("encodes the message in the wa.me link with the configured number", () => {
    const link = waLink(buildOrderMessage(recap));
    expect(link.startsWith(`https://wa.me/${site.whatsapp}?text=`)).toBe(true);
    expect(decodeURIComponent(link.split("text=")[1]!)).toBe(buildOrderMessage(recap));
  });

  it("builds product and contact messages", () => {
    const p = buildProductMessage({ name: "Smart TV 55\"", price: 5499 }, "https://belleimage.ma/produit/x", "Noir");
    expect(p).toContain("Smart TV 55\" (Noir)");
    expect(p).toContain("5 499 DH");
    expect(p).toContain("https://belleimage.ma/produit/x");
    const c = buildContactMessage({ name: "Karim", phone: "0612345678", subject: "Livraison", message: "Bonjour" });
    expect(c).toContain("*Objet : Livraison*");
    expect(c).toContain("— Karim · 0612345678");
  });
});
