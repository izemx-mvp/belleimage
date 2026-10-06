import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { site } from "@/config/site";
import type { Address } from "@/lib/account";
import { getZone } from "@/lib/commerce";
import { t } from "@/i18n/fr";
import { cn } from "@/lib/utils";

type Errors = Partial<Record<"label" | "zone" | "district" | "address", string>>;

export function validateAddress(a: Pick<Address, "label" | "zone" | "district" | "address">): Errors {
  const e: Errors = {};
  if (!a.label.trim()) e.label = t.account.addresses.errors.label;
  if (!getZone(a.zone)) e.zone = t.checkout.errors.city;
  if (a.district.trim().length < 2) e.district = t.checkout.errors.district;
  if (a.address.trim().length < 8) e.address = t.checkout.errors.address;
  return e;
}

const blank = (): Address => ({ id: "", label: "", zone: "", district: "", address: "", isDefault: false });

/** Formulaire d'adresse (ajout / modification) dans une boîte de dialogue accessible (Radix). */
export function AddressDialog({ open, onOpenChange, initial, onSave }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: Address | null;
  onSave: (a: Address) => void;
}) {
  const [v, setV] = useState<Address>(blank());
  const [errors, setErrors] = useState<Errors>({});
  useEffect(() => {
    if (open) { setV(initial ?? blank()); setErrors({}); }
  }, [open, initial]);

  const set = <K extends keyof Address>(k: K, val: Address[K]) => setV((x) => ({ ...x, [k]: val }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateAddress(v);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSave({ ...v, id: v.id || `adr-${Date.now().toString(36)}`, label: v.label.trim(), district: v.district.trim(), address: v.address.trim() });
    onOpenChange(false);
  };
  const field = (k: keyof Errors) => ({
    id: `adr-${k}`,
    "aria-invalid": Boolean(errors[k]) || undefined,
    "aria-describedby": errors[k] ? `adr-${k}-error` : undefined,
    className: cn("field", errors[k] && "border-destructive"),
  });
  const err = (k: keyof Errors) => errors[k] && (
    <p id={`adr-${k}-error`} className="mt-1 flex items-center gap-1 text-xs font-semibold text-destructive"><AlertCircle className="h-3.5 w-3.5" aria-hidden />{errors[k]}</p>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-3xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-extrabold">{initial ? t.account.addresses.editTitle : t.account.addresses.addTitle}</DialogTitle>
          <DialogDescription>{t.checkout.address}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="adr-label" className="mb-1.5 block text-sm font-semibold">{t.account.addresses.label} *</label>
            <input {...field("label")} placeholder={t.account.addresses.labelPlaceholder} value={v.label} onChange={(e) => set("label", e.target.value)} />
            {err("label")}
          </div>
          <div>
            <label htmlFor="adr-zone" className="mb-1.5 block text-sm font-semibold">{t.checkout.city} *</label>
            <select {...field("zone")} value={v.zone} onChange={(e) => set("zone", e.target.value)}>
              <option value="">{t.checkout.cityPlaceholder}</option>
              {site.deliveryZones.map((z) => <option key={z.id} value={z.id}>{z.label}</option>)}
            </select>
            {err("zone")}
          </div>
          <div>
            <label htmlFor="adr-district" className="mb-1.5 block text-sm font-semibold">{t.checkout.district} *</label>
            <input {...field("district")} value={v.district} onChange={(e) => set("district", e.target.value)} />
            {err("district")}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="adr-address" className="mb-1.5 block text-sm font-semibold">{t.checkout.street} *</label>
            <input {...field("address")} autoComplete="street-address" placeholder="N°, rue, immeuble…" value={v.address} onChange={(e) => set("address", e.target.value)} />
            {err("address")}
          </div>
          <label className="flex cursor-pointer items-center gap-3 text-sm sm:col-span-2">
            <input type="checkbox" checked={v.isDefault} onChange={(e) => set("isDefault", e.target.checked)} className="h-4 w-4 accent-[var(--primary)]" />
            {t.account.addresses.makeDefault}
          </label>
          <div className="flex flex-col-reverse gap-2 sm:col-span-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => onOpenChange(false)} className="btn btn-outline">{t.account.addresses.cancel}</button>
            <button type="submit" className="btn btn-primary">{t.account.addresses.save}</button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
