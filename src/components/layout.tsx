import { Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import {
  Search, Heart, ShoppingBag, Menu, X, ChevronDown, Phone, MapPin, Clock, Facebook, Instagram, Minus, Plus, Trash2, ChevronRight, MessageCircle, Percent, ArrowRight,
  ArrowUp, Banknote, Mail, Navigation, ShieldCheck, Store, Truck,
} from "lucide-react";
import { site } from "@/config/site";
import { t } from "@/i18n/fr";
import { getCategoriesByPillar, getPillars, searchCategories, searchProducts, getPromotions, pillarOf, discount, type Pillar } from "@/lib/catalogue";
import { formatPrice, track, waLink, telLink, cartTotals } from "@/lib/commerce";
import { useShop } from "@/store/shop";
import { cn } from "@/lib/utils";
import { Logo, Stars, categoryIcons } from "./brand";
import { ProductThumb } from "./product";
import { SmartImage } from "./smart-image";
import { AccountMenu } from "./sections/account/account-menu";

/* ---------------- Top bar ---------------- */
export function TopBar() {
  return (
    <div className="bg-ink text-ink-foreground">
      <div className="container-x flex h-9 items-center justify-between gap-4 text-xs">
        <div className="hidden items-center gap-6 md:flex">
          {t.topbar.map((x) => (
            <span key={x} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-primary" />
              {x}
            </span>
          ))}
        </div>
        <div className="h-6 overflow-hidden md:hidden" aria-live="off">
          <div className="animate-rotate-lines">
            {t.topbar.map((x) => <p key={x} className="flex h-6 items-center leading-6">{x}</p>)}
          </div>
        </div>
        <a href={telLink} onClick={() => track("phone_click", { location: "topbar" })} className="tabular flex shrink-0 items-center gap-1.5 font-semibold hover:text-primary">
          <Phone className="h-3.5 w-3.5" />
          {site.phone}
        </a>
      </div>
    </div>
  );
}

/* ---------------- Search ---------------- */
export function SearchBox({ onDone }: { onDone?: () => void }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const listId = useId();
  const prods = q.length > 1 ? searchProducts(q, 5) : [];
  const cats = q.length > 1 ? searchCategories(q).slice(0, 3) : [];

  useEffect(() => {
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const go = () => {
    const query = q.trim();
    if (!query) return;
    navigate({ to: "/boutique", search: { q: query } });
    setOpen(false);
    onDone?.();
  };
  // Flèches haut/bas : navigation dans les suggestions.
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { setOpen(false); return; }
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const items = Array.from(ref.current?.querySelectorAll<HTMLElement>("[data-suggest]") ?? []);
    if (!items.length) return;
    e.preventDefault();
    const i = items.indexOf(document.activeElement as HTMLElement);
    const next = e.key === "ArrowDown" ? (i + 1) % items.length : (i <= 0 ? items.length - 1 : i - 1);
    items[next]?.focus();
  };

  return (
    <div ref={ref} className="relative w-full" onKeyDown={onKey}>
      <form role="search" onSubmit={(e) => { e.preventDefault(); go(); }} className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <button type="submit" aria-label="Rechercher" className="absolute right-1.5 top-1/2 grid h-8 -translate-y-1/2 place-items-center rounded-full bg-primary px-3 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary-deep sm:px-4">
          <span className="hidden sm:inline">Rechercher</span>
          <ArrowRight className="h-4 w-4 sm:hidden" aria-hidden />
        </button>
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={t.search.placeholder}
          aria-label={t.search.placeholder}
          role="combobox"
          aria-expanded={open && q.length > 1}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          enterKeyHint="search"
          type="search"
          className="h-11 w-full rounded-full border-[1.5px] border-transparent bg-surface pl-11 pr-14 text-sm sm:pr-28 transition-colors hover:border-input focus:border-ring focus:bg-background focus:outline-none"
        />
      </form>
      <AnimatePresence>
        {open && q.length > 1 && (
          <motion.div id={listId} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border bg-popover shadow-lift">
            {!prods.length && !cats.length && <p className="p-4 text-sm text-muted-foreground">{t.search.none}</p>}
            {cats.length > 0 && (
              <div className="border-b p-2">
                <p className="px-2 py-1 text-xs font-semibold text-muted-foreground">{t.search.categories}</p>
                {cats.map((c) => (
                  <Link key={c.slug} data-suggest to="/boutique/$category" params={{ category: c.slug }} onClick={() => { setOpen(false); onDone?.(); }} className="block rounded-lg px-2 py-2 text-sm font-medium hover:bg-surface focus:bg-surface">{c.name}</Link>
                ))}
              </div>
            )}
            {prods.length > 0 && (
              <div className="p-2">
                <p className="px-2 py-1 text-xs font-semibold text-muted-foreground">{t.search.products}</p>
                {prods.map((p) => (
                  <Link key={p.slug} data-suggest to="/produit/$slug" params={{ slug: p.slug }} onClick={() => { setOpen(false); onDone?.(); }} className="grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-surface focus:bg-surface">
                    <ProductThumb p={p} className="rounded-md" />
                    <span className="truncate text-sm">{p.name}</span>
                    <span className="tabular text-sm font-bold text-primary">{formatPrice(p.price)}</span>
                  </Link>
                ))}
                <button data-suggest onClick={go} className="mt-1 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm font-semibold text-primary hover:bg-surface">
                  {t.search.seeAll}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Header ---------------- */
/** true dès que la page défile : le header se compacte (SSR : false). */
function useScrolled(offset = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > offset);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [offset]);
  return scrolled;
}

const megaPerks = [
  { icon: Banknote, label: "Paiement à la livraison" },
  { icon: Truck, label: "Livraison à domicile" },
  { icon: ShieldCheck, label: "Garantie constructeur" },
];

function MegaPanel({ pillar, onClose }: { pillar: Pillar; onClose: () => void }) {
  const cats = getCategoriesByPillar(pillar);
  const info = getPillars().find((p) => p.slug === pillar);
  const best = getPromotions().filter((p) => pillarOf(p) === pillar)[0];
  return (
    <motion.div id={`mega-${pillar}`} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}
      className="absolute inset-x-0 top-full bg-background text-foreground shadow-lift">
      <div className="container-x grid grid-cols-[minmax(0,1fr)_280px] gap-10 py-9">
        <div className="flex flex-col">
          <div className="grid grid-cols-3 gap-x-8 gap-y-8">
            {cats.map((c) => {
              const Icon = categoryIcons[c.icon];
              return (
                <div key={c.slug}>
                  <Link to="/boutique/$category" params={{ category: c.slug }} onClick={onClose} className="group flex items-center gap-3">
                    <span className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-surface-2">
                      <SmartImage name={c.image} alt="" icon={Icon} className="h-full w-full transition-transform duration-500 group-hover:scale-110" />
                    </span>
                    <span className="font-display text-[1.02rem] font-bold leading-tight text-ink transition-colors group-hover:text-primary">{c.name}</span>
                  </Link>
                  <ul className="mt-3 space-y-1.5 pl-[68px]">
                    {c.subcategories.map((s) => (
                      <li key={s.slug}><Link to="/boutique/$category/$subcategory" params={{ category: c.slug, subcategory: s.slug }} onClick={onClose} className="text-sm text-muted-foreground transition-colors hover:text-primary">{s.name}</Link></li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t pt-6">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground">
              {megaPerks.map((p) => (
                <li key={p.label} className="flex items-center gap-2"><p.icon className="h-4 w-4 text-primary" aria-hidden />{p.label}</li>
              ))}
            </ul>
            <Link to="/boutique" search={{ pillar }} onClick={onClose} className="btn btn-ink">
              {t.nav.seeCategory} {info?.name.toLowerCase()}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
        <Link to="/promotions" onClick={onClose} className="group relative block overflow-hidden rounded-[1.75rem] bg-ink text-ink-foreground">
          <SmartImage name={info?.promoImage} icon={categoryIcons[cats[0]?.icon ?? "fridge"]} aspect="3 / 4" className="transition duration-700 group-hover:scale-[1.04]" />
          {best && (
            <span className="absolute right-4 top-4 grid h-20 w-20 -rotate-[10deg] place-items-center rounded-full bg-primary text-center shadow-red ring-4 ring-ink">
              <span>
                <span className="block text-[10px] font-semibold leading-none">jusqu'à</span>
                <span className="tabular block font-display text-2xl font-extrabold leading-none">-{discount(best)}%</span>
              </span>
            </span>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/85 to-transparent p-5 pt-20">
            <p className="text-sm font-semibold text-primary">{t.nav.promoTile}</p>
            <p className="mt-2 flex items-center gap-1.5 font-display text-lg font-bold">
              {t.nav.promoTileCta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </p>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}

const navLinks = [
  { to: "/marques", label: t.nav.brands },
  { to: "/a-propos", label: t.nav.showroom },
  { to: "/conseils", label: t.nav.advice },
  { to: "/contact", label: t.nav.contact },
] as const;

export function Header() {
  const { count, subtotal, setCartOpen, favs, bump, cartIconRef } = useShop();
  const [mega, setMega] = useState<null | Pillar>(null);
  const [mobile, setMobile] = useState(false);
  const scrolled = useScrolled();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const navRef = useRef<HTMLElement>(null);

  const openMega = (p: Pillar) => { clearTimeout(closeTimer.current); setMega(p); };
  const closeMega = () => { closeTimer.current = setTimeout(() => setMega(null), 120); };
  // Clavier : Entrée/Espace/Flèche bas ouvrent le panneau et placent le focus sur le premier lien.
  const openWithKeyboard = (p: Pillar) => {
    setMega(p);
    setTimeout(() => navRef.current?.querySelector<HTMLElement>(`#mega-${p} a`)?.focus(), 30);
  };

  return (
    <header className="sticky top-0 z-40" onKeyDown={(e) => e.key === "Escape" && setMega(null)}>
      {/* Barre principale */}
      <div className={cn("border-b bg-background transition-shadow duration-300", scrolled && "shadow-card")}>
        <div className={cn("container-x grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 transition-[height] duration-300 md:gap-6 lg:gap-10", scrolled ? "h-16" : "h-[84px]")}>
          <div className="flex items-center gap-1.5">
            <button className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface lg:hidden" onClick={() => setMobile(true)} aria-label={t.nav.openMenu}><Menu className="h-5 w-5" /></button>
            <Link to="/" className="group flex items-center gap-3" aria-label="Belle Image, accueil">
              <Logo className={cn("transition-all duration-300", scrolled ? "h-10 w-10" : "h-12 w-12 md:h-[60px] md:w-[60px]")} />
              <span className="hidden leading-none sm:block">
                <span className="block font-display text-xl font-extrabold tracking-[-0.02em] text-ink">Belle Image</span>
                <span className={cn("flex items-center gap-2 overflow-hidden text-xs text-muted-foreground transition-all duration-300", scrolled ? "mt-0 max-h-0 opacity-0" : "mt-1 max-h-5 opacity-100")}>
                  <span lang="ar" dir="rtl" className="font-semibold text-primary">{site.nameAr}</span>
                  <span className="h-3 w-px bg-border" aria-hidden />
                  Kénitra, depuis {site.foundedYear}
                </span>
              </span>
            </Link>
          </div>

          <div className="mx-auto hidden w-full max-w-2xl md:block"><SearchBox /></div>

          <div className="flex items-center justify-end gap-1">
            <a href={telLink} onClick={() => track("phone_click", { location: "header" })} className="group mr-3 hidden items-center gap-3 xl:flex" aria-label={`Appeler le ${site.phone}`}>
              <span className="grid h-11 w-11 place-items-center rounded-full border-[1.5px] border-primary/25 text-primary transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                <Phone className="h-4 w-4" aria-hidden />
              </span>
              <span className="leading-tight">
                <span className="block text-[11px] text-muted-foreground">Conseil et commande</span>
                <span className="tabular block text-sm font-bold text-ink">{site.phone}</span>
              </span>
            </a>
            <Link to="/favoris" className="relative grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-surface" aria-label={t.fav.title}>
              <Heart className="h-5 w-5" />
              {favs.length > 0 && <span className="tabular absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">{favs.length}</span>}
            </Link>
            <AccountMenu />
            <motion.button
              ref={(el) => { cartIconRef.current = el; }}
              key={bump}
              animate={bump ? { scale: [1, 1.12, 0.96, 1] } : {}}
              transition={{ duration: 0.45 }}
              onClick={() => setCartOpen(true)}
              className="ml-1 flex h-11 items-center gap-3 rounded-full bg-ink px-3 text-ink-foreground transition-colors hover:bg-primary lg:pl-4 lg:pr-5"
              aria-label={t.cart.open(count)}
            >
              <span className="relative">
                <ShoppingBag className="h-5 w-5" />
                {count > 0 && <span className="tabular absolute -right-2.5 -top-2.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground ring-2 ring-ink">{count}</span>}
              </span>
              <span className="hidden text-left leading-tight lg:block">
                <span className="block text-[10px] text-ink-muted">{t.cart.title}</span>
                <span className="tabular block text-sm font-bold">{formatPrice(subtotal)}</span>
              </span>
            </motion.button>
          </div>
        </div>
        <div className="container-x pb-3 md:hidden"><SearchBox /></div>
      </div>

      {/* Navigation : bande sombre, comme le rayon d'un grand magasin */}
      <nav ref={navRef} className="relative hidden bg-ink text-ink-foreground lg:block" aria-label={t.nav.mainNav} onMouseLeave={closeMega}
        onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setMega(null); }}>
        <div className="container-x flex h-12 items-center gap-1 text-sm">
          {getPillars().map((p) => (
            <button
              key={p.slug}
              onMouseEnter={() => openMega(p.slug)}
              onClick={(e) => { if (mega === p.slug) setMega(null); else if (e.detail === 0) openWithKeyboard(p.slug); else setMega(p.slug); }}
              onKeyDown={(e) => { if (e.key === "ArrowDown") { e.preventDefault(); openWithKeyboard(p.slug); } }}
              aria-expanded={mega === p.slug}
              aria-controls={`mega-${p.slug}`}
              className={cn("relative flex h-12 items-center gap-2 px-4 font-display text-[0.95rem] font-bold transition-colors", mega === p.slug ? "bg-background text-ink" : "hover:text-primary")}
            >
              <Menu className={cn("h-4 w-4", mega === p.slug ? "text-primary" : "text-ink-muted")} aria-hidden />
              {p.name}
              <ChevronDown className={cn("h-4 w-4 transition", mega === p.slug && "rotate-180")} />
            </button>
          ))}
          <Link to="/promotions" onMouseEnter={() => setMega(null)} className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 font-semibold text-primary-foreground shadow-red transition-transform hover:scale-[1.04]">
            <Percent className="h-3.5 w-3.5" aria-hidden />
            {t.nav.promos}
          </Link>
          <span className="mx-4 h-5 w-px bg-ink-foreground/15" />
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} onMouseEnter={() => setMega(null)} className="relative px-3 py-2 font-medium text-ink-foreground/75 transition-colors hover:text-ink-foreground" activeProps={{ className: "!text-ink-foreground after:absolute after:inset-x-3 after:-bottom-[7px] after:h-[3px] after:rounded-t-full after:bg-primary" }}>
              {l.label}
            </Link>
          ))}
          <span className="ml-auto flex items-center gap-2 text-xs text-ink-muted">
            <Clock className="h-3.5 w-3.5 text-primary" aria-hidden />
            {t.common.openShowroom} {site.hours.label}
          </span>
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
    <Drawer open={open} onClose={onClose} side="left" label={t.nav.menu}>
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-3">
          <Logo className="h-11 w-11" />
          <span className="font-display text-lg font-extrabold text-ink">Belle Image</span>
        </div>
        <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface" aria-label="Fermer"><X className="h-5 w-5" /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <Link to="/promotions" onClick={onClose} className="mb-3 flex items-center justify-between rounded-2xl bg-primary px-4 py-3.5 font-semibold text-primary-foreground">
          <span className="flex items-center gap-2"><Percent className="h-4 w-4" aria-hidden />{t.nav.promos}</span>
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
        {getPillars().map((p) => (
          <div key={p.slug} className="border-b">
            <button onClick={() => setOpenPillar(openPillar === p.slug ? null : p.slug)} aria-expanded={openPillar === p.slug} className="flex w-full items-center justify-between py-4 font-display text-lg font-bold">
              {p.name}
              <ChevronDown className={`h-5 w-5 transition ${openPillar === p.slug ? "rotate-180" : ""}`} />
            </button>
            {openPillar === p.slug && (
              <ul className="pb-3">
                {getCategoriesByPillar(p.slug).map((c) => {
                  const Icon = categoryIcons[c.icon];
                  return (
                    <li key={c.slug}>
                      <Link to="/boutique/$category" params={{ category: c.slug }} onClick={onClose} className="flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-surface">
                        <Icon className="h-5 w-5 text-primary" />
                        {c.name}
                      </Link>
                    </li>
                  );
                })}
                <li>
                  <Link to="/boutique" search={{ pillar: p.slug }} onClick={onClose} className="flex items-center gap-2 rounded-xl px-2 py-2.5 text-sm font-semibold text-primary hover:bg-surface">
                    {t.common.seeAll}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </li>
              </ul>
            )}
          </div>
        ))}
        <div className="mt-4 grid gap-1">
          {[{ to: "/boutique", label: t.nav.allProducts } as const, ...navLinks, { to: "/favoris", label: t.fav.title } as const].map((l) => (
            <Link key={l.to} to={l.to} onClick={onClose} className="flex items-center justify-between rounded-xl px-2 py-3 font-semibold hover:bg-surface">
              {l.label}
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 border-t p-4">
        <a href={telLink} onClick={() => track("phone_click", { location: "mobile_menu" })} className="btn btn-ink w-full px-3"><Phone className="h-4 w-4" aria-hidden />Appeler</a>
        <a href={waLink(t.whatsappDefault)} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { location: "mobile_menu" })} className="btn btn-whatsapp w-full px-3"><WhatsAppIcon className="h-4 w-4" />WhatsApp</a>
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
      <button type="button" className="grid h-8 w-8 place-items-center rounded-full hover:bg-surface disabled:opacity-40" onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label={t.cart.decrease}><Minus className="h-3.5 w-3.5" aria-hidden /></button>
      <span className="tabular w-7 text-center text-sm font-semibold" aria-live="polite">{value}</span>
      <button type="button" className="grid h-8 w-8 place-items-center rounded-full hover:bg-surface" onClick={() => onChange(value + 1)} aria-label={t.cart.increase}><Plus className="h-3.5 w-3.5" aria-hidden /></button>
    </div>
  );
}

export function CartLines({ compact }: { compact?: boolean }) {
  const { items, setQty, remove } = useShop();
  return (
    <ul className="divide-y">
      {items.map(({ line, product }) => (
        <li key={line.slug + (line.variant ?? "")} className={`grid grid-cols-[72px_minmax(0,1fr)] gap-3 py-4 ${compact ? "" : "sm:grid-cols-[96px_minmax(0,1fr)]"}`}>
          <Link to="/produit/$slug" params={{ slug: product.slug }} className="overflow-hidden rounded-xl border" tabIndex={-1} aria-hidden>
            <ProductThumb p={product} />
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
      <div className="relative grid h-24 w-24 place-items-center rounded-full border-[3px] border-primary/25"><Stars size={18} /></div>
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
        <EmptyState title={t.cart.empty} text={t.cart.emptyHint} action={<Link to="/boutique" onClick={close} className="btn btn-primary mt-2">{t.cart.discover}</Link>} />
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-5"><CartLines compact /></div>
          <div className="space-y-3 border-t bg-surface p-5">
            <div className="flex justify-between text-lg font-bold"><span>{t.cart.subtotal}</span><span className="tabular">{formatPrice(subtotal)}</span></div>
            <FreeDeliveryBar subtotal={subtotal} />
            <p className="text-xs text-muted-foreground">{t.cart.deliveryNote}</p>
            <Link to="/commande" onClick={close} className="btn btn-primary w-full">{t.cart.checkout}</Link>
            <Link to="/panier" onClick={close} className="btn btn-outline w-full">{t.cart.viewCart}</Link>
          </div>
        </>
      )}
    </Drawer>
  );
}

export function FreeDeliveryBar({ subtotal }: { subtotal: number }) {
  const { toFreeDelivery } = cartTotals([{ price: subtotal, qty: 1 }]);
  const pct = Math.min(100, Math.round((subtotal / site.freeDeliveryThreshold) * 100));
  return (
    <div>
      <p className="text-xs font-medium text-ink">{toFreeDelivery > 0 ? t.cart.freeFrom(formatPrice(toFreeDelivery)) : t.cart.freeReached}</p>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Progression vers la livraison offerte">
        <div className={`h-full rounded-full transition-all duration-500 ${toFreeDelivery > 0 ? "bg-primary" : "bg-success"}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ---------------- Floating buttons ---------------- */
export function FloatingButtons() {
  const { setAssistantOpen, assistantOpen } = useShop();
  return (
    <div className="fixed bottom-5 right-4 z-50 flex flex-col items-end gap-3 max-md:bottom-24">
      <a
        href={waLink(t.whatsappDefault)}
        target="_blank" rel="noopener noreferrer"
        onClick={() => track("whatsapp_click", { location: "floating" })}
        className="grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-primary-foreground shadow-lift transition hover:scale-105"
        aria-label="Nous écrire sur WhatsApp"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>
      {!assistantOpen && (
        <button onClick={() => setAssistantOpen(true)} className="flex h-14 items-center gap-2 rounded-full bg-ink pl-4 pr-5 text-sm font-semibold text-ink-foreground shadow-lift transition hover:scale-105" aria-label={t.assistant.open}>
          <MessageCircle className="h-5 w-5 text-primary" aria-hidden />
          <span className="hidden sm:inline">{t.assistant.launcher}</span>
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
const infoLinks = [
  ["/livraison-paiement", "Livraison et paiement"],
  ["/garantie-sav", "Garantie et SAV"],
  ["/faq", "Questions fréquentes"],
  ["/conseils", "Conseils"],
  ["/cgv", "CGV"],
  ["/mentions-legales", "Mentions légales"],
] as const;

const footerPerks = [
  { icon: Banknote, label: "Paiement à la livraison" },
  { icon: Truck, label: "Livraison à domicile" },
  { icon: ShieldCheck, label: "Garantie constructeur" },
  { icon: Store, label: "Showroom 7j/7" },
];

export function Footer() {
  return (
    <footer className="mt-24 overflow-hidden bg-ink text-ink-foreground">
      {/* Deux portes d'entrée : le magasin (vitrine) et WhatsApp (commande) */}
      <div className="container-x grid gap-4 pt-14 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:pt-16">
        <div className="group relative isolate flex min-h-[280px] flex-col justify-end overflow-hidden rounded-[2rem] p-7 md:p-9">
          <div className="absolute inset-0 -z-10">
            <SmartImage name="showroom-1" alt="" icon={Store} className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
          </div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/70 to-ink/10" aria-hidden />
          <p className="text-sm font-semibold text-primary">Le showroom</p>
          <p className="mt-2 max-w-md font-display text-3xl font-extrabold leading-[1.05] md:text-4xl">Venez voir, toucher, comparer</p>
          <p className="mt-3 flex items-start gap-2 text-sm text-ink-foreground/80"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />{site.address.full}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={site.mapLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary"><Navigation className="h-4 w-4" aria-hidden />{t.common.directions}</a>
            <Link to="/a-propos" className="btn btn-ghost-light">Découvrir le showroom</Link>
          </div>
        </div>

        <a
          href={waLink(t.whatsappDefault)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("whatsapp_click", { location: "footer_tile" })}
          className="group relative isolate flex min-h-[280px] flex-col justify-between overflow-hidden rounded-[2rem] bg-whatsapp p-7 text-primary-foreground md:p-9"
        >
          <WhatsAppIcon className="absolute -bottom-10 -right-10 -z-10 h-64 w-64 opacity-15 transition-transform duration-700 group-hover:rotate-12" />
          <div>
            <p className="text-sm font-semibold opacity-90">Commande et conseil</p>
            <p className="mt-2 max-w-xs font-display text-3xl font-extrabold leading-[1.05] md:text-4xl">Une question ? Écrivez-nous.</p>
          </div>
          <div>
            <p className="tabular font-display text-2xl font-bold">{site.whatsappDisplay}</p>
            <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-background px-5 py-3 text-sm font-semibold text-ink transition-transform group-hover:translate-x-1">
              <WhatsAppIcon className="h-4 w-4 text-whatsapp" />
              {t.common.writeWhatsapp}
            </span>
          </div>
        </a>
      </div>

      {/* Engagements */}
      <ul className="container-x mt-10 grid grid-cols-2 gap-y-4 border-y border-ink-foreground/10 py-6 lg:grid-cols-4">
        {footerPerks.map((p) => (
          <li key={p.label} className="flex items-center gap-3 text-sm font-medium">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink-foreground/[0.06] text-primary"><p.icon className="h-5 w-5" strokeWidth={1.75} aria-hidden /></span>
            {p.label}
          </li>
        ))}
      </ul>

      <div className="container-x grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-3">
            <Logo className="h-16 w-16" />
            <div>
              <p className="font-display text-xl font-extrabold">Belle Image</p>
              <p lang="ar" dir="rtl" className="text-sm text-primary">{site.nameAr}</p>
            </div>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-muted">
            Depuis {site.foundedYear}, Belle Image équipe les foyers en électroménager et ameublement, avec un grand showroom à Kénitra et environ {site.brandsCount} grandes marques.
          </p>
          <div className="mt-6 flex gap-2">
            <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full border border-ink-foreground/15 transition-colors hover:border-primary hover:bg-primary"><Facebook className="h-4 w-4" /></a>
            <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-ink-foreground/15 transition-colors hover:border-primary hover:bg-primary"><Instagram className="h-4 w-4" /></a>
          </div>
        </div>

        {getPillars().map((p) => (
          <div key={p.slug}>
            <p className="mb-4 font-display font-bold">{p.name}</p>
            <ul className="space-y-2.5 text-sm text-ink-muted">
              {getCategoriesByPillar(p.slug).slice(0, 6).map((c) => (
                <li key={c.slug}><Link to="/boutique/$category" params={{ category: c.slug }} className="transition-colors hover:text-primary">{c.name}</Link></li>
              ))}
              <li><Link to="/boutique" search={{ pillar: p.slug }} className="inline-flex items-center gap-1.5 font-semibold text-ink-foreground transition-colors hover:text-primary">{t.common.seeAll}<ArrowRight className="h-3.5 w-3.5" aria-hidden /></Link></li>
            </ul>
          </div>
        ))}

        <div>
          <p className="mb-4 font-display font-bold">Informations</p>
          <ul className="space-y-2.5 text-sm text-ink-muted">
            {infoLinks.map(([to, l]) => (
              <li key={to}><Link to={to} className="transition-colors hover:text-primary">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div className="space-y-4 text-sm">
          <p className="font-display font-bold">Nous joindre</p>
          <a href={telLink} onClick={() => track("phone_click", { location: "footer" })} className="tabular flex gap-3 text-ink-muted transition-colors hover:text-primary"><Phone className="h-4 w-4 shrink-0 text-primary" />{site.phone}</a>
          <a href={`mailto:${site.email}`} className="flex gap-3 break-all text-ink-muted transition-colors hover:text-primary"><Mail className="h-4 w-4 shrink-0 text-primary" />{site.email}</a>
          <p className="flex gap-3 text-ink-muted"><Clock className="h-4 w-4 shrink-0 text-primary" />{site.hours.label}</p>
        </div>
      </div>

      {/* Grand nom de marque en filigrane, coupé par le bas de page */}
      <div className="container-x pointer-events-none select-none" aria-hidden>
        <p className="-mb-[0.22em] whitespace-nowrap font-display text-[17vw] font-extrabold leading-none tracking-[-0.05em] text-ink-foreground/[0.05] lg:text-[13rem]">
          Belle Image
        </p>
      </div>

      <div className="relative border-t border-ink-foreground/10 bg-ink">
        <div className="container-x flex flex-wrap items-center justify-between gap-3 pb-28 pt-5 text-xs text-ink-muted md:pb-6">
          <p>© {new Date().getFullYear()} Belle Image, Kénitra. Paiement à la livraison, aucun paiement en ligne.</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 rounded-full border border-ink-foreground/15 px-4 py-2 font-semibold text-ink-foreground transition-colors hover:border-primary hover:bg-primary"
          >
            Haut de page
            <ArrowUp className="h-3.5 w-3.5" aria-hidden />
          </button>
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

/** En-tête des pages internes : même langage que l'accueil (anneau fin, titre fort, pas de majuscules). */
export function PageHero({ eyebrow, title, intro, crumbs, children }: { eyebrow?: string; title: string; intro?: string; crumbs?: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b bg-surface">
      <div className="pointer-events-none absolute -right-32 -top-48 h-[28rem] w-[28rem] rounded-full border-[3px] border-primary/20" aria-hidden />
      <div className="pointer-events-none absolute -right-10 -top-24 h-[18rem] w-[18rem] rounded-full border-[3px] border-primary/10" aria-hidden />
      <div className="container-x relative py-10 md:py-16">
        {crumbs}
        {eyebrow && <p className="mt-8 text-sm font-semibold text-primary">{eyebrow}</p>}
        <h1 className={`${eyebrow ? "mt-2" : "mt-8"} max-w-3xl font-display text-[2.3rem] font-extrabold leading-[1.02] tracking-[-0.03em] text-ink md:text-[3.4rem]`}>
          {title}
          {!/[.?!…]$/.test(title) && <span className="text-primary">.</span>}
        </h1>
        {intro && <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground md:text-lg">{intro}</p>}
        {children}
      </div>
    </section>
  );
}

export function Placeholder({ children }: { children: ReactNode }) {
  return <span className="rounded bg-primary-soft px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-primary-deep">{children}</span>;
}