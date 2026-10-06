import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Send, X, RotateCcw, ShoppingBag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { assistantQA, budgetRanges } from "@/data/assistant";
import { site } from "@/config/site";
import {
  getCategoriesByPillar, getCategory, getPillars, getProductBySlug, getProducts, normalize, score,
  searchCategories, searchPosts, searchProducts,
} from "@/lib/catalogue";
import { formatPrice, track, waLink } from "@/lib/commerce";
import { useShop } from "@/store/shop";
import { Logo } from "./brand";
import { ProductThumb } from "./product";
import { WhatsAppIcon } from "./layout";
import { t } from "@/i18n/fr";

type Msg =
  | { from: "bot" | "user"; kind: "text"; text: string }
  | { from: "bot"; kind: "products"; slugs: string[] }
  | { from: "bot"; kind: "links"; cats: string[]; posts: { slug: string; title: string }[] }
  | { from: "bot"; kind: "whatsapp"; question: string };

type Chip = { label: string; action: string };
type Flow = { cat?: string | undefined; sub?: string | undefined };

const KEY = "bi_assistant";
const bot = (text: string): Msg => ({ from: "bot", kind: "text", text });
const user = (text: string): Msg => ({ from: "user", kind: "text", text });
const welcome: Msg[] = [bot("Bonjour 👋 Je suis le conseiller Belle Image. Je peux vous aider à trouver un produit, ou répondre à vos questions sur la livraison, le paiement et la garantie.")];
const mainChips: Chip[] = [
  { label: "Je cherche un produit", action: "find" },
  { label: "Électroménager", action: "pillar:electromenager" },
  { label: "Ameublement", action: "pillar:ameublement" },
  { label: "Mon budget", action: "budget" },
  { label: "Livraison & paiement", action: "qa:livraison" },
  { label: "Garantie", action: "qa:garantie" },
  { label: "Horaires du showroom", action: "qa:horaires" },
  { label: "Parler à un conseiller", action: "human" },
];
const budgetChips = budgetRanges.map((b) => ({ label: b.label, action: `price:${b.id}` }));

/** Réponse locale à une question libre (exportée pour les tests). */
export function answer(q: string): Msg[] {
  const nq = normalize(q);
  const out: Msg[] = [];
  const qa = assistantQA
    .map((x) => ({ x, n: x.keywords.filter((k) => nq.includes(normalize(k))).length }))
    .filter((r) => r.n > 0)
    .sort((a, b) => b.n - a.n)[0]?.x;
  const pillar = getPillars().find((p) => score(p.name, q) >= 3);
  const prods = searchProducts(q, 4);
  const cats = searchCategories(q).slice(0, 3);
  const posts = searchPosts(q).slice(0, 2);
  if (qa) out.push(bot(qa.answer));
  if (prods.length) out.push(bot("J'ai trouvé ces produits :"), { from: "bot", kind: "products", slugs: prods.map((p) => p.slug) });
  const catSlugs = cats.length ? cats.map((c) => c.slug) : pillar ? getCategoriesByPillar(pillar.slug).map((c) => c.slug) : [];
  if (catSlugs.length || posts.length) out.push({ from: "bot", kind: "links", cats: catSlugs, posts: posts.map((p) => ({ slug: p.slug, title: p.title })) });
  if (!out.length) out.push(bot("Je n'ai pas trouvé de réponse, mais notre équipe peut vous aider directement 🙂"), { from: "bot", kind: "whatsapp", question: q });
  return out;
}

export function Assistant() {
  const { assistantOpen, setAssistantOpen, add } = useShop();
  const [msgs, setMsgs] = useState<Msg[]>(welcome);
  const [chips, setChips] = useState<Chip[]>(mainChips);
  const [flow, setFlow] = useState<Flow>({});
  const [input, setInput] = useState("");
  const [loaded, setLoaded] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Conversation conservée en sessionStorage (client uniquement).
  useEffect(() => {
    try {
      const s = JSON.parse(sessionStorage.getItem(KEY) || "null") as { msgs?: Msg[]; chips?: Chip[]; flow?: Flow } | null;
      if (s?.msgs?.length && s.msgs.every((m) => "kind" in m)) {
        setMsgs(s.msgs);
        setChips(s.chips ?? mainChips);
        setFlow(s.flow ?? {});
      }
    } catch { /* conversation illisible : on repart de zéro */ }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try { sessionStorage.setItem(KEY, JSON.stringify({ msgs, chips, flow })); } catch { /* ignore */ }
  }, [msgs, chips, flow, loaded]);
  useEffect(() => {
    // Défile uniquement la liste des messages (jamais la page).
    const el = listRef.current;
    if (assistantOpen && el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [msgs, assistantOpen]);
  useEffect(() => {
    if (assistantOpen) setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 120);
  }, [assistantOpen]);

  const push = (...m: Msg[]) => setMsgs((x) => [...x, ...m].slice(-60));

  const showProducts = (min: number, max: number, cat?: string, sub?: string) => {
    const list = getProducts()
      .filter((p) => p.price >= min && p.price < max && (!cat || p.category === cat) && (!sub || p.subcategory === sub))
      .sort((a, b) => Number(b.bestSeller) - Number(a.bestSeller))
      .slice(0, 4);
    if (list.length) push(bot(`Voici ${list.length} suggestion${list.length > 1 ? "s" : ""} :`), { from: "bot", kind: "products", slugs: list.map((p) => p.slug) });
    else push(bot("Je n'ai pas trouvé de produit dans cette fourchette. Notre équipe peut vous proposer d'autres modèles disponibles en showroom."), { from: "bot", kind: "whatsapp", question: "Je cherche un produit dans ma fourchette de budget." });
    setChips([{ label: "Nouvelle recherche", action: "find" }, ...mainChips.slice(3)]);
  };

  const act = (c: Chip) => {
    const [a, v = ""] = c.action.split(":");
    if (a !== "reset") push(user(c.label));
    if (a === "find") {
      setFlow({});
      push(bot("Avec plaisir ! Quel univers vous intéresse ?"));
      setChips([{ label: "Électroménager", action: "pillar:electromenager" }, { label: "Ameublement", action: "pillar:ameublement" }]);
    } else if (a === "pillar") {
      push(bot("Quelle catégorie ?"));
      setChips(getCategoriesByPillar(v).map((x) => ({ label: x.name, action: `cat:${x.slug}` })));
    } else if (a === "cat") {
      const cat = getCategory(v);
      if (!cat) return;
      setFlow({ cat: v });
      push(bot(`Très bien. Un type de ${cat.name.toLowerCase()} en particulier ?`));
      setChips([...cat.subcategories.map((s) => ({ label: s.name, action: `sub:${s.slug}` })), { label: "Peu importe", action: "sub:" }]);
    } else if (a === "sub") {
      setFlow((f) => ({ ...f, sub: v || undefined }));
      push(bot("Quel est votre budget ?"));
      setChips(budgetChips);
    } else if (a === "budget") {
      setFlow({});
      push(bot("Quel est votre budget ?"));
      setChips(budgetChips);
    } else if (a === "price") {
      const b = budgetRanges.find((x) => x.id === v);
      if (b) showProducts(b.min, b.max, flow.cat, flow.sub);
    } else if (a === "qa") {
      const qa = assistantQA.find((q) => q.id === v);
      if (qa) push(bot(qa.answer));
      setChips(mainChips);
    } else if (a === "human") {
      push(bot(`Nos conseillers vous répondent sur WhatsApp ou au ${site.phone} (${site.hours.label}).`), { from: "bot", kind: "whatsapp", question: "Bonjour, j'aimerais parler à un conseiller." });
      setChips(mainChips);
    } else if (a === "reset") {
      setMsgs(welcome); setChips(mainChips); setFlow({});
    }
  };

  const ask = (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.trim().slice(0, 300);
    if (!q) return;
    setInput("");
    push(user(q), ...answer(q));
    setChips(mainChips);
  };

  const close = () => setAssistantOpen(false);

  return (
    <AnimatePresence>
      {assistantOpen && (
        <motion.div
          role="dialog" aria-modal="false" aria-label={t.assistant.title}
          initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 360, damping: 32 }}
          className="fixed inset-x-2 bottom-2 z-[70] flex h-[min(640px,calc(100dvh-1rem))] flex-col overflow-hidden rounded-3xl border bg-background shadow-lift sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-[400px]"
          onKeyDown={(e) => e.key === "Escape" && close()}
        >
          <div className="glass flex items-center gap-3 border-b px-4 py-3">
            <Logo className="h-10 w-10" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-display font-bold">{t.assistant.title}</p>
              <p className="flex items-center gap-1.5 text-xs text-success"><span className="h-1.5 w-1.5 rounded-full bg-success" />{t.assistant.status}</p>
            </div>
            <button type="button" onClick={() => act({ label: t.assistant.restart, action: "reset" })} className="grid h-9 w-9 place-items-center rounded-full hover:bg-surface" aria-label={t.assistant.restart}><RotateCcw className="h-4 w-4" aria-hidden /></button>
            <button type="button" onClick={close} className="grid h-9 w-9 place-items-center rounded-full hover:bg-surface" aria-label={t.common.close}><X className="h-5 w-5" aria-hidden /></button>
          </div>
          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto overscroll-contain bg-surface p-4" aria-live="polite">
            {msgs.map((m, i) => {
              if (m.kind === "products") {
                return (
                  <div key={i} className="grid gap-2">
                    {m.slugs.map((s) => {
                      const p = getProductBySlug(s);
                      if (!p) return null;
                      return (
                        <div key={s} className="grid grid-cols-[64px_minmax(0,1fr)] gap-3 rounded-2xl bg-background p-2 shadow-card">
                          <ProductThumb p={p} className="rounded-xl" />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">{p.name}</p>
                            <p className="tabular text-sm font-bold text-primary">{formatPrice(p.price)}{p.oldPrice && <span className="ml-2 text-xs font-normal text-muted-foreground line-through">{formatPrice(p.oldPrice)}</span>}</p>
                            <div className="mt-1 flex gap-2">
                              <button type="button" onClick={() => add(p.slug, { openDrawer: false })} className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground"><ShoppingBag className="h-3 w-3" aria-hidden />{t.cart.addShort}</button>
                              <Link to="/produit/$slug" params={{ slug: p.slug }} onClick={close} className="rounded-full border px-3 py-1 text-xs font-semibold hover:border-ink">{t.assistant.view}</Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              }
              if (m.kind === "links") {
                return (
                  <div key={i} className="flex flex-wrap gap-2">
                    {m.cats.map((c) => <Link key={c} to="/boutique/$category" params={{ category: c }} onClick={close} className="rounded-full bg-background px-3 py-1.5 text-xs font-semibold shadow-card hover:text-primary">Rayon {getCategory(c)?.name} →</Link>)}
                    {m.posts.map((p) => <Link key={p.slug} to="/conseils/$slug" params={{ slug: p.slug }} onClick={close} className="rounded-full bg-background px-3 py-1.5 text-xs font-semibold shadow-card hover:text-primary">📖 {p.title}</Link>)}
                  </div>
                );
              }
              if (m.kind === "whatsapp") {
                return (
                  <a key={i} href={waLink(m.question)} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { location: "assistant" })} className="btn btn-whatsapp w-full py-2.5 text-sm">
                    <WhatsAppIcon className="h-4 w-4" />{t.assistant.askWhatsapp}
                  </a>
                );
              }
              return (
                <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  <p className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${m.from === "user" ? "rounded-br-md bg-ink text-ink-foreground" : "rounded-bl-md bg-background shadow-card"}`}>{m.text}</p>
                </div>
              );
            })}
          </div>
          <div className="border-t bg-background">
            <div className="no-scrollbar flex gap-2 overflow-x-auto px-3 pt-3">
              {chips.map((c) => (
                <button type="button" key={c.action + c.label} onClick={() => act(c)} className="shrink-0 rounded-full border-[1.5px] border-primary/30 px-3 py-1.5 text-xs font-semibold text-primary-deep hover:bg-primary hover:text-primary-foreground">{c.label}</button>
              ))}
            </div>
            <form onSubmit={ask} className="flex gap-2 p-3">
              <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder={t.assistant.placeholder} aria-label={t.assistant.placeholder} maxLength={300} className="field rounded-full py-2.5" />
              <button type="submit" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground" aria-label={t.assistant.send}><Send className="h-4 w-4" aria-hidden /></button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
