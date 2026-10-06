import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "@/components/layout";
import { AccountShell } from "@/components/sections/account/account-shell";
import { AddressDialog } from "@/components/sections/account/address-dialog";
import type { Address } from "@/lib/account";
import { getZone } from "@/lib/commerce";
import { pageHead } from "@/lib/seo";
import { useAuth } from "@/store/auth";
import { t } from "@/i18n/fr";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/compte/adresses")({
  head: () => pageHead({ title: t.account.addresses.title, description: "Vos adresses de livraison (démo).", path: "/compte/adresses", noindex: true }),
  component: AddressesPage,
});

function AddressesPage() {
  const { addresses, saveAddress, deleteAddress, setDefaultAddress } = useAuth();
  const [dialog, setDialog] = useState<{ open: boolean; initial: Address | null }>({ open: false, initial: null });
  const [confirmId, setConfirmId] = useState<string | null>(null);

  return (
    <AccountShell title={t.account.addresses.title} crumb={t.account.addresses.title}>
      <button type="button" onClick={() => setDialog({ open: true, initial: null })} className="btn btn-primary mb-6">
        <Plus className="h-4 w-4" aria-hidden />{t.account.addresses.add}
      </button>

      {addresses.length === 0 ? (
        <EmptyState title={t.account.addresses.empty} />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {addresses.map((a) => (
            <li key={a.id} className={cn("flex flex-col rounded-3xl border p-5", a.isDefault && "border-primary ring-1 ring-primary")}>
              <div className="flex items-start justify-between gap-3">
                <p className="flex items-center gap-2 font-display text-lg font-extrabold text-ink"><MapPin className="h-4 w-4 text-primary" aria-hidden />{a.label}</p>
                {a.isDefault && <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground">{t.account.addresses.default}</span>}
              </div>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{a.address}<br />{a.district}, {getZone(a.zone)?.label ?? a.zone}</p>

              {confirmId === a.id ? (
                <div className="mt-4 rounded-2xl bg-primary-soft p-3" role="alert">
                  <p className="text-sm font-semibold text-primary-deep">{t.account.addresses.confirmDelete(a.label)}</p>
                  <div className="mt-2 flex gap-2">
                    <button type="button" onClick={() => { deleteAddress(a.id); setConfirmId(null); }} className="btn btn-primary py-2 text-sm">{t.account.addresses.delete}</button>
                    <button type="button" onClick={() => setConfirmId(null)} className="btn btn-outline py-2 text-sm">{t.account.addresses.cancel}</button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" onClick={() => setDialog({ open: true, initial: a })} className="btn btn-outline py-2 text-sm"><Pencil className="h-3.5 w-3.5" aria-hidden />{t.account.addresses.edit}</button>
                  {!a.isDefault && (
                    <button type="button" onClick={() => setDefaultAddress(a.id)} className="btn btn-outline py-2 text-sm"><Star className="h-3.5 w-3.5" aria-hidden />{t.account.addresses.setDefault}</button>
                  )}
                  <button type="button" onClick={() => setConfirmId(a.id)} className="btn py-2 text-sm text-primary-deep hover:bg-primary-soft" aria-label={`${t.account.addresses.delete} ${a.label}`}><Trash2 className="h-3.5 w-3.5" aria-hidden />{t.account.addresses.delete}</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <AddressDialog open={dialog.open} initial={dialog.initial} onOpenChange={(open) => setDialog((d) => ({ ...d, open }))} onSave={saveAddress} />
    </AccountShell>
  );
}
