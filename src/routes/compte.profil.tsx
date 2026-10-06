import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, LogOut, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { AccountShell, useLogout } from "@/components/sections/account/account-shell";
import type { Profile } from "@/lib/account";
import { isValidMoroccanPhone } from "@/lib/commerce";
import { pageHead } from "@/lib/seo";
import { useAuth } from "@/store/auth";
import { t } from "@/i18n/fr";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/compte/profil")({
  head: () => pageHead({ title: t.account.profile.title, description: "Votre profil (démo).", path: "/compte/profil", noindex: true }),
  component: ProfilePage,
});

type Errors = Partial<Record<"name" | "phone" | "email", string>>;

export function validateProfile(p: Pick<Profile, "name" | "phone" | "email">): Errors {
  const e: Errors = {};
  if (p.name.trim().length < 2) e.name = t.checkout.errors.name;
  if (!isValidMoroccanPhone(p.phone)) e.phone = t.checkout.errors.phone;
  if (p.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email.trim())) e.email = t.account.profile.errors.email;
  return e;
}

function ProfilePage() {
  const { user, updateProfile, resetDemo } = useAuth();
  const logout = useLogout();
  const [v, setV] = useState({ name: user?.name ?? "", phone: user?.phone ?? "", email: user?.email ?? "" });
  const [errors, setErrors] = useState<Errors>({});
  const [notice, setNotice] = useState<string | null>(null);
  // Réaligne le formulaire après « Réinitialiser la démo ».
  useEffect(() => {
    if (user) setV({ name: user.name, phone: user.phone, email: user.email });
  }, [user?.name, user?.phone, user?.email]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (k: keyof typeof v, val: string) => { setV((x) => ({ ...x, [k]: val })); setNotice(null); };
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateProfile(v);
    setErrors(errs);
    if (Object.keys(errs).length || !user) return;
    updateProfile({ ...user, name: v.name.trim(), phone: v.phone.trim(), email: v.email.trim() });
    setNotice(t.account.profile.saved);
  };
  const field = (k: keyof Errors) => ({
    id: `pf-${k}`,
    value: v[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(k, e.target.value),
    "aria-invalid": Boolean(errors[k]) || undefined,
    "aria-describedby": errors[k] ? `pf-${k}-error` : undefined,
    className: cn("field", errors[k] && "border-destructive"),
  });
  const err = (k: keyof Errors) => errors[k] && (
    <p id={`pf-${k}-error`} className="mt-1 flex items-center gap-1 text-xs font-semibold text-destructive"><AlertCircle className="h-3.5 w-3.5" aria-hidden />{errors[k]}</p>
  );

  return (
    <AccountShell title={t.account.profile.title} crumb={t.account.profile.title}>
      <form onSubmit={save} noValidate className="rounded-3xl border p-5 md:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="pf-name" className="mb-1.5 block text-sm font-semibold">{t.account.profile.name}</label>
            <input {...field("name")} autoComplete="name" />
            {err("name")}
          </div>
          <div>
            <label htmlFor="pf-phone" className="mb-1.5 block text-sm font-semibold">{t.account.profile.phone}</label>
            <input {...field("phone")} type="tel" inputMode="tel" autoComplete="tel" />
            {err("phone")}
          </div>
          <div>
            <label htmlFor="pf-email" className="mb-1.5 block text-sm font-semibold">{t.account.profile.email}</label>
            <input {...field("email")} type="email" autoComplete="email" />
            {err("email")}
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="submit" className="btn btn-primary">{t.account.profile.save}</button>
          {notice && <p role="status" className="flex items-center gap-1.5 text-sm font-semibold text-success"><CheckCircle2 className="h-4 w-4" aria-hidden />{notice}</p>}
        </div>
      </form>

      <section className="mt-6 grid gap-4 md:grid-cols-2" aria-label={t.account.profile.session}>
        <div className="rounded-3xl border p-5">
          <p className="font-display font-extrabold">{t.account.profile.reset}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t.account.profile.resetText}</p>
          <button type="button" onClick={() => { resetDemo(); setErrors({}); setNotice(t.account.profile.resetDone); }} className="btn btn-outline mt-4">
            <RotateCcw className="h-4 w-4" aria-hidden />{t.account.profile.reset}
          </button>
        </div>
        <div className="rounded-3xl border p-5">
          <p className="font-display font-extrabold">{t.account.profile.session}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t.account.login.demoNote}</p>
          <button type="button" onClick={logout} className="btn btn-ink mt-4">
            <LogOut className="h-4 w-4" aria-hidden />{t.account.links.logout}
          </button>
        </div>
      </section>
    </AccountShell>
  );
}
