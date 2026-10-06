import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { getProductBySlug } from "@/lib/catalogue";
import type { Product } from "@/data/products";
import { track } from "@/lib/commerce";

export type CartLine = { slug: string; qty: number; variant?: string };

type Shop = {
  lines: CartLine[];
  items: { line: CartLine; product: Product }[];
  count: number;
  subtotal: number;
  add: (slug: string, qty?: number, variant?: string, from?: HTMLElement | null) => void;
  setQty: (slug: string, qty: number, variant?: string) => void;
  remove: (slug: string, variant?: string) => void;
  clear: () => void;
  favs: string[];
  toggleFav: (slug: string) => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  assistantOpen: boolean;
  setAssistantOpen: (v: boolean) => void;
  bump: number;
  cartIconRef: React.MutableRefObject<HTMLElement | null>;
};

const Ctx = createContext<Shop | null>(null);
const CART_KEY = "bi_cart";
const FAV_KEY = "bi_favs";

function flyToCart(from: HTMLElement, to: HTMLElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const a = from.getBoundingClientRect();
  const b = to.getBoundingClientRect();
  const ghost = from.cloneNode(true) as HTMLElement;
  Object.assign(ghost.style, {
    position: "fixed", left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px`, height: `${a.height}px`,
    zIndex: "100", pointerEvents: "none", borderRadius: "16px", overflow: "hidden",
    transition: "transform .7s cubic-bezier(.6,-0.1,.3,1), opacity .7s ease",
  });
  document.body.appendChild(ghost);
  requestAnimationFrame(() => {
    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height / 2);
    ghost.style.transform = `translate(${dx}px, ${dy}px) scale(0.08)`;
    ghost.style.opacity = "0.3";
  });
  setTimeout(() => ghost.remove(), 720);
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [favs, setFavs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const cartIconRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    try {
      setLines(JSON.parse(localStorage.getItem(CART_KEY) || "[]"));
      setFavs(JSON.parse(localStorage.getItem(FAV_KEY) || "[]"));
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(lines)); }, [lines, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem(FAV_KEY, JSON.stringify(favs)); }, [favs, hydrated]);

  const same = (l: CartLine, slug: string, variant?: string) => l.slug === slug && (l.variant ?? "") === (variant ?? "");

  const add = useCallback((slug: string, qty = 1, variant?: string, from?: HTMLElement | null) => {
    setLines((prev) => {
      const ex = prev.find((l) => same(l, slug, variant));
      if (ex) return prev.map((l) => (same(l, slug, variant) ? { ...l, qty: l.qty + qty } : l));
      return [...prev, { slug, qty, variant }];
    });
    const p = getProductBySlug(slug);
    track("add_to_cart", { item_id: slug, item_name: p?.name, price: p?.price, quantity: qty, currency: "MAD" });
    const delay = from && cartIconRef.current ? (flyToCart(from, cartIconRef.current), 650) : 0;
    setTimeout(() => { setBump((b) => b + 1); setCartOpen(true); }, delay);
  }, []);

  const setQty = useCallback((slug: string, qty: number, variant?: string) => {
    setLines((prev) => prev.map((l) => (same(l, slug, variant) ? { ...l, qty: Math.max(1, Math.min(99, qty)) } : l)));
  }, []);
  const remove = useCallback((slug: string, variant?: string) => setLines((prev) => prev.filter((l) => !same(l, slug, variant))), []);
  const clear = useCallback(() => setLines([]), []);
  const toggleFav = useCallback((slug: string) => setFavs((f) => (f.includes(slug) ? f.filter((x) => x !== slug) : [...f, slug])), []);

  const value = useMemo<Shop>(() => {
    const items = lines.flatMap((line) => {
      const product = getProductBySlug(line.slug);
      return product ? [{ line, product }] : [];
    });
    return {
      lines, items,
      count: items.reduce((s, i) => s + i.line.qty, 0),
      subtotal: items.reduce((s, i) => s + i.line.qty * i.product.price, 0),
      add, setQty, remove, clear, favs, toggleFav,
      cartOpen, setCartOpen, assistantOpen, setAssistantOpen, bump, cartIconRef,
    };
  }, [lines, favs, cartOpen, assistantOpen, bump, add, setQty, remove, clear, toggleFav]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useShop() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useShop must be used within ShopProvider");
  return c;
}
