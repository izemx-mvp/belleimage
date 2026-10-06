import { SkeletonGrid } from "@/components/product";

/** Affiché pendant le chargement d'une route catalogue (pendingComponent). */
export function CataloguePending() {
  return (
    <div>
      <div className="h-48 animate-pulse bg-surface" />
      <div className="container-x py-8"><SkeletonGrid n={8} /></div>
    </div>
  );
}
