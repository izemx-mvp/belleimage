import { ImageIcon, type LucideIcon } from "lucide-react";
import { getImage } from "@/lib/images";
import { imageSpec } from "@/data/images";
import { cn } from "@/lib/utils";

type Props = {
  /** Nom du fichier dans src/assets/images (sans extension). */
  name: string | undefined;
  alt?: string | undefined;
  /** Icône ligne affichée dans le placeholder. */
  icon?: LucideIcon | undefined;
  /** Ratio CSS, ex. "1 / 1", "16 / 9". `undefined` = le parent impose la taille (h-full). */
  aspect?: string | undefined;
  fit?: "cover" | "contain" | undefined;
  priority?: boolean | undefined;
  className?: string | undefined;
  imgClassName?: string | undefined;
  /** Masque le libellé « IMAGE À REMPLACER » (vignettes très petites). */
  compact?: boolean | undefined;
  sizes?: string | undefined;
};

/**
 * Image du système d'images, ou placeholder propre si le fichier manque.
 * Rendu identique serveur/client (aucune dépendance au navigateur).
 */
export function SmartImage({ name, alt, icon: Icon = ImageIcon, aspect, fit = "cover", priority, className, imgClassName, compact, sizes }: Props) {
  const src = getImage(name);
  const spec = name ? imageSpec(name) : undefined;
  const label = alt ?? spec?.alt ?? "";
  const style = aspect ? { aspectRatio: aspect } : undefined;

  if (src) {
    return (
      <div className={cn("relative overflow-hidden", fit === "contain" && "bg-white", !aspect && "h-full", className)} style={style}>
        <img
          src={src}
          alt={label}
          width={spec?.width}
          height={spec?.height}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          // React 19 accepte fetchPriority
          fetchPriority={priority ? "high" : "auto"}
          sizes={sizes}
          className={cn("absolute inset-0 h-full w-full", fit === "contain" ? "object-contain p-[6%]" : "object-cover", imgClassName)}
        />
      </div>
    );
  }

  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      className={cn("relative flex flex-col items-center justify-center overflow-hidden bg-surface", !aspect && "h-full", className)}
      style={style}
    >
      <div className="absolute -bottom-1/3 left-1/2 h-2/3 w-[120%] -translate-x-1/2 rounded-[50%] border-[10px] border-primary/10" aria-hidden />
      <Icon className={cn("relative text-ink/60", compact ? "h-1/2 w-1/2" : "h-[28%] max-h-24 w-[28%] max-w-24")} strokeWidth={1.1} aria-hidden />
    </div>
  );
}
