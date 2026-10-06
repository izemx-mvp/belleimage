import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { Heart, ShoppingBag, Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { brandName, discount, type Product } from "@/lib/catalogue";
import { formatPrice } from "@/lib/commerce";
import { useShop } from "@/store/shop";
import { iconForCategory, staggerItem } from "./brand";
import { SmartImage } from "./smart-image";
import { t } from "@/i18n/fr";
import { cn } from "@/lib/utils";

export function Price({ p, size = "md" }: { p: Product; size?: "sm" | "md" | "lg" }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      <span className={cn("tabular font-display font-extrabold text-primary", size === "lg" ? "text-4xl" : size === "sm" ? "text-base" : "text-xl")}>{formatPrice(p.price)}</span>
      {p.oldPrice && (
        <span className={cn("tabular text-muted-foreground line-through", size === "lg" ? "text-lg" : "text-sm")}>
          <span className="sr-only">Prix précédent : </span>{formatPrice(p.oldPrice)}
        </span>
      )}
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

export function DiscountBadge({ p, className = "" }: { p: Product; className?: string }) {
  const d = discount(p);
  if (!d) return null;
  return <span className={cn("tabular rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground shadow-red", className)}>-{d}%</span>;
}

/** Compte à rebours : rendu côté client uniquement (rien au SSR → pas d'écart d'hydratation). */
export function Countdown({ to, className = "" }: { to: string; className?: string }) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setLeft(Math.max(0, new Date(to).getTime() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [to]);
  if (left == null || left === 0) return null;
  const d = Math.floor(left / 86400000), h = Math.floor((left / 3600000) % 24), m = Math.floor((left / 60000) % 60), s = Math.floor((left / 1000) % 60);
  return (
    <span className={cn("tabular inline-flex items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-ink-foreground", className)} aria-label={`${t.product.dealEnds} ${d} jours ${h} heures`}>
      <Clock className="h-3 w-3" aria-hidden />{d}j {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
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
      aria-label={on ? t.product.favRemove : t.product.favAdd}
      className={cn("grid h-9 w-9 place-items-center rounded-full bg-background shadow-card transition hover:scale-110", className)}
    >
      <Heart className={`h-4 w-4 ${on ? "fill-primary text-primary" : "text-ink"}`} />
    </button>
  );
}

export function ProductThumb({ p, className = "", compact }: { p: Product; className?: string; compact?: boolean }) {
  return <SmartImage name={p.image} alt={p.name} icon={iconForCategory(p.category)} aspect="1 / 1" fit="contain" compact={compact ?? true} className={className} />;
}

export function ProductCard({ p, layout = "grid", priority }: { p: Product; layout?: "grid" | "list"; priority?: boolean }) {
  const { add } = useShop();
  const imgRef = useRef<HTMLDivElement>(null);
  const Icon = iconForCategory(p.category);

  const addBtn = (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); add(p.slug, { from: imgRef.current }); }}
      className="btn btn-primary w-full py-2.5 text-sm"
      aria-label={`${t.cart.add} : ${p.name}`}
    >
      <ShoppingBag className="h-4 w-4" aria-hidden />{t.cart.add}
    </button>
  );

  if (layout === "list") {
    return (
      <motion.article variants={staggerItem} className="group grid grid-cols-[112px_minmax(0,1fr)] gap-4 rounded-2xl border bg-card p-3 transition hover:shadow-lift sm:grid-cols-[180px_minmax(0,1fr)_210px]">
        <Link to="/produit/$slug" params={{ slug: p.slug }} className="relative overflow-hidden rounded-xl" tabIndex={-1} aria-hidden>
          <div ref={imgRef} className="transition duration-500 group-hover:scale-[1.04]">
            <SmartImage name={p.image} alt={p.name} icon={Icon} aspect="1 / 1" fit="contain" compact priority={priority} className="rounded-xl" />
          </div>
          <DiscountBadge p={p} className="absolute left-2 top-2 px-2 py-0.5 text-[11px]" />
        </Link>
        <div className="min-w-0 py-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{brandName(p.brand)}</p>
          <h3 className="mt-0.5 font-display text-lg font-bold leading-snug text-ink"><Link to="/produit/$slug" params={{ slug: p.slug }} className="hover:text-primary">{p.name}</Link></h3>
          <p className="mt-1 text-sm text-muted-foreground">{p.specLine}</p>
          <div className="mt-2 flex flex-wrap gap-2"><StockBadge stock={p.stock} />{p.dealEndsAt && <Countdown to={p.dealEndsAt} />}</div>
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
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-lift"
    >
      <div className="relative overflow-hidden">
        <Link to="/produit/$slug" params={{ slug: p.slug }} className="block" tabIndex={-1} aria-hidden>
          <div ref={imgRef} className="transition duration-500 group-hover:scale-[1.04]">
            <SmartImage name={p.image} alt={p.name} icon={Icon} aspect="1 / 1" fit="contain" priority={priority} />
          </div>
        </Link>
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          <DiscountBadge p={p} />
          {p.isNew && <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-ink-foreground">{t.product.new}</span>}
          {p.dealEndsAt && <Countdown to={p.dealEndsAt} />}
        </div>
        <FavButton slug={p.slug} className="absolute right-3 top-3" />
        <div className="absolute inset-x-3 bottom-3 hidden translate-y-[130%] transition duration-300 group-focus-within:translate-y-0 group-hover:translate-y-0 md:block">{addBtn}</div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{brandName(p.brand)}</p>
        <h3 className="line-clamp-2 font-display font-bold leading-snug text-ink">
          <Link to="/produit/$slug" params={{ slug: p.slug }} className="hover:text-primary">{p.name}</Link>
        </h3>
        <p className="line-clamp-1 text-xs text-muted-foreground">{p.specLine}</p>
        <div className="mt-auto pt-2"><Price p={p} /></div>
        <div className="pt-1"><StockBadge stock={p.stock} /></div>
        <div className="pt-2 md:hidden">{addBtn}</div>
      </div>
    </motion.article>
  );
}

export function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border" aria-hidden>
      <div className="aspect-square animate-pulse bg-surface" />
      <div className="space-y-2 p-4"><div className="h-3 w-1/3 animate-pulse rounded bg-surface-2" /><div className="h-4 w-3/4 animate-pulse rounded bg-surface-2" /><div className="h-5 w-1/2 animate-pulse rounded bg-surface-2" /></div>
    </div>
  );
}

export const gridCols = "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4";

export function SkeletonGrid({ n = 8, className = gridCols }: { n?: number; className?: string }) {
  return (
    <div className={className} role="status" aria-label="Chargement des produits">
      {Array.from({ length: n }, (_, i) => <ProductSkeleton key={i} />)}
    </div>
  );
}

/** Grille de produits avec apparition en cascade (60 ms), une seule fois. */
export function ProductGrid({ products, layout = "grid", className, priorityCount = 0 }: { products: Product[]; layout?: "grid" | "list"; className?: string; priorityCount?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className ?? (layout === "list" ? "grid gap-3" : gridCols)}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
    >
      {products.map((p, i) => <ProductCard key={p.slug} p={p} layout={layout} priority={i < priorityCount} />)}
    </motion.div>
  );
}

/** Carrousel horizontal (scroll-snap) de produits. */
export function ProductRail({ products, label }: { products: Product[]; label: string }) {
  return (
    <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 sm:gap-4 md:-mx-7 md:px-7" role="region" aria-label={label} tabIndex={0}>
      {products.map((p) => (
        <motion.div key={p.slug} className="w-[68%] shrink-0 snap-start sm:w-[42%] md:w-[30%] lg:w-[23%]" initial="show" animate="show">
          <ProductCard p={p} />
        </motion.div>
      ))}
    </div>
  );
}
