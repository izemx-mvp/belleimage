import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Check, Heart, LayoutDashboard, LogOut, MapPin, Package, User } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { Logo } from "@/components/brand";
import { Crumbs } from "@/components/layout";
import { formatDate } from "@/components/sections/shared/post-card";
import { guardTarget, orderSteps, type OrderStatus } from "@/lib/account";
import { useAuth } from "@/store/auth";
import { t } from "@/i18n/fr";
import { cn } from "@/lib/utils";

const links = [
  { to: "/compte", label: t.account.links.overview, icon: LayoutDashboard, exact: true },
  { to: "/compte/commandes", label: t.account.links.orders, icon: Package, exact: false },
  { to: "/compte/adresses", label: t.account.links.addresses, icon: MapPin, exact: false },
  { to: "/favoris", label: t.account.links.favorites, icon: Heart, exact: false },
  { to: "/compte/profil", label: t.account.links.profile, icon: User, exact: false },
] as const;

export const formatOrderDate = (iso: string) => formatDate(iso.slice(0, 10));

/** Déconnexion : quitte d'abord l'espace client (sinon la protection redirigerait vers la connexion). */
export function useLogout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return () => {
    void navigate({ to: "/" }).then(logout);
  };
}

/** Squelette affiché tant que la session n'est pas lue (SSR + premier rendu client). */
export function AccountSkeleton() {
  return (
    <div className="container-x grid gap-8 py-10 lg:grid-cols-[240px_minmax(0,1fr)]" role="status" aria-label="Chargement de l'espace client">
      <div className="hidden h-72 animate-pulse rounded-3xl bg-surface lg:block" />
      <div className="space-y-4">
        <div className="h-10 w-2/3 animate-pulse rounded-xl bg-surface" />
        <div className="h-40 animate-pulse rounded-3xl bg-surface" />
        <div className="h-40 animate-pulse rounded-3xl bg-surface" />
      </div>
    </div>
  );
}

/**
 * Protège les pages /compte/* côté client : squelette pendant l'hydratation, puis redirection
 * vers /compte/connexion?redirect=… si personne n'est connecté.
 */
export function RequireAuth({ href, redirect, children }: {
  /** URL demandée ; par défaut lue dans window.location au moment de la redirection (client uniquement). */
  href?: string;
  redirect: (to: NonNullable<ReturnType<typeof guardTarget>>) => void;
  children: ReactNode;
}) {
  const { hydrated, isLoggedIn } = useAuth();
  useEffect(() => {
    const current = href ?? `${window.location.pathname}${window.location.search}`;
    const target = guardTarget({ hydrated, isLoggedIn }, current);
    if (target) redirect(target);
  }, [hydrated, isLoggedIn]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!hydrated || !isLoggedIn) return <AccountSkeleton />;
  return <>{children}</>;
}

/** Mise en page de l'espace client : barre latérale (desktop) et onglets défilants (mobile). */
export function AccountShell({ title, children, crumb }: { title: string; children: ReactNode; crumb?: string }) {
  const { user } = useAuth();
  const logout = useLogout();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const active = (to: string, exact: boolean) => (exact ? path === to || path === `${to}/` : path.startsWith(to));

  return (
    <div className="container-x py-8 md:py-10">
      <Crumbs items={[
        { label: t.common.home, href: <Link to="/" className="hover:text-primary">{t.common.home}</Link> },
        ...(crumb ? [{ label: t.account.title, href: <Link to="/compte" className="hover:text-primary">{t.account.title}</Link> }] : []),
        { label: crumb ?? t.account.title },
      ]} />
      <div className="mt-6 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-36 rounded-3xl border p-4">
            <div className="flex items-center gap-3 border-b px-2 pb-4">
              <Logo className="h-10 w-10" />
              <div className="min-w-0">
                <p className="truncate font-display font-bold text-ink">{user?.name}</p>
                <p className="tabular truncate text-xs text-muted-foreground">{user?.phone}</p>
              </div>
            </div>
            <nav aria-label={t.account.nav} className="mt-3 grid gap-1">
              {links.map((l) => (
                <Link key={l.to} to={l.to} aria-current={active(l.to, l.exact) ? "page" : undefined}
                  className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition", active(l.to, l.exact) ? "bg-ink text-ink-foreground" : "text-ink hover:bg-surface")}>
                  <l.icon className="h-4 w-4" aria-hidden />{l.label}
                </Link>
              ))}
              <button type="button" onClick={logout} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-primary-deep hover:bg-primary-soft">
                <LogOut className="h-4 w-4" aria-hidden />{t.account.links.logout}
              </button>
            </nav>
          </div>
        </aside>

        <div className="min-w-0">
          <nav aria-label={t.account.nav} className="no-scrollbar -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 lg:hidden">
            {links.map((l) => (
              <Link key={l.to} to={l.to} aria-current={active(l.to, l.exact) ? "page" : undefined}
                className={cn("inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold", active(l.to, l.exact) ? "bg-ink text-ink-foreground" : "bg-surface text-ink")}>
                <l.icon className="h-4 w-4" aria-hidden />{l.label}
              </Link>
            ))}
          </nav>
          <h1 className="text-3xl font-extrabold text-ink md:text-4xl">{title}</h1>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

const statusStyle: Record<OrderStatus, string> = {
  Envoyée: "bg-surface-2 text-ink",
  Confirmée: "bg-ink text-ink-foreground",
  "En livraison": "bg-primary-soft text-primary-deep",
  Livrée: "bg-success-soft text-success",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", statusStyle[status])}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />{status}
    </span>
  );
}

/** Frise de suivi : Envoyée → Confirmée → En livraison → Livrée. */
export function OrderTimeline({ status }: { status: OrderStatus }) {
  const current = orderSteps.indexOf(status);
  return (
    <ol className="grid grid-cols-4 gap-1" aria-label={t.account.orders.timeline}>
      {orderSteps.map((s, i) => {
        const done = i <= current;
        return (
          <li key={s} className="relative flex flex-col items-center text-center" aria-current={i === current ? "step" : undefined}>
            {i > 0 && <span className={cn("absolute right-1/2 top-4 h-0.5 w-full -translate-y-1/2", i <= current ? "bg-primary" : "bg-surface-2")} aria-hidden />}
            <span className={cn("relative grid h-8 w-8 place-items-center rounded-full border-2 text-xs font-bold", done ? "border-primary bg-primary text-primary-foreground" : "border-surface-2 bg-background text-muted-foreground")}>
              {done ? <Check className="h-4 w-4" aria-hidden /> : i + 1}
            </span>
            <span className={cn("mt-2 text-[11px] font-semibold leading-tight sm:text-xs", done ? "text-ink" : "text-muted-foreground")}>{s}</span>
          </li>
        );
      })}
    </ol>
  );
}
