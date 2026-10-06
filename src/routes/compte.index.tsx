import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Heart, MapPin, Package, User } from "lucide-react";
import { WhatsAppIcon } from "@/components/layout";
import { ProductThumb } from "@/components/product";
import { AccountShell, StatusBadge, formatOrderDate } from "@/components/sections/account/account-shell";
import { firstName } from "@/lib/account";
import { getProductBySlug } from "@/lib/catalogue";
import { formatPrice, track, waLink } from "@/lib/commerce";
import { pageHead } from "@/lib/seo";
import { useAuth } from "@/store/auth";
import { useShop } from "@/store/shop";
import { t } from "@/i18n/fr";

export const Route = createFileRoute("/compte/")({
  head: () => pageHead({ title: t.account.title, description: "Espace client démo Belle Image.", path: "/compte", noindex: true }),
  component: AccountHome,
});

function AccountHome() {
  const { user, orders, addresses } = useAuth();
  const { favs } = useShop();
  const last = orders[0];
  const quick = [
    { to: "/compte/commandes", label: t.account.links.orders, icon: Package, count: orders.length },
    { to: "/compte/adresses", label: t.account.links.addresses, icon: MapPin, count: addresses.length },
    { to: "/favoris", label: t.account.links.favorites, icon: Heart, count: favs.length },
    { to: "/compte/profil", label: t.account.links.profile, icon: User, count: undefined },
  ] as const;
  const firstProduct = last?.items[0]?.slug ? getProductBySlug(last.items[0].slug) : undefined;

  return (
    <AccountShell title={t.account.home.hello(firstName(user?.name ?? ""))}>
      <p className="-mt-3 text-muted-foreground">{t.account.home.intro}</p>

      <section className="mt-6 rounded-3xl border p-5 md:p-6" aria-labelledby="last-order">
        <h2 id="last-order" className="font-display text-lg font-extrabold">{t.account.home.lastOrder}</h2>
        {last ? (
          <Link to="/compte/commandes/$ref" params={{ ref: last.ref }} className="group mt-4 grid grid-cols-[64px_minmax(0,1fr)] items-center gap-4 rounded-2xl bg-surface p-3 transition hover:bg-surface-2 sm:grid-cols-[64px_minmax(0,1fr)_auto]">
            <div className="overflow-hidden rounded-xl border bg-background">
              {firstProduct ? <ProductThumb p={firstProduct} /> : <Package className="m-auto h-8 w-8 text-muted-foreground" aria-hidden />}
            </div>
            <div className="min-w-0">
              <p className="tabular font-semibold text-ink">{last.ref}</p>
              <p className="text-sm text-muted-foreground">{formatOrderDate(last.createdAt)} · {t.account.orders.items(last.items.reduce((s, i) => s + i.qty, 0))} · <span className="tabular">{formatPrice(last.total)}</span></p>
              <div className="mt-2 sm:hidden"><StatusBadge status={last.status} /></div>
            </div>
            <div className="hidden items-center gap-3 sm:flex">
              <StatusBadge status={last.status} />
              <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1" aria-hidden />
            </div>
          </Link>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">{t.account.home.noOrder}</p>
        )}
      </section>

      <section className="mt-6" aria-labelledby="quick-links">
        <h2 id="quick-links" className="sr-only">{t.account.home.quick}</h2>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {quick.map((q) => (
            <li key={q.to}>
              <Link to={q.to} className="flex h-full flex-col rounded-3xl border p-5 transition hover:-translate-y-0.5 hover:shadow-lift">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary"><q.icon className="h-5 w-5" aria-hidden /></span>
                <span className="mt-4 font-semibold text-ink">{q.label}</span>
                {q.count !== undefined && <span className="tabular text-sm text-muted-foreground">{q.count}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <a href={waLink(t.account.home.helpMessage)} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { location: "account" })} className="btn btn-whatsapp mt-6">
        <WhatsAppIcon className="h-4 w-4" />{t.account.home.help}
      </a>
    </AccountShell>
  );
}
