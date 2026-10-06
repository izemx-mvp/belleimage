// Espace client DÉMO : session et données stockées dans le localStorage de l'appareil.
// Même schéma que src/store/shop.tsx : état initial identique serveur/client, hydratation en effet.
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { seedAccount } from "@/data/account";
import {
  checkCredentials, normalizeAddresses, type AccountData, type AccountOrder, type Address, type Profile,
} from "@/lib/account";

type Auth = {
  /** false au rendu serveur et au premier rendu client. */
  hydrated: boolean;
  isLoggedIn: boolean;
  user: Profile | null;
  addresses: Address[];
  orders: AccountOrder[];
  login: (phone: string, password: string) => boolean;
  logout: () => void;
  updateProfile: (p: Profile) => void;
  saveAddress: (a: Address) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  addOrder: (o: AccountOrder) => void;
  resetDemo: () => void;
};

const Ctx = createContext<Auth | null>(null);
export const SESSION_KEY = "bi_session";
export const ACCOUNT_KEY = "bi_account";

function readAccount(): AccountData {
  try {
    const raw = localStorage.getItem(ACCOUNT_KEY);
    const d = raw ? (JSON.parse(raw) as AccountData) : null;
    if (d && d.profile && Array.isArray(d.addresses) && Array.isArray(d.orders)) return d;
  } catch { /* données illisibles : on repart des données exemple */ }
  return seedAccount();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [data, setData] = useState<AccountData | null>(null);

  useEffect(() => {
    try { setLoggedIn(localStorage.getItem(SESSION_KEY) === "1"); } catch { /* stockage indisponible */ }
    setData(readAccount());
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated || !data) return;
    try { localStorage.setItem(ACCOUNT_KEY, JSON.stringify(data)); } catch { /* ignore */ }
  }, [data, hydrated]);
  useEffect(() => {
    if (!hydrated) return;
    try {
      if (isLoggedIn) localStorage.setItem(SESSION_KEY, "1");
      else localStorage.removeItem(SESSION_KEY);
    } catch { /* ignore */ }
  }, [isLoggedIn, hydrated]);

  const login = useCallback((phone: string, password: string) => {
    const ok = checkCredentials(phone, password);
    if (ok) setLoggedIn(true);
    return ok;
  }, []);
  const logout = useCallback(() => setLoggedIn(false), []);
  const update = useCallback((fn: (d: AccountData) => AccountData) => setData((d) => fn(d ?? seedAccount())), []);

  const value = useMemo<Auth>(() => ({
    hydrated,
    isLoggedIn: hydrated && isLoggedIn,
    user: hydrated && isLoggedIn && data ? data.profile : null,
    addresses: data?.addresses ?? [],
    orders: [...(data?.orders ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    login,
    logout,
    updateProfile: (profile) => update((d) => ({ ...d, profile })),
    saveAddress: (a) => update((d) => {
      const exists = d.addresses.some((x) => x.id === a.id);
      let list = exists ? d.addresses.map((x) => (x.id === a.id ? a : x)) : [...d.addresses, a];
      if (a.isDefault) list = list.map((x) => ({ ...x, isDefault: x.id === a.id }));
      return { ...d, addresses: normalizeAddresses(list) };
    }),
    deleteAddress: (id) => update((d) => ({ ...d, addresses: normalizeAddresses(d.addresses.filter((x) => x.id !== id)) })),
    setDefaultAddress: (id) => update((d) => ({ ...d, addresses: d.addresses.map((x) => ({ ...x, isDefault: x.id === id })) })),
    addOrder: (o) => update((d) => ({ ...d, orders: [o, ...d.orders.filter((x) => x.ref !== o.ref)] })),
    resetDemo: () => setData(seedAccount()),
  }), [hydrated, isLoggedIn, data, login, logout, update]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}
