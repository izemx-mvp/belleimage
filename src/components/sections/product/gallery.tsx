import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { iconForCategory } from "@/components/brand";
import { DiscountBadge } from "@/components/product";
import { SmartImage } from "@/components/smart-image";
import type { Product } from "@/lib/catalogue";
import { getImage } from "@/lib/images";
import { t } from "@/i18n/fr";
import { cn } from "@/lib/utils";

/** Galerie : grande image sur présentoir gris, vignettes, zoom au survol, plein écran avec navigation. */
export function Gallery({ p }: { p: Product }) {
  const images = [p.image, ...p.gallery];
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const Icon = iconForCategory(p.category);
  const current = images[active] ?? p.image;
  const canZoom = Boolean(getImage(current));
  const isPackshot = active === 0;
  const many = images.length > 1;
  const go = (d: number) => setActive((i) => (i + d + images.length) % images.length);

  useEffect(() => {
    if (!lightbox) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [lightbox]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="lg:sticky lg:top-40 lg:self-start">
      <div className="grid gap-3 md:grid-cols-[84px_minmax(0,1fr)]">
        {/* Vignettes */}
        <div className="no-scrollbar order-2 flex gap-2 overflow-x-auto md:order-1 md:flex-col md:overflow-visible" role="tablist" aria-label="Images du produit">
          {images.map((img, i) => (
            <button
              key={`${img}-${i}`}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={t.product.view(i + 1)}
              onClick={() => setActive(i)}
              className={cn(
                "w-[72px] shrink-0 overflow-hidden rounded-2xl bg-surface p-1.5 ring-2 ring-offset-2 transition md:w-full",
                i === active ? "ring-primary" : "ring-transparent opacity-70 hover:opacity-100",
              )}
            >
              <SmartImage name={img} alt="" icon={Icon} aspect="1 / 1" fit={i === 0 ? "contain" : "cover"} compact className="rounded-xl" />
            </button>
          ))}
        </div>

        {/* Image principale */}
        <div className="relative order-1 md:order-2">
          <div
            className={cn("relative overflow-hidden rounded-[2rem] bg-surface", canZoom && "cursor-zoom-in")}
            onMouseMove={(e) => {
              if (!canZoom || window.matchMedia("(hover: none)").matches) return;
              const r = e.currentTarget.getBoundingClientRect();
              setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
            }}
            onMouseLeave={() => setZoom(null)}
            onClick={() => canZoom && setLightbox(true)}
          >
            {/* Anneau du logo en filigrane derrière le produit */}
            <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-primary/10" />
            <div
              id="product-main-image"
              className={cn("relative transition-transform duration-200", isPackshot && "p-6 md:p-10")}
              style={zoom ? { transform: "scale(2)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={current} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <SmartImage name={current} alt={p.name} icon={Icon} aspect="1 / 1" fit={isPackshot ? "contain" : "cover"} priority />
                </motion.div>
              </AnimatePresence>
            </div>
            <DiscountBadge p={p} className="absolute left-5 top-5 h-16 w-16 text-lg" />
            {p.isNew && <span className="absolute right-5 top-5 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-ink-foreground">{t.product.new}</span>}
          </div>

          {many && (
            <div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between md:hidden">
              <button type="button" onClick={() => go(-1)} aria-label="Image précédente" className="grid h-10 w-10 place-items-center rounded-full bg-background/90 shadow-card"><ChevronLeft className="h-5 w-5" aria-hidden /></button>
              <button type="button" onClick={() => go(1)} aria-label="Image suivante" className="grid h-10 w-10 place-items-center rounded-full bg-background/90 shadow-card"><ChevronRight className="h-5 w-5" aria-hidden /></button>
            </div>
          )}

          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            {many && <span className="tabular rounded-full bg-background px-3 py-1.5 text-xs font-semibold text-ink shadow-card">{active + 1} / {images.length}</span>}
            {canZoom && (
              <button type="button" onClick={() => setLightbox(true)} className="grid h-10 w-10 place-items-center rounded-full bg-background shadow-card transition hover:bg-ink hover:text-ink-foreground" aria-label={t.product.zoom}>
                <Maximize2 className="h-4 w-4" aria-hidden />
              </button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div role="dialog" aria-modal="true" aria-label={p.name} className="fixed inset-0 z-[80] grid place-items-center bg-ink/95 p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightbox(false)}>
            <button type="button" autoFocus onClick={() => setLightbox(false)} className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-background" aria-label={t.common.close}><X className="h-5 w-5" aria-hidden /></button>
            {many && (
              <>
                <button type="button" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Image précédente" className="absolute left-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-background"><ChevronLeft className="h-5 w-5" aria-hidden /></button>
                <button type="button" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Image suivante" className="absolute right-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-background"><ChevronRight className="h-5 w-5" aria-hidden /></button>
              </>
            )}
            <div className="w-full max-w-3xl overflow-hidden rounded-[2rem] bg-white p-6" onClick={(e) => e.stopPropagation()}>
              <SmartImage name={current} alt={p.name} icon={Icon} aspect="1 / 1" fit={isPackshot ? "contain" : "cover"} />
            </div>
            {many && <p className="tabular absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-ink-foreground/80">{active + 1} / {images.length}</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}