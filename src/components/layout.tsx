import { Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Search, Heart, ShoppingBag, Menu, X, ChevronDown, Phone, MapPin, Clock, Facebook, Instagram, Minus, Plus, Trash2, ChevronRight, MessageCircle,
} from "lucide-react";
import { site } from "@/config/site";
import { t } from "@/i18n/fr";
import { getCategoriesByPillar, getPillars, getProducts, searchCategories, searchProducts, getCategory, discount } from "@/lib/catalogue";
import { formatPrice, track, waLink } from "@/lib/commerce";
import { useShop } from "@/store/shop";
import { Logo, ProductImage, Stars, categoryIcons, Reassurance } from "./brand";

/* ---------------- Top bar ---------------- */
export function TopBar() {
  return (
    <div className="bg-ink text-ink-foreground">
      <div className="container-x flex h-9 items-center justify-between gap-4 text-xs">
        <div className="hidden items-center gap-6 md:flex">
          {t.topbar.map((x) => <span key={x} className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-primary" />{x}</span>)}
        </div>
        <div className="h-6 overflow-hidden md:hidden" aria-live="off">
          <div className="animate-rotate-lines">
            {t.topbar.map((x) => <p key={x} className="flex h-6 items-center leading-6">{x}</p>)}
          </div>
        </div>
        <a href={`tel:${site.phoneIntl}`} onClick={() => track("phone_click", { location: "topbar" })} className="flex shrink-0 items-center gap-1.5 font-semibold hover:text-primary">
          <Phone className="h-3.5 w-3.5" />{site.phone}
        </a>
      </div>
    </div>
  );
}

/* ---------------- Search ---------------- */
function SearchBox({ onDone }: { onDone?: () => void }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const prods = q.length > 1 ? searchProducts(q, 5) : [];
  const cats = q.length > 1 ? searchCategories(q).slice(0, 3) : [];

  useEffect(() => {
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const go = () => { if (!q.trim()) return; navigate({ to: "/boutique", search: { q } as never }); setOpen(false); onDone?.(); };

  return (
    <div ref={ref} className="relative w-full">
      <form role="search" onSubmit={(e) => { e.preventDefault(); go(); }} className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          placeholder={t.search.placeholder}
          aria-label={t.search.placeholder}
          className="h-11 w-full rounded-full border-[1.5px] border-input bg-surface pl-11 pr-4 text-sm focus:border-ring focus:bg-background focus:outline-none"
        />
      </form>
      <AnimatePresence>
        {open && q.length > 1 && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border bg-popover shadow-lift">
            {!prods.length && !cats.length && <p className="p-4 text-sm text-muted-foreground">{t.search.none}</p>}
            {cats.length > 0 && (
              <div className="border-b p-2">
                <p className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{t.search.categories}</p>
                {cats.map((c) => (
                  <Link key={c.slug} to="/boutique/$category" params={{ category: c.slug }} onClick={() => { setOpen(false); onDone?.(); }} className="block rounded-lg px-2 py-2 text-sm font-medium hover:bg-surface">{c.name}</Link>
                ))}
              </div>
            )}
            {prods.length > 0 && (
              <div className="p-2">
                <p className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{t.search.products}</p>
                {prods.map((p) => (
                  <Link key={p.slug} to="/produit/$slug" params={{ slug: p.slug }} onClick={() => { setOpen(false); onDone?.(); }} className="grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-surface">
                    <ProductImage icon={getCategory(p.category)?.icon ?? "fridge"} label=" " className="rounded-md" />
                    <span className="truncate text-sm">{p.name}</span>
                    <span className="tabular text-sm font-bold text-primary">{formatPrice(p.price)}</span>
                  </Link>
                ))}
                <button onClick={go} className="mt-1 w-full rounded-lg px-2 py-2 text-left text-sm font-semibold text-primary hover:bg-surface">{t.search.seeAll} →</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Header ---------------- */
function MegaPanel({ pillar, onClose }: { pillar: "electromenager" | "ameublement"; onClose: () => void }) {
  const cats = getCategoriesByPillar(pillar);
  const promo = getProducts().filter((p) => p.oldPrice && getCategory(p.category)?.pillar === pillar).sort((a, b) => discount(b) - discount(a))[0];
  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}
      className="absolute inset-x-0 top-full border-t bg-background shadow-lift">
      <div className="container-x grid grid-cols-[minmax(0,1fr)_300px] gap-8 py-8">
        <div className="grid grid-cols-3 gap-6">
          {cats.map((c) => {
            const Icon = categoryIcons[c.icon];
            return (
              <div key={c.slug}>
                <Link to="/boutique/$category" params={{ category: c.slug }} onClick={onClose} className="group flex items-center gap-3 font-display font-bold text-ink hover:text-primary">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface text-primary group-hover:bg-primary group-hover:text-primary-foreground"><Icon className="h-5 w-5" /></span>{c.name}
                </Link>
                <ul className="mt-2 space-y-1 pl-[52px]">
                  {c.subcategories.map((s) => (
                    <li key={s.slug}><Link to="/boutique/$category/$subcategory" params={{ category: c.slug, subcategory: s.slug }} onClick={onClose} className="text-sm text-muted-foreground hover:text-primary">{s.name}</Link></li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        {promo && (
          <Link to="/produit/$slug" params={{ slug: promo.slug }} onClick={onClose} className="relative overflow-hidden rounded-2xl bg-ink p-5 text-ink-foreground">
            <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold">-{discount(promo)}%</span>
            <p className="mt-3 font-display text-lg font-bold leading-snug">{promo.name}</p>
            <p className="tabular mt-1 text-2xl font-extrabold text-primary">{formatPrice(promo.price)}</p>
            <p className="mt-3 text-xs text-ink-muted">Offre du moment →</p>
            <div className="absolute -bottom-16 -right-16 h-40 w-40 rounded-full border-[14px] border-primary/60" aria-hidden />
          </Link>
        )}
      </div>
    </motion.div>
  );
}

const navLinks = [
  { to: "/promotions", label: t.nav.promos },
  { to: "/marques", label: t.nav.brands },
  { to: "/a-propos", label: t.nav.showroom },
  { to: "/contact", label: t.nav.contact },
] as const;

export function Header() {
  const { count, setCartOpen, favs, bump, cartIconRef } = useShop();
  const [mega, setMega] = useState<null | "electromenager" | "ameublement">(null);
  const [mobile, setMobile] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();

  const openMega = (p: "electromenager" | "ameublement") => { clearTimeout(closeTimer.current); setMega(p); };
  const closeMega = () => { closeTimer.current = setTimeout(() => setMega(null), 120); };

  return (
    <header className="glass sticky top-0 z-40 border-b" onKeyDown={(e) => e.key === "Escape" && setMega(null)}>
      <div className="container-x grid h-[72px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 lg:gap-8">
        <div className="flex items-center gap-2">
          <button className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface lg:hidden" onClick={() => setMobile(true)} aria-label="Ouvrir le menu"><Menu className="h-5 w-5" /></button>
          <Link to="/" className="flex items-center gap-2.5" aria-label="Belle Image — accueil">
            <Logo />
            <span className="hidden leading-none sm:block">
              <span className="block font-display text-lg font-extrabold text-ink">Belle Image</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Kénitra · depuis 2003</span>
            </span>
          </Link>
        </div>
        <div className="hidden md:block"><SearchBox /></div>
        <div className="flex items-center justify-end gap-1 md:col-auto">
          <Link to="/favoris" className="relative grid h-11 w-11 place-items-center rounded-full hover:bg-surface" aria-label={t.fav.title}>
            <Heart className="h-5 w-5" />
            {favs.length > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />}
          </Link>
          <motion.button
            ref={(el) => { cartIconRef.current = el; }}
            key={bump}
            animate={bump ? { scale: [1, 1.25, 0.9, 1] } : undefined}
            transition={{ duration: 0.45 }}
            onClick={() => setCartOpen(true)}
            className="relative grid h-11 w-11 place-items-center rounded-full bg-ink text-ink-foreground"
            aria-label={`Panier, ${count} article(s)`}
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && <span className="tabular absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">{count}</span>}
          </motion.button>
        </div>
      </div>
      <div className="container-x pb-3 md:hidden"><SearchBox /></div>
      <nav className="relative hidden border-t lg:block" aria-label="Navigation principale" onMouseLeave={closeMega}>
        <div className="container-x flex h-12 items-center gap-1 text-sm font-semibold">
          {getPillars().map((p) => (
            <button
              key={p.slug}
              onMouseEnter={() => openMega(p.slug)}
              onClick={() => setMega(mega === p.slug ? null : p.slug)}
              aria-expanded={mega === p.slug}
              className={`flex h-12 items-center gap-1 px-3 uppercase tracking-wide ${mega === p.slug ? "text-primary" : "text-ink"} hover:text-primary`}
            >
              {p.name}<ChevronDown className={`h-4 w-4 transition ${mega === p.slug ? "rotate-180" : ""}`} />
            </button>
          ))}
          <span className="mx-2 h-5 w-px bg-border" />
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} onMouseEnter={() => setMega(null)} className="px-3 py-2 text-ink hover:text-primary" activeProps={{ className: "text-primary" }}>
              {l.label}
            </Link>
          ))}
          <Link to="/conseils" className="px-3 py-2 text-ink hover:text-primary" activeProps={{ className: "text-primary" }}>{t.nav.advice}</Link>
          <span className="ml-auto flex items-center gap-2 text-xs font-medium text-muted-foreground"><Clock className="h-3.5 w-3.5" />Showroom ouvert {site.hours.label}</span>
        </div>
        <AnimatePresence>
          {mega && <div onMouseEnter={() => openMega(mega)}><MegaPanel pillar={mega} onClose={() => setMega(null)} /></div>}
        </AnimatePresence>
      </nav>
      <MobileMenu open={mobile} onClose={() => setMobile(false)} />
    </header>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [openPillar, setOpenPillar] = useState<string | null>("electromenager");
  return (
    <Drawer open={open} onClose={onClose} side="left" label="Menu">
      <div className="flex items-center justify-between border-b p-4">
        <Logo className="h-10 w-10" />
        <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface" aria-label="Fermer"><X className="h-5 w-5" /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {getPillars().map((p) => (
          <div key={p.slug} className="border-b">
            <button onClick={() => setOpenPillar(openPillar === p.slug ? null : p.slug)} aria-expanded={openPillar === p.slug} className="flex w-full items-center justify-between py-4 font-display text-lg font-bold">
              {p.name}<ChevronDown className={`h-5 w-5 transition ${openPillar === p.slug ? "rotate-180" : ""}`} />
            </button>
            {openPillar === p.slug && (
              <ul className="pb-3">
                {getCategoriesByPillar(p.slug).map((c) => {
                  const Icon = categoryIcons[c.icon];
                  return (
                    <li key={c.slug}>
                      <Link to="/boutique/$category" params={{ category: c.slug }} onClick={onClose} className="flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-surface">
                        <Icon className="h-5 w-5 text-primary" />{c.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
        <div className="mt-4 grid gap-1">
          {[...navLinks, { to: "/conseils", label: t.nav.advice } as const, { to: "/favoris", label: t.fav.title } as const].map((l) => (
            <Link key={l.to} to={l.to} onClick={onClose} className="flex items-center justify-between rounded-xl px-2 py-3 font-semibold hover:bg-surface">{l.label}<ChevronRight className="h-4 w-4 text-muted-foreground" /></Link>
          ))}
        </div>
      </div>
      <div className="border-t p-4">
        <a href={`tel:${site.phoneIntl}`} className="btn btn-ink w-full"><Phone className="h-4 w-4" />{site.phone}</a>
      </div>
    </Drawer>
  );
}

/* ---------------- Drawer primitive ---------------- */
export function Drawer({ open, onClose, side = "right", label, children }: { open: boolean; onClose: () => void; side?: "left" | "right"; label: string; children: ReactNode }) {
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", h);
    setTimeout(() => panelRef.current?.querySelector<HTMLElement>("button, a, input")?.focus(), 50);
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", h); prev?.focus(); };
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60]">
          <motion.div className="absolute inset-0 bg-ink/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            ref={panelRef}
            role="dialog" aria-modal="true" aria-label={label}
            initial={{ x: side === "right" ? "100%" : "-100%" }} animate={{ x: 0 }} exit={{ x: side === "right" ? "100%" : "-100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
            className={`absolute top-0 flex h-full w-[92%] max-w-md flex-col bg-background shadow-lift ${side === "right" ? "right-0" : "left-0"}`}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- Cart drawer ---------------- */
export function QtyStepper({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="inline-flex items-center rounded-full border">
      <button className="grid h-8 w-8 place-items-center rounded-full hover:bg-surface" onClick={() => onChange(value - 1)} aria-label="Diminuer"><Minus className="h-3.5 w-3.5" /></button>
      <span className="tabular w-7 text-center text-sm font-semibold" aria-live="polite">{value}</span>
      <button className="grid h-8 w-8 place-items-center rounded-full hover:bg-surface" onClick={() => onChange(value + 1)} aria-label="Augmenter"><Plus className="h-3.5 w-3.5" /></button>
    </div>
  );
}

export function CartLines({ compact }: { compact?: boolean }) {
  const { items, setQty, remove } = useShop();
  return (
    <ul className="divide-y">
      {items.map(({ line, product }) => (
        <li key={line.slug + (line.variant ?? "")} className={`grid grid-cols-[72px_minmax(0,1fr)] gap-3 py-4 ${compact ? "" : "sm:grid-cols-[96px_minmax(0,1fr)]"}`}>
          <Link to="/produit/$slug" params={{ slug: product.slug }} className="overflow-hidden rounded-xl">
            <ProductImage icon={getCategory(product.category)?.icon ?? "fridge"} label=" " />
          </Link>
          <div className="min-w-0">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
              <Link to="/produit/$slug" params={{ slug: product.slug }} className="line-clamp-2 text-sm font-semibold leading-snug hover:text-primary">{product.name}</Link>
              <button onClick={() => remove(line.slug, line.variant)} className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground hover:bg-surface hover:text-primary" aria-label={`${t.cart.remove} ${product.name}`}><Trash2 className="h-4 w-4" /></button>
            </div>
            {line.variant && <p className="text-xs text-muted-foreground">{line.variant}</p>}
            <div className="mt-2 flex items-center justify-between gap-2">
              <QtyStepper value={line.qty} onChange={(n) => setQty(line.slug, n, line.variant)} />
              <span className="tabular font-bold">{formatPrice(product.price * line.qty)}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="relative grid h-24 w-24 place-items-center rounded-full border-[6px] border-primary/15"><Stars size={18} /></div>
      <p className="font-display text-xl font-bold text-ink">{title}</p>
      {text && <p className="max-w-xs text-sm text-muted-foreground">{text}</p>}
      {action}
    </div>
  );
}

export function CartDrawer() {
  const { cartOpen, setCartOpen, items, subtotal, count } = useShop();
  const close = () => setCartOpen(false);
  return (
    <Drawer open={cartOpen} onClose={close} label={t.cart.title}>
      <div className="flex items-center justify-between border-b p-5">
        <h2 className="font-display text-xl font-extrabold">{t.cart.title} <span className="tabular text-muted-foreground">({count})</span></h2>
        <button onClick={close} className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface" aria-label="Fermer le panier"><X className="h-5 w-5" /></button>
      </div>
      {items.length === 0 ? (
        <EmptyState title={t.cart.empty} text={t.cart.emptyHint} action={<Link to="/boutique" onClick={close} className="btn btn-primary mt-2">Découvrir la boutique</Link>} />
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-5"><CartLines compact /></div>
          <div className="space-y-3 border-t bg-surface p-5">
            <div className="flex justify-between text-lg font-bold"><span>{t.cart.subtotal}</span><span className="tabular">{formatPrice(subtotal)}</span></div>
            <p className="text-xs text-muted-foreground">{t.cart.deliveryNote}</p>
            <Link to="/commande" onClick={close} className="btn btn-primary w-full">{t.cart.checkout}</Link>
            <Link to="/panier" onClick={close} className="btn btn-outline w-full">{t.cart.viewCart}</Link>
          </div>
        </>
      )}
    </Drawer>
  );
}

/* ---------------- Floating buttons ---------------- */
export function FloatingButtons() {
  const { setAssistantOpen, assistantOpen } = useShop();
  return (
    <div className="fixed bottom-5 right-4 z-50 flex flex-col items-end gap-3 max-md:bottom-24">
      <a
        href={waLink("Bonjour Belle Image, j'aimerais avoir des informations.")}
        target="_blank" rel="noopener noreferrer"
        onClick={() => track("whatsapp_click", { location: "floating" })}
        className="grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-primary-foreground shadow-lift transition hover:scale-105"
        aria-label="Nous écrire sur WhatsApp"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>
      {!assistantOpen && (
        <button onClick={() => setAssistantOpen(true)} className="flex h-14 items-center gap-2 rounded-full bg-ink pl-4 pr-5 text-sm font-semibold text-ink-foreground shadow-lift transition hover:scale-105" aria-label={t.assistant.open}>
          <MessageCircle className="h-5 w-5 text-primary" /><span className="hidden sm:inline">Un conseil ?</span>
        </button>
      )}
    </div>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4c-1-1.6-1.5-3.4-1.5-5.2C2.2 6.6 6.6 2.2 12 2.2c2.6 0 5.1 1 6.9 2.9 1.8 1.8 2.9 4.3 2.9 6.9 0 5.4-4.4 9.8-9.8 9.8zM20.5 3.5C18.2 1.2 15.2 0 12 0 5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.8 1 3.8 1.5 5.8 1.5 6.6 0 12-5.4 12-12 0-3.2-1.2-6.2-3.5-8.4z" />
    </svg>
  );
}

/* ---------------- Footer ---------------- */
export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-ink-foreground">
      <div className="container-x border-b border-ink-foreground/10 py-8"><Reassurance compact dark /></div>
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-3"><Logo className="h-14 w-14" /><div><p className="font-display text-xl font-extrabold">Belle Image</p><p className="text-sm text-ink-muted">{site.nameAr}</p></div></div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">Depuis {site.foundedYear}, Belle Image équipe les foyers de Kénitra et de tout le Maroc en électroménager et ameublement, avec un grand showroom et environ {site.brandsCount} grandes marques.</p>
          <Stars className="mt-5 text-primary" />
        </div>
        <div>
          <p className="mb-4 font-display font-bold">Rayons</p>
          <ul className="space-y-2 text-sm text-ink-muted">
            {getPillars().map((p) => getCategoriesByPillar(p.slug).slice(0, 4).map((c) => (
              <li key={c.slug}><Link to="/boutique/$category" params={{ category: c.slug }} className="hover:text-primary">{c.name}</Link></li>
            )))}
          </ul>
        </div>
        <div>
          <p className="mb-4 font-display font-bold">Informations</p>
          <ul className="space-y-2 text-sm text-ink-muted">
            {([["/livraison-paiement", "Livraison & paiement"], ["/garantie-sav", "Garantie & SAV"], ["/faq", "FAQ"], ["/cgv", "CGV"], ["/mentions-legales", "Mentions légales"], ["/a-propos", "Notre showroom"], ["/conseils", "Conseils"]] as const).map(([to, l]) => (
              <li key={to}><Link to={to} className="hover:text-primary">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div className="space-y-3 text-sm">
          <p className="mb-4 font-display font-bold">Showroom</p>
          <a href={site.mapLink} target="_blank" rel="noopener noreferrer" className="flex gap-3 text-ink-muted hover:text-primary"><MapPin className="h-4 w-4 shrink-0 text-primary" />{site.address.full}</a>
          <p className="flex gap-3 text-ink-muted"><Clock className="h-4 w-4 shrink-0 text-primary" />{site.hours.label}</p>
          <a href={`tel:${site.phoneIntl}`} onClick={() => track("phone_click", { location: "footer" })} className="flex gap-3 text-ink-muted hover:text-primary"><Phone className="h-4 w-4 shrink-0 text-primary" />{site.phone}</a>
          <a href={waLink("Bonjour Belle Image")} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { location: "footer" })} className="flex gap-3 text-ink-muted hover:text-primary"><WhatsAppIcon className="h-4 w-4 shrink-0 text-whatsapp" />WhatsApp</a>
          <div className="flex gap-2 pt-2">
            <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full bg-ink-foreground/10 hover:bg-primary"><Facebook className="h-4 w-4" /></a>
            <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full bg-ink-foreground/10 hover:bg-primary"><Instagram className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-ink-foreground/10">
        <div className="container-x flex flex-wrap justify-between gap-2 py-5 text-xs text-ink-muted">
          <p>© {new Date().getFullYear()} Belle Image — أحسن صورة · Kénitra</p>
          <p>Paiement à la livraison · Aucun paiement en ligne</p>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Page helpers ---------------- */
export function Crumbs({ items }: { items: { label: string; href?: ReactNode }[] }) {
  return (
    <nav aria-label="Fil d'Ariane" className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
            {it.href ?? <span className="font-medium text-ink" aria-current="page">{it.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHero({ eyebrow, title, intro, crumbs, children }: { eyebrow?: string; title: string; intro?: string; crumbs?: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-surface">
      <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full border-[28px] border-primary/10" aria-hidden />
      <div className="container-x relative py-10 md:py-14">
        {crumbs}
        {eyebrow && <p className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary"><Stars size={10} />{eyebrow}</p>}
        <h1 className="mt-2 max-w-3xl text-4xl font-extrabold text-ink md:text-5xl">{title}</h1>
        {intro && <p className="mt-3 max-w-2xl text-muted-foreground md:text-lg">{intro}</p>}
        {children}
      </div>
    </section>
  );
}

export function Placeholder({ children }: { children: ReactNode }) {
  return <span className="rounded bg-primary-soft px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-primary-deep">{children}</span>;
}
