import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { RequireAuth } from "@/components/sections/account/account-shell";
import { pageHead } from "@/lib/seo";
import { t } from "@/i18n/fr";

// Layout de toutes les pages /compte/* (sauf /compte/connexion) : protection côté client.
export const Route = createFileRoute("/compte")({
  head: () => pageHead({ title: t.account.title, description: "Espace client démo Belle Image.", path: "/compte", noindex: true }),
  component: AccountLayout,
});

function AccountLayout() {
  const navigate = useNavigate();
  return (
    <RequireAuth redirect={(target) => navigate({ to: target.to, search: target.search, replace: true })}>
      <Outlet />
    </RequireAuth>
  );
}
