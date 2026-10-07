import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { Banknote, Clock, Plus, ShoppingBag } from "lucide-react";
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
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className={cn("tabular font-display font-extrabold tracking-[-0.02em] text-ink", size === "lg" ? "text-4xl" : size === "sm" ? "text-base" : "text-lg sm:text-[1.35rem]")}>
        {formatPrice(p.price)}
      </span>
      {p.oldPrice && (
        <span className={cn("tabular text-muted-foreground line-through decoration-primary/60", size === "lg" ? "text-lg" : "text-sm")}>
          <span className="sr-only">Prix précédent : </span>
          {formatPrice(p.oldPrice)}
        </span>
      )}
    </div>
  );
}

/** Montant économisé, affiché sous le prix quand il y a un ancien prix. */
export function Savings({ p, className = "" }: { p: Product; className?: string }) {
  if (!p.oldPrice || p.oldPrice <= p.price) return null;
  return (
    <span className={cn("tabular inline-flex w-fit rounded-md bg-primary-soft px-2 py-0.5 text-[11px] font-bold text-primary-deep", className)}>
      Économisez {formatPrice(p.oldPrice - p.price)}
    </span>
  );
}

export function StockBadge({ stock }: { stock: Product["stock"] }) {
  const map = {
    in: ["text-success", t.product.inStock],
    low: ["text-primary", t.product.lowStock],
    order: ["text-muted-foreground", t.product.outOfStock],
  } as const;
  const [cls, label] = map[stock];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${cls}`}>
      <span className="relative flex h-2 w-2">
        <span className="absolute inset-0 rounded-full bg-current opacity-25" />
        <span className="relative m-auto h-1.5 w-1.5 rounded-full bg-current" />
      </span>
      {label}
    </span>
  );
}

/** Pastille de remise inclinée : la même étiquette qu'en magasin. */
export function DiscountBadge({ p, className = "" }: { p: Product; className?: string }) {
  const d = discount(p);
  if (!d) return null;
  return (
    <span className={cn("tabular grid h-12 w-12 -rotate-[10deg] place-items-center rounded-full bg-primary font-display text-sm font-extrabold text-primary-foreground shadow-red", className)}>
      -{d}%
    </span>
  );
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
    <span className={cn("tabular inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-ink-foreground", className)} aria-label={`${t.product.dealEnds} ${d} jours ${h} heures`}>
      <Clock className="h-3 w-3 text-primary" aria-hidden />
      {d}j {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
    </span>
  );
}

export function ProductThumb({ p, className = "", compact }: { p: Product; className?: string; compact?: boolean }) {
  return <SmartImage name={p.image} alt={p.name} icon={iconForCategory(p.category)} aspect="1 / 1" fit="contain" compact={compact ?? true} className={className} />;
}

export function ProductCard({ p, layout = "grid", priority }: { p: Product; layout?: "grid" | "list"; priority?: boolean }) {
  const { add } = useShop();
  const imgRef = useRef<HTMLDivElement>(null);
  const Icon = iconForCategory(p.category);
  const onAdd = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); add(p.slug, { from: imgRef.current }); };

  if (layout === "list") {
    return (
      <motion.article variants={staggerItem} className="group grid grid-cols-[112px_minmax(0,1fr)] gap-4 rounded-[1.5rem] border bg-card p-3 transition-colors hover:border-ink sm:grid-cols-[190px_minmax(0,1fr)_220px] sm:gap-6 sm:p-4">
        <Link to="/produit/$slug" params={{ slug: p.slug }} className="relative overflow-hidden rounded-2xl bg-surface" tabIndex={-1} aria-hidden>
          <div ref={imgRef} className="p-3 transition duration-500 group-hover:scale-[1.05]">
            <SmartImage name={p.image} alt={p.name} icon={Icon} aspect="1 / 1" fit="contain" compact priority={priority} />
          </div>
          <DiscountBadge p={p} className="absolute left-2 top-2 h-10 w-10 text-xs" />
        </Link>
        <div className="min-w-0 py-1">
          <p className="text-xs font-medium text-muted-foreground">{brandName(p.brand)}</p>
          <h3 className="mt-1 font-display text-lg font-bold leading-snug text-ink">
            <Link to="/produit/$slug" params={{ slug: p.slug }} className="hover:text-primary">{p.name}</Link>
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground">{p.specLine}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <StockBadge stock={p.stock} />
            {p.dealEndsAt && <Countdown to={p.dealEndsAt} />}
          </div>
          <div className="mt-3 sm:hidden"><Price p={p} /></div>
        </div>
        <div className="col-span-2 flex flex-col justify-center gap-3 border-t pt-3 sm:col-span-1 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
          <div className="hidden sm:block">
            <Price p={p} />
            <Savings p={p} className="mt-1.5" />
          </div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Banknote className="h-3.5 w-3.5 text-primary" aria-hidden />Paiement à la livraison</p>
          <div className="flex gap-2">
            <button type="button" onClick={onAdd} className="btn btn-primary flex-1 py-2.5 text-sm" aria-label={`${t.cart.add} : ${p.name}`}>
              <ShoppingBag className="h-4 w-4" aria-hidden />
              {t.cart.add}
            </button>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      variants={staggerItem}
      className="group relative flex h-full flex-col rounded-[1.5rem] border bg-card p-2 transition-[border-color,box-shadow] duration-300 hover:border-ink/20 hover:shadow-lift"
    >
      {/* Image sur fond gris clair, comme sur un présentoir */}
      <div className="relative overflow-hidden rounded-[1.1rem] bg-surface">
        <Link to="/produit/$slug" params={{ slug: p.slug }} className="block" tabIndex={-1} aria-hidden>
          <div ref={imgRef} className="p-4 transition duration-500 ease-out group-hover:scale-[1.06] sm:p-5">
            <SmartImage name={p.image} alt={p.name} icon={Icon} aspect="1 / 1" fit="contain" priority={priority} />
          </div>
        </Link>
        <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
          <DiscountBadge p={p} />
          {p.isNew && <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-ink-foreground">{t.product.new}</span>}
        </div>
        {p.dealEndsAt && <Countdown to={p.dealEndsAt} className="absolute bottom-2.5 left-2.5" />}
      </div>

      <div className="flex flex-1 flex-col px-2 pb-2 pt-3.5">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-xs font-medium text-muted-foreground">{brandName(p.brand)}</p>
          <StockBadge stock={p.stock} />
        </div>
        <h3 className="mt-1.5 line-clamp-2 font-display text-[0.98rem] font-bold leading-snug text-ink">
          <Link to="/produit/$slug" params={{ slug: p.slug }} className="after:absolute after:inset-0 after:rounded-[1.5rem] hover:text-primary focus-visible:outline-none">
            {p.name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{p.specLine}</p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div className="min-w-0">
            <Price p={p} />
            <Savings p={p} className="mt-1" />
          </div>
          <button
            type="button"
            onClick={onAdd}
            className="relative z-10 grid h-10 w-10 shrink-0 sm:h-11 sm:w-11 place-items-center rounded-full bg-ink text-ink-foreground transition-all duration-300 hover:scale-105 hover:bg-primary group-hover:bg-primary group-hover:shadow-red"
            aria-label={`${t.cart.add} : ${p.name}`}
            title={t.cart.add}
          >
            <Plus className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export function ProductSkeleton() {
  return (
    <div className="rounded-[1.5rem] border p-2" aria-hidden>
      <div className="aspect-square animate-pulse rounded-[1.1rem] bg-surface" />
      <div className="space-y-2.5 px-2 pb-2 pt-4">
        <div className="h-3 w-1/3 animate-pulse rounded-full bg-surface-2" />
        <div className="h-4 w-4/5 animate-pulse rounded-full bg-surface-2" />
        <div className="flex items-end justify-between pt-3">
          <div className="h-6 w-2/5 animate-pulse rounded-full bg-surface-2" />
          <div className="h-11 w-11 animate-pulse rounded-full bg-surface-2" />
        </div>
      </div>
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