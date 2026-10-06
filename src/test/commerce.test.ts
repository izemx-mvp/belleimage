import { describe, expect, it } from "vitest";
import { isValidMoroccanPhone, makeOrderRef, formatPrice, deliveryFee } from "@/lib/commerce";

describe("commerce rules", () => {
  it("accepts Moroccan phones starting 05/06/07 or +212", () => {
    expect(isValidMoroccanPhone("06 12 34 56 78")).toBe(true);
    expect(isValidMoroccanPhone("0537364033")).toBe(true);
    expect(isValidMoroccanPhone("+212 612345678")).toBe(true);
    expect(isValidMoroccanPhone("0812345678")).toBe(false);
    expect(isValidMoroccanPhone("06123")).toBe(false);
  });
  it("builds order ref BI-YYYYMMDD-XXXX", () => {
    expect(makeOrderRef(new Date(2026, 9, 6))).toMatch(/^BI-20261006-[A-Z0-9]{4}$/);
  });
  it("formats prices as '4 999 DH'", () => {
    expect(formatPrice(4999).replace(/\u00a0/g, " ")).toBe("4 999 DH");
  });
  it("returns null fee for unknown zone", () => {
    expect(deliveryFee("nowhere", 100)).toBeNull();
  });
});
