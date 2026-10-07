import { SkeletonGrid } from "@/components/product";

/** Affiché pendant le chargement d'une route catalogue (pendingComponent) : même silhouette que la page. */
export function CataloguePending() {
  return (
    <div aria-busy="true">
      <div className="border-b bg-surface">
        <div className="container-x py-8 md:py-12">
          <div className="h-4 w-48 animate-pulse rounded-full bg-surface-2" />
          <div className="mt-8 h-4 w-24 animate-pulse rounded-full bg-surface-2" />
          <div className="mt-3 h-12 w-2/3 max-w-lg animate-pulse rounded-2xl bg-surface-2" />
          <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded-full bg-surface-2" />
          <div className="mt-7 flex gap-2">
            {Array.from({ length: 5 }, (_, i) => <div key={i} className="h-10 w-28 animate-pulse rounded-full bg-surface-2" />)}
          </div>
        </div>
      </div>
      <div className="container-x grid gap-10 py-10 lg:grid-cols-[272px_minmax(0,1fr)]">
        <div className="hidden h-[32rem] animate-pulse rounded-[1.5rem] bg-surface lg:block" />
        <div>
          <div className="mb-6 h-14 animate-pulse rounded-2xl bg-surface" />
          <SkeletonGrid n={8} />
        </div>
      </div>
    </div>
  );
}