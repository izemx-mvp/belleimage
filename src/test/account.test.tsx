import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { act, render, renderHook, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RequireAuth } from "@/components/sections/account/account-shell";
import { site } from "@/config/site";
import { seedAccount } from "@/data/account";
import { checkCredentials, guardTarget, normalizeAddresses, orderFromRecap, safeRedirect } from "@/lib/account";
import { buildRecap, prefillFromAccount, emptyCheckout } from "@/lib/checkout";
import { cartTotals, getZone } from "@/lib/commerce";
import { sitemapPaths } from "@/lib/sitemap";
import { routeTree } from "@/routeTree.gen";
import { ACCOUNT_KEY, AuthProvider, SESSION_KEY, useAuth } from "@/store/auth";

const wrapper = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>;
const hydratedAuth = async () => {
  const hook = renderHook(() => useAuth(), { wrapper });
  await waitFor(() => expect(hook.result.current.hydrated).toBe(true));
  return hook;
};

beforeEach(() => localStorage.clear());
afterEach(() => localStorage.clear());

describe("demo login", () => {
  it("accepts the demo credentials in any phone format", () => {
    const { phone, password } = site.demoAccount;
    expect(checkCredentials(phone, password)).toBe(true);
    expect(checkCredentials("0600000000", password)).toBe(true);
    expect(checkCredentials("+212 6 00 00 00 00", password)).toBe(true);
  });

  it("rejects a wrong phone or password", () => {
    expect(checkCredentials(site.demoAccount.phone, "mauvais")).toBe(false);
    expect(checkCredentials("06 11 11 11 11", site.demoAccount.password)).toBe(false);
    expect(checkCredentials("", "")).toBe(false);
  });

  it("starts logged out, logs in, persists the session and logs out", async () => {
    const { result } = await hydratedAuth();
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.user).toBeNull();

    let ok = true;
    act(() => { ok = result.current.login(site.demoAccount.phone, "faux"); });
    expect(ok).toBe(false);
    expect(result.current.isLoggedIn).toBe(false);

    act(() => { ok = result.current.login(site.demoAccount.phone, site.demoAccount.password); });
    expect(ok).toBe(true);
    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.user?.name).toBe(site.demoAccount.name);
    expect(localStorage.getItem(SESSION_KEY)).toBe("1");

    act(() => result.current.logout());
    expect(result.current.isLoggedIn).toBe(false);
    await waitFor(() => expect(localStorage.getItem(SESSION_KEY)).toBeNull());
  });

  it("restores an existing session from localStorage", async () => {
    localStorage.setItem(SESSION_KEY, "1");
    const { result } = await hydratedAuth();
    expect(result.current.isLoggedIn).toBe(true);
  });
});

describe("route protection", () => {
  it("only redirects once hydrated and logged out", () => {
    expect(guardTarget({ hydrated: false, isLoggedIn: false }, "/compte")).toBeNull();
    expect(guardTarget({ hydrated: true, isLoggedIn: true }, "/compte")).toBeNull();
    expect(guardTarget({ hydrated: true, isLoggedIn: false }, "/compte/commandes/BI-1")).toEqual({
      to: "/compte/connexion",
      search: { redirect: "/compte/commandes/BI-1" },
    });
  });

  it("never redirects outside the account after login", () => {
    expect(safeRedirect("/compte/adresses")).toBe("/compte/adresses");
    expect(safeRedirect("https://evil.example")).toBe("/compte");
    expect(safeRedirect("//evil.example/compte")).toBe("/compte");
    expect(safeRedirect("/panier")).toBe("/compte");
    expect(safeRedirect("/compte/connexion")).toBe("/compte");
    expect(safeRedirect(undefined)).toBe("/compte");
  });

  it("shows a skeleton then redirects a logged-out visitor", async () => {
    const redirect = vi.fn();
    render(<AuthProvider><RequireAuth href="/compte/profil" redirect={redirect}><p>secret</p></RequireAuth></AuthProvider>);
    expect(screen.queryByText("secret")).toBeNull();
    expect(screen.getByRole("status")).toBeInTheDocument();
    await waitFor(() => expect(redirect).toHaveBeenCalledWith({ to: "/compte/connexion", search: { redirect: "/compte/profil" } }));
    expect(screen.queryByText("secret")).toBeNull();
  });

  it("renders the page for a logged-in visitor", async () => {
    localStorage.setItem(SESSION_KEY, "1");
    const redirect = vi.fn();
    render(<AuthProvider><RequireAuth href="/compte" redirect={redirect}><p>secret</p></RequireAuth></AuthProvider>);
    expect(await screen.findByText("secret")).toBeInTheDocument();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("puts every /compte/* page behind the guarded layout, except the login page", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    const ids = (p: string) => router.matchRoutes(p).map((m) => m.routeId);
    for (const p of ["/compte", "/compte/commandes", "/compte/commandes/BI-20261004-X9WA", "/compte/adresses", "/compte/profil"]) {
      expect(ids(p), p).toContain("/compte");
    }
    expect(ids("/compte/connexion")).not.toContain("/compte");
    expect(ids("/compte/connexion").at(-1)).toBe("/compte_/connexion");
  });

  it("keeps account pages out of the sitemap", () => {
    expect(sitemapPaths().some((p) => p.startsWith("/compte"))).toBe(false);
  });
});

describe("seed data", () => {
  it("has a profile, 2 addresses with one default and 3 orders with the expected statuses", () => {
    const d = seedAccount();
    expect(d.profile.city).toBe("Kénitra");
    expect(d.addresses).toHaveLength(2);
    expect(d.addresses.filter((a) => a.isDefault)).toHaveLength(1);
    expect(d.orders.map((o) => o.status).sort()).toEqual(["Confirmée", "En livraison", "Livrée"]);
  });

  it("computes order totals with the commerce helpers", () => {
    for (const o of seedAccount().orders) {
      expect(o.items.length).toBeGreaterThan(0);
      const zone = seedAccount().addresses.find((a) => getZone(a.zone)?.label === o.address.city)!.zone;
      const tot = cartTotals(o.items, zone);
      expect(o.subtotal).toBe(tot.subtotal);
      expect(o.fee).toBe(tot.fee);
      expect(o.total).toBe(tot.total);
    }
  });

  it("returns a fresh copy each time (reset never shares state)", () => {
    const a = seedAccount();
    a.profile.name = "Modifié";
    expect(seedAccount().profile.name).toBe(site.demoAccount.name);
  });

  it("keeps exactly one default address", () => {
    const list = seedAccount().addresses.map((a) => ({ ...a, isDefault: false }));
    expect(normalizeAddresses(list).filter((a) => a.isDefault)).toHaveLength(1);
  });
});

describe("order saving", () => {
  const values = { ...emptyCheckout, name: "Client Démo", phone: "06 00 00 00 00", zone: "kenitra", district: "Bir Rami", address: "Rue exemple 12, appt 3", cgv: true };
  const items = [{ name: "Smart TV 55\" 4K UHD", price: 5499, qty: 1 }];

  it("converts a WhatsApp recap into an account order with status Envoyée", () => {
    const recap = buildRecap(values, items, new Date(2026, 9, 6), () => 0.5);
    const order = orderFromRecap(recap, ["smart-tv-55-4k-uhd"]);
    expect(order.status).toBe("Envoyée");
    expect(order.ref).toBe(recap.ref);
    expect(order.total).toBe(recap.total);
    expect(order.items[0]).toMatchObject({ slug: "smart-tv-55-4k-uhd", qty: 1, price: 5499 });
    expect(order.address).toEqual({ city: "Kénitra", district: "Bir Rami", address: "Rue exemple 12, appt 3" });
  });

  it("adds the order first in the account and persists it", async () => {
    localStorage.setItem(SESSION_KEY, "1");
    const { result } = await hydratedAuth();
    const before = result.current.orders.length;
    const order = { ...orderFromRecap(buildRecap(values, items), ["smart-tv-55-4k-uhd"]), createdAt: "2030-01-01T00:00:00.000Z" };
    act(() => result.current.addOrder(order));
    expect(result.current.orders).toHaveLength(before + 1);
    expect(result.current.orders[0]?.ref).toBe(order.ref);
    await waitFor(() => expect(JSON.parse(localStorage.getItem(ACCOUNT_KEY)!).orders[0].ref).toBe(order.ref));

    act(() => result.current.resetDemo());
    expect(result.current.orders).toHaveLength(seedAccount().orders.length);
  });

  it("prefills checkout from the profile without overwriting a draft", () => {
    const d = seedAccount();
    const def = d.addresses.find((a) => a.isDefault)!;
    const filled = prefillFromAccount(emptyCheckout, d.profile, def);
    expect(filled).toMatchObject({ name: d.profile.name, phone: d.profile.phone, zone: def.zone, district: def.district, address: def.address });
    const draft = prefillFromAccount({ ...emptyCheckout, name: "Autre", address: "Mon adresse saisie" }, d.profile, def);
    expect(draft.name).toBe("Autre");
    expect(draft.address).toBe("Mon adresse saisie");
  });
});
