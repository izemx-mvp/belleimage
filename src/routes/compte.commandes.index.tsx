import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { EmptyState } from "@/components/layout";
import { AccountShell, StatusBadge, formatOrderDate } from "@/components/sections/account/account-shell";
import { formatPrice } from "@/lib/commerce";
import { pageHead } from "@/lib/seo";
import { useAuth } from "@/store/auth";
import { t } from "@/i18n/fr";

export const Route = createFileRoute("/compte/commandes/")({
  head: () => pageHead({ title: t.account.orders.title, description: "Vos commandes Belle Image (démo).", path: "/compte/commandes", noindex: true }),
  component: OrdersPage,
});

function OrdersPage() {
  const { orders } = useAuth();
  return (
    <AccountShell title={t.account.orders.title} crumb={t.account.orders.title}>
      {orders.length === 0 ? (
        <EmptyState title={t.account.orders.empty} action={<Link to="/boutique" className="btn btn-primary mt-2">{t.cart.discover}</Link>} />
      ) : (
        <>
          {/* Desktop : tableau */}
          <div className="hidden overflow-hidden rounded-3xl border md:block">
            <table className="w-full text-sm">
              <caption className="sr-only">{t.account.orders.title}</caption>
              <thead className="bg-surface text-left">
                <tr>
                  <th scope="col" className="px-5 py-3">{t.account.orders.ref}</th>
                  <th scope="col" className="px-5 py-3">{t.account.orders.date}</th>
                  <th scope="col" className="px-5 py-3">Articles</th>
                  <th scope="col" className="px-5 py-3 text-right">{t.account.orders.total}</th>
                  <th scope="col" className="px-5 py-3">{t.account.orders.status}</th>
                  <th scope="col" className="px-5 py-3"><span className="sr-only">{t.account.orders.see}</span></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((o) => (
                  <tr key={o.ref} className="hover:bg-surface/60">
                    <th scope="row" className="tabular px-5 py-4 text-left font-semibold">{o.ref}</th>
                    <td className="px-5 py-4 text-muted-foreground">{formatOrderDate(o.createdAt)}</td>
                    <td className="px-5 py-4 text-muted-foreground">{t.account.orders.items(o.items.reduce((s, i) => s + i.qty, 0))}</td>
                    <td className="tabular px-5 py-4 text-right font-semibold">{formatPrice(o.total)}</td>
                    <td className="px-5 py-4"><StatusBadge status={o.status} /></td>
                    <td className="px-5 py-4 text-right">
                      <Link to="/compte/commandes/$ref" params={{ ref: o.ref }} className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
                        {t.account.orders.see}<ChevronRight className="h-4 w-4" aria-hidden />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile : cartes */}
          <ul className="grid gap-3 md:hidden">
            {orders.map((o) => (
              <li key={o.ref}>
                <Link to="/compte/commandes/$ref" params={{ ref: o.ref }} className="block rounded-3xl border p-4 hover:bg-surface">
                  <div className="flex items-center justify-between gap-2">
                    <span className="tabular font-semibold">{o.ref}</span>
                    <StatusBadge status={o.status} />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                    <span>{formatOrderDate(o.createdAt)} · {t.account.orders.items(o.items.reduce((s, i) => s + i.qty, 0))}</span>
                    <span className="tabular font-semibold text-ink">{formatPrice(o.total)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </AccountShell>
  );
}
