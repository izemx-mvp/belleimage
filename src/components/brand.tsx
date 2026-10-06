import logo from "@/assets/logo.jpg.asset.json";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Refrigerator, WashingMachine, CookingPot, Tv, AirVent, Blend, Sofa, BedDouble, UtensilsCrossed, Archive,
  Truck, Banknote, ShieldCheck, Store, type LucideIcon,
} from "lucide-react";
import type { IconKey } from "@/data/categories";
import { t } from "@/i18n/fr";

export const logoUrl = logo.url;

export const categoryIcons: Record<IconKey, LucideIcon> = {
  fridge: Refrigerator, washer: WashingMachine, oven: CookingPot, tv: Tv, ac: AirVent, blender: Blend,
  sofa: Sofa, bed: BedDouble, dining: UtensilsCrossed, wardrobe: Archive,
};

export function Logo({ className = "h-11 w-11" }: { className?: string }) {
  return <img src={logo.url} alt="Belle Image — أحسن صورة" className={`${className} rounded-full object-contain`} width={44} height={44} />;
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

export function SectionTitle({ eyebrow, title, action, light }: { eyebrow?: string; title: string; action?: ReactNode; light?: boolean }) {
  return (
    <div className="mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
      <div className="min-w-0">
        {eyebrow && <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary"><Stars size={10} />{eyebrow}</p>}
        <h2 className={`text-3xl font-extrabold md:text-4xl ${light ? "text-ink-foreground" : "text-ink"}`}>{title}</h2>
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
        const Icon = reassuranceIcons[i];
        return (
          <div key={r.title} className={`flex items-center gap-3 rounded-2xl p-4 ${dark ? "bg-ink-foreground/5" : "bg-surface"}`}>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full ${dark ? "bg-primary text-primary-foreground" : "bg-background text-primary shadow-card"}`}><Icon className="h-5 w-5" /></span>
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

export function ProductImage({ icon, label, className = "" }: { icon: IconKey; label?: string; className?: string }) {
  const Icon = categoryIcons[icon];
  return (
    <div className={`relative flex aspect-square w-full flex-col items-center justify-center overflow-hidden bg-surface ${className}`}>
      <div className="absolute -bottom-1/3 left-1/2 h-2/3 w-[120%] -translate-x-1/2 rounded-[50%] border-[10px] border-primary/10" aria-hidden />
      <Icon className="relative h-1/3 w-1/3 text-ink/70" strokeWidth={1.1} aria-hidden />
      <span className="relative mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{label ?? t.product.imagePlaceholder}</span>
    </div>
  );
}

