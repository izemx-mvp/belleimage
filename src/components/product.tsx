import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/data/products";
import { brandName, discount, getCategory } from "@/lib/catalogue";
import { formatPrice } from "@/lib/commerce";
import { useShop } from "@/store/shop";
import { ProductImage, staggerItem } from "./brand";
import { t } from "@/i18n/fr";

export function Price({ p, size = "md" }: { p: Product; size?: "md" | "lg" }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      <span className={`tabular font-display font-extrabold text-primary ${size === "lg" ? "text-4xl" : "text-xl"}`}>{formatPrice(p.price)}</span>
      {p.oldPrice && <span className={`tabular text-muted-foreground line-through ${size === "lg" ? "text-lg" : "text-sm"}`}>{formatPrice(p.oldPrice)}</span>}
    </div>
  );
}

export function StockBadge({ stock }: { stock: Product["stock"] }) {
  const map = {
    in: ["bg-success-soft text-success", t.product.inStock],
    low: ["bg-primary-soft text-primary-deep", t.product.lowStock],
    order: ["bg-surface-2 text-muted-foreground", t.product.outOfStock],
  } as const;
  const [cls, label] = map[stock];
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${cls}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{label}</span>;
}

export function Countdown({ to }: { to: string }) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setLeft(Math.max(0, new Date(to).getTime() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [to]);
  if (left == null) return null;
  const d = Math.floor(left / 86400000), h = Math.floor((left / 3600000) % 24), m = Math.floor((left / 60000) % 60), s = Math.floor((left / 1000) % 60);
  return (
    <span className="tabular inline-flex items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-ink-foreground">
      <Clock className="h-3 w-3" />{d}j {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
    </span>
  );
}

export function FavButton({ slug, className = "" }: { slug: string; className?: string }) {
  const { favs, toggleFav } = useShop();
  const on = favs.includes(slug);
  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); toggleFav(slug); }}
      aria-pressed={on}
      aria-label={on ? "Retirer des favoris" : "Ajouter aux favoris"}
      className={`grid h-9 w-9 place-items-center rounded-full bg-background shadow-card transition hover:scale-110 ${className}`}
    >
      <Heart className={`h-4 w-4 ${on ? "fill-primary text-primary" : "text-ink"}`} />
    </button>
  );
}

export function ProductCard({ p, layout = "grid" }: { p: Product; layout?: "grid" | "list" }) {
  const { add } = useShop();
  const imgRef = useRef<HTMLDivElement>(null);
  const cat = getCategory(p.category);
  const d = discount(p);

  const addBtn = (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); add(p.slug, 1, undefined, imgRef.current); }}
      className="btn btn-primary w-full py-2.5 text-sm"
    >
      <ShoppingBag className="h-4 w-4" />{t.cart.add}
    </button>
  );

  if (layout === "list") {
    return (
      <motion.article variants={staggerItem} className="group grid grid-cols-[120px_minmax(0,1fr)] gap-4 rounded-2xl border bg-card p-3 transition hover:shadow-lift sm:grid-cols-[180px_minmax(0,1fr)_200px]">
        <Link to="/produit/$slug" params={{ slug: p.slug }} className="relative overflow-hidden rounded-xl">
          <div ref={imgRef}><ProductImage icon={cat?.icon ?? "fridge"} className="rounded-xl transition duration-500 group-hover:scale-[1.04]" /></div>
          {d > 0 && <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground">-{d}%</span>}
        </Link>
        <div className="min-w-0 py-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{brandName(p.brand)}</p>
          <Link to="/produit/$slug" params={{ slug: p.slug }} className="mt-0.5 block font-display text-lg font-bold leading-snug text-ink hover:text-primary">{p.name}</Link>
          <p className="mt-1 text-sm text-muted-foreground">{p.specLine}</p>
          <div className="mt-2"><StockBadge stock={p.stock} /></div>
          <div className="mt-3 sm:hidden"><Price p={p} /></div>
        </div>
        <div className="col-span-2 flex flex-col justify-center gap-3 sm:col-span-1">
          <div className="hidden sm:block"><Price p={p} /></div>
          <div className="flex gap-2">{addBtn}<FavButton slug={p.slug} className="shrink-0 border" /></div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      variants={staggerItem}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-lift"
    >
      <Link to="/produit/$slug" params={{ slug: p.slug }} className="relative block overflow-hidden" aria-label={p.name}>
        <div ref={imgRef} className="transition duration-500 group-hover:scale-[1.04]"><ProductImage icon={cat?.icon ?? "fridge"} /></div>
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {d > 0 && <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground shadow-red">-{d}%</span>}
          {p.isNew && <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-ink-foreground">Nouveau</span>}
          {p.dealEndsAt && <Countdown to={p.dealEndsAt} />}
        </div>
        <div className="absolute inset-x-3 bottom-3 hidden translate-y-[130%] transition duration-300 group-hover:translate-y-0 group-focus-within:translate-y-0 md:block">{addBtn}</div>
      </Link>
      <FavButton slug={p.slug} className="absolute right-3 top-3" />
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{brandName(p.brand)}</p>
        <Link to="/produit/$slug" params={{ slug: p.slug }} className="line-clamp-2 font-display font-bold leading-snug text-ink hover:text-primary">{p.name}</Link>
        <p className="line-clamp-1 text-xs text-muted-foreground">{p.specLine}</p>
        <div className="mt-auto pt-2"><Price p={p} /></div>
        <div className="flex items-center justify-between pt-1"><StockBadge stock={p.stock} /></div>
        <div className="pt-2 md:hidden">{addBtn}</div>
      </div>
    </motion.article>
  );
}

export function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border">
      <div className="aspect-square animate-pulse bg-surface" />
      <div className="space-y-2 p-4"><div className="h-3 w-1/3 animate-pulse rounded bg-surface-2" /><div className="h-4 w-3/4 animate-pulse rounded bg-surface-2" /><div className="h-5 w-1/2 animate-pulse rounded bg-surface-2" /></div>
    </div>
  );
}
