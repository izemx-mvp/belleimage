import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, Eye, EyeOff, Info, LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo, Stars } from "@/components/brand";
import { Crumbs } from "@/components/layout";
import { site } from "@/config/site";
import { safeRedirect } from "@/lib/account";
import { pageHead } from "@/lib/seo";
import { useAuth } from "@/store/auth";
import { t } from "@/i18n/fr";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/compte_/connexion")({
  validateSearch: (raw: Record<string, unknown>): { redirect?: string } =>
    typeof raw["redirect"] === "string" ? { redirect: safeRedirect(raw["redirect"]) } : {},
  head: () => pageHead({ title: t.account.login.title, description: "Connexion à l'espace client démo Belle Image.", path: "/compte/connexion", noindex: true }),
  component: LoginPage,
});

function LoginPage() {
  const { redirect } = Route.useSearch();
  const { hydrated, isLoggedIn, login } = useAuth();
  const navigate = useNavigate();
  // Identifiants de démonstration préremplis (src/config/site.ts → demoAccount).
  const [phone, setPhone] = useState<string>(site.demoAccount.phone);
  const [password, setPassword] = useState<string>(site.demoAccount.password);
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const target = safeRedirect(redirect);

  // Déjà connecté : on file vers la page demandée.
  useEffect(() => {
    if (hydrated && isLoggedIn) navigate({ to: target, replace: true });
  }, [hydrated, isLoggedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login(phone, password)) {
      setError(true);
      return;
    }
    setError(false);
    navigate({ to: target, replace: true });
  };

  return (
    <div className="container-x py-8 md:py-12">
      <Crumbs items={[{ label: t.common.home, href: <Link to="/" className="hover:text-primary">{t.common.home}</Link> }, { label: t.account.login.submit }]} />
      <div className="mx-auto mt-6 max-w-md">
        <div className="relative overflow-hidden rounded-3xl border bg-card p-6 shadow-card md:p-8">
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full border-[16px] border-primary/10" aria-hidden />
          <div className="relative">
            <Logo className="h-12 w-12" />
            <p className="mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary"><Stars size={10} />{t.account.title}</p>
            <h1 className="mt-2 text-2xl font-extrabold text-ink md:text-3xl">{t.account.login.title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{t.account.login.intro}</p>

            <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
              <div>
                <label htmlFor="login-phone" className="mb-1.5 block text-sm font-semibold">{t.account.login.phone}</label>
                <input id="login-phone" type="tel" inputMode="tel" autoComplete="tel" value={phone}
                  onChange={(e) => { setPhone(e.target.value); setError(false); }}
                  aria-invalid={error || undefined} aria-describedby={error ? "login-error" : undefined}
                  className={cn("field", error && "border-destructive")} />
              </div>
              <div>
                <label htmlFor="login-password" className="mb-1.5 block text-sm font-semibold">{t.account.login.password}</label>
                <div className="relative">
                  <input id="login-password" type={show ? "text" : "password"} autoComplete="current-password" value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(false); }}
                    aria-invalid={error || undefined} aria-describedby={error ? "login-error" : undefined}
                    className={cn("field pr-12", error && "border-destructive")} />
                  <button type="button" onClick={() => setShow(!show)} aria-label={show ? t.account.login.hidePassword : t.account.login.showPassword} aria-pressed={show}
                    className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-surface">
                    {show ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
                  </button>
                </div>
              </div>
              {error && (
                <p id="login-error" role="alert" className="flex items-center gap-2 rounded-xl bg-primary-soft px-3 py-2.5 text-sm font-semibold text-primary-deep">
                  <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />{t.account.login.error}
                </p>
              )}
              <button type="submit" className="btn btn-primary w-full"><LogIn className="h-4 w-4" aria-hidden />{t.account.login.submit}</button>
            </form>

            <p className="mt-5 flex items-start gap-2 rounded-xl bg-surface p-3 text-xs text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span><strong className="text-ink">{t.account.login.demoNote}</strong> {t.account.login.demoHint}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
