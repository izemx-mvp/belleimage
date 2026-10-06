import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { iconForCategory } from "@/components/brand";
import { DiscountBadge } from "@/components/product";
import { SmartImage } from "@/components/smart-image";
import type { Product } from "@/lib/catalogue";
import { getImage } from "@/lib/images";
import { t } from "@/i18n/fr";
import { cn } from "@/lib/utils";

/** Galerie : vignettes + zoom au survol (desktop) + plein écran au clic. */
export function Gallery({ p }: { p: Product }) {
  const images = [p.image, ...p.gallery];
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const Icon = iconForCategory(p.category);
  const current = images[active] ?? p.image;
  const canZoom = Boolean(getImage(current));
  const isPackshot = active === 0;

  useEffect(() => {
    if (!lightbox) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && setLightbox(false);
    document.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [lightbox]);

  return (
    <div className="grid gap-3 md:grid-cols-[72px_minmax(0,1fr)]">
      <div className="order-2 flex gap-2 md:order-1 md:flex-col" role="tablist" aria-label="Images du produit">
        {images.map((img, i) => (
          <button
            key={`${img}-${i}`}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={t.product.view(i + 1)}
            onClick={() => setActive(i)}
            className={cn("w-16 overflow-hidden rounded-xl border-2 transition md:w-full", i === active ? "border-primary" : "border-transparent hover:border-border")}
          >
            <SmartImage name={img} alt="" icon={Icon} aspect="1 / 1" fit={i === 0 ? "contain" : "cover"} compact />
          </button>
        ))}
      </div>
      <div className="relative order-1 md:order-2">
        <div
          className={cn("relative overflow-hidden rounded-3xl border bg-white", canZoom && "cursor-zoom-in")}
          onMouseMove={(e) => {
            if (!canZoom || window.matchMedia("(hover: none)").matches) return;
            const r = e.currentTarget.getBoundingClientRect();
            setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
          }}
          onMouseLeave={() => setZoom(null)}
          onClick={() => canZoom && setLightbox(true)}
        >
          <div
            id="product-main-image"
            className="transition-transform duration-200"
            style={zoom ? { transform: "scale(2)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
          >
            <SmartImage name={current} alt={p.name} icon={Icon} aspect="1 / 1" fit={isPackshot ? "contain" : "cover"} priority />
          </div>
          <DiscountBadge p={p} className="absolute left-4 top-4 text-sm" />
        </div>
        {canZoom && (
          <button type="button" onClick={() => setLightbox(true)} className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-background shadow-card" aria-label={t.product.zoom}>
            <Maximize2 className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div role="dialog" aria-modal="true" aria-label={p.name} className="fixed inset-0 z-[80] grid place-items-center bg-ink/90 p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightbox(false)}>
            <button type="button" autoFocus onClick={() => setLightbox(false)} className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-background" aria-label={t.common.close}><X className="h-5 w-5" aria-hidden /></button>
            <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white" onClick={(e) => e.stopPropagation()}>
              <SmartImage name={current} alt={p.name} icon={Icon} aspect="1 / 1" fit={isPackshot ? "contain" : "cover"} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
