import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Refrigerator, WashingMachine, CookingPot, Tv, AirVent, Blend, Sofa, BedDouble, UtensilsCrossed, Archive,
  Truck, Banknote, ShieldCheck, Store, type LucideIcon,
} from "lucide-react";
import type { IconKey } from "@/data/categories";
import { t } from "@/i18n/fr";
import { getImage } from "@/lib/images";
import { getCategory } from "@/lib/catalogue";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

export const categoryIcons: Record<IconKey, LucideIcon> = {
  fridge: Refrigerator, washer: WashingMachine, oven: CookingPot, tv: Tv, ac: AirVent, blender: Blend,
  sofa: Sofa, bed: BedDouble, dining: UtensilsCrossed, wardrobe: Archive,
};

export const iconForCategory = (slug: string | undefined): LucideIcon => categoryIcons[getCategory(slug)?.icon ?? "fridge"];

/**
 * Logo officiel (src/assets/belle-image-logo.png, via getImage("logo")) : badge rond sur fond blanc.
 * Sans fichier, badge de repli dans le style de la marque (cercle rouge + rangée d'étoiles).
 */
export function Logo({ className = "h-11 w-11" }: { className?: string }) {
  const src = getImage("logo");
  if (src) {
    return (
      <img
        src={src}
        alt={`${site.name} — ${site.nameAr}`}
        width={447}
        height={447}
        decoding="async"
        className={cn(className, "shrink-0 rounded-full bg-white object-cover")}
      />
    );
  }
  return (
    <span role="img" aria-label={`${site.name} — ${site.nameAr}`} className={cn(className, "relative grid shrink-0 place-items-center rounded-full bg-primary text-primary-foreground")}>
      <span className="absolute inset-[3px] rounded-full border-2 border-primary-foreground/80" aria-hidden />
      <span className="relative flex flex-col items-center leading-none">
        <Stars className="text-primary-foreground" size={7} />
        <span className="mt-0.5 font-display text-[0.55em] font-extrabold tracking-tight">BI</span>
      </span>
    </span>
  );
}

/** Signature : cinq étoiles, celle du centre plus grande. */
export function Stars({ className = "text-primary", size = 14 }: { className?: string; size?: number }) {
  const sizes = [0.7, 0.85, 1.25, 0.85, 0.7];
  return (
    <span className={`inline-flex items-center gap-[3px] ${className}`} aria-hidden>
      {sizes.map((s, i) => (
        <svg key={i} width={size * s} height={size * s} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.6 7L12 17.5 5.8 21.2l1.6-7L2 9.5l7.1-.6z" />
        </svg>
      ))}
    </span>
  );
}

export function StarDivider() {
  return (
    <div className="flex items-center justify-center gap-4 py-2" aria-hidden>
      <span className="h-px w-16 bg-border" />
      <Stars />
      <span className="h-px w-16 bg-border" />
    </div>
  );
}

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
    >
      {children}
    </motion.div>
  );
}
export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.2, 0.7, 0.2, 1] as const } },
};

export function CountUp({ to, suffix = "", prefix = "" }: { to: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) return setV(to);
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1400);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, reduce]);
  return <span ref={ref} className="tabular">{prefix}{v.toLocaleString("fr-FR").replace(/\u202f/g, " ")}{suffix}</span>;
}

export function SectionTitle({ eyebrow, title, action, light, id }: { eyebrow?: string | undefined; title: string; action?: ReactNode; light?: boolean; id?: string }) {
  return (
    <div className="mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
      <div className="min-w-0">
        {eyebrow && <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary"><Stars size={10} />{eyebrow}</p>}
        <h2 id={id} className={`text-3xl font-extrabold md:text-4xl ${light ? "text-ink-foreground" : "text-ink"}`}>{title}</h2>
      </div>
      {action}
    </div>
  );
}

const reassuranceIcons = [Banknote, Truck, ShieldCheck, Store];
export function Reassurance({ compact, dark }: { compact?: boolean; dark?: boolean }) {
  return (
    <div className={`grid grid-cols-2 gap-3 md:grid-cols-4 ${compact ? "" : "md:gap-4"}`}>
      {t.reassurance.map((r, i) => {
        const Icon = reassuranceIcons[i] ?? Store;
        return (
          <div key={r.title} className={`flex items-center gap-3 rounded-2xl p-4 ${dark ? "bg-ink-foreground/5" : "bg-surface"}`}>
            <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${dark ? "bg-primary text-primary-foreground" : "bg-background text-primary shadow-card"}`}><Icon className="h-5 w-5" /></span>
            <div className="min-w-0">
              <p className={`text-sm font-bold leading-tight ${dark ? "text-ink-foreground" : "text-ink"}`}>{r.title}</p>
              <p className={`text-xs ${dark ? "text-ink-muted" : "text-muted-foreground"}`}>{r.text}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Badge circulaire « Qualité garantie » avec l'arc rouge et les étoiles. */
export function QualityBadge({ className = "" }: { className?: string }) {
  return (
    <div className={cn("grid h-28 w-28 place-items-center rounded-full bg-background shadow-lift", className)}>
      <div className="grid h-[88%] w-[88%] place-items-center rounded-full border-[5px] border-primary text-center">
        <div>
          <Stars size={10} />
          <p className="mt-1 font-display text-[11px] font-extrabold uppercase leading-tight tracking-wide text-ink">{t.home.heroBadge}</p>
          <p className="text-[10px] font-semibold text-muted-foreground">depuis {site.foundedYear}</p>
        </div>
      </div>
    </div>
  );
}

/** Carte Google Maps intégrée (chargement différé). */
export function MapEmbed({ className = "" }: { className?: string }) {
  return (
    <iframe
      title={t.common.mapTitle}
      src={site.mapEmbed}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className={cn("h-full min-h-[280px] w-full rounded-2xl border-0 bg-surface", className)}
    />
  );
}

export function SampleNote({ children = t.product.sample, className = "" }: { children?: ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center rounded bg-primary-soft px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-primary-deep", className)}>{children}</span>;
}
