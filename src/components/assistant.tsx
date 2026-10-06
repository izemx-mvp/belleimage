import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Send, X, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { assistantQA, budgetRanges } from "@/data/assistant";
import { site } from "@/config/site";
import { getCategoriesByPillar, getCategory, getProducts, normalize, searchCategories, searchPosts, searchProducts } from "@/lib/catalogue";
import { formatPrice, track, waLink } from "@/lib/commerce";
import { useShop } from "@/store/shop";
import { Logo, ProductImage } from "./brand";
import { WhatsAppIcon } from "./layout";
import { t } from "@/i18n/fr";

type Msg =
  | { from: "bot" | "user"; text: string }
  | { from: "bot"; kind: "products"; slugs: string[] }
  | { from: "bot"; kind: "links"; cats: string[]; posts: { slug: string; title: string }[] }
  | { from: "bot"; kind: "whatsapp"; question: string };

type Chip = { label: string; action: string };

const KEY = "bi_assistant";
const welcome: Msg[] = [{ from: "bot", text: "Bonjour 👋 Je suis le conseiller Belle Image. Je peux vous aider à trouver un produit, ou répondre à vos questions sur la livraison, le paiement et la garantie." }];
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

export function Assistant() {
  const { assistantOpen, setAssistantOpen, add } = useShop();
  const [msgs, setMsgs] = useState<Msg[]>(welcome);
  const [chips, setChips] = useState<Chip[]>(mainChips);
  const [flow, setFlow] = useState<{ cat?: string; sub?: string }>({});
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const s = JSON.parse(sessionStorage.getItem(KEY) || "null");
      if (s?.msgs) { setMsgs(s.msgs); setChips(s.chips ?? mainChips); setFlow(s.flow ?? {}); }
    } catch { /* ignore */ }
  }, []);
  useEffect(() => { sessionStorage.setItem(KEY, JSON.stringify({ msgs, chips, flow })); endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, chips, flow]);

  const push = (...m: Msg[]) => setMsgs((x) => [...x, ...m]);

  const showProducts = (min: number, max: number, cat?: string, sub?: string) => {
    const list = getProducts().filter((p) => p.price >= min && p.price < max && (!cat || p.category === cat) && (!sub || p.subcategory === sub)).slice(0, 4);
    if (list.length) push({ from: "bot", text: `Voici ${list.length} suggestion(s) :` }, { from: "bot", kind: "products", slugs: list.map((p) => p.slug) });
    else push({ from: "bot", text: "Je n'ai pas trouvé de produit dans cette fourchette. Notre équipe peut vous proposer d'autres modèles disponibles en showroom." }, { from: "bot", kind: "whatsapp", question: "Je cherche un produit dans ma fourchette de budget." });
    setChips([{ label: "Nouvelle recherche", action: "find" }, ...mainChips.slice(4)]);
  };

  const act = (c: Chip) => {
    push({ from: "user", text: c.label });
    const [a, v] = c.action.split(":");
    if (a === "find") {
      setFlow({});
      push({ from: "bot", text: "Avec plaisir ! Quel univers vous intéresse ?" });
      setChips([{ label: "Électroménager", action: "pillar:electromenager" }, { label: "Ameublement", action: "pillar:ameublement" }]);
    } else if (a === "pillar") {
      push({ from: "bot", text: "Quelle catégorie ?" });
      setChips(getCategoriesByPillar(v).map((x) => ({ label: x.name, action: `cat:${x.slug}` })));
    } else if (a === "cat") {
      const cat = getCategory(v)!;
      setFlow({ cat: v });
      push({ from: "bot", text: `Très bien. Un type de ${cat.name.toLowerCase()} en particulier ?` });
      setChips([...cat.subcategories.map((s) => ({ label: s.name, action: `sub:${s.slug}` })), { label: "Peu importe", action: "sub:" }]);
    } else if (a === "sub") {
      setFlow((f) => ({ ...f, sub: v || undefined }));
      push({ from: "bot", text: "Quel est votre budget ?" });
      setChips(budgetRanges.map((b) => ({ label: b.label, action: `price:${b.id}` })));
    } else if (a === "budget") {
      setFlow({});
      push({ from: "bot", text: "Quel est votre budget ?" });
      setChips(budgetRanges.map((b) => ({ label: b.label, action: `price:${b.id}` })));
    } else if (a === "price") {
      const b = budgetRanges.find((x) => x.id === v)!;
      showProducts(b.min, b.max, flow.cat, flow.sub);
    } else if (a === "qa") {
      const qa = assistantQA.find((q) => q.id === v)!;
      push({ from: "bot", text: qa.answer });
      setChips(mainChips);
    } else if (a === "human") {
      push({ from: "bot", text: `Nos conseillers vous répondent sur WhatsApp ou au ${site.phone} (${site.hours.label}).` }, { from: "bot", kind: "whatsapp", question: "Bonjour, j'aimerais parler à un conseiller." });
      setChips(mainChips);
    } else if (a === "reset") {
      setMsgs(welcome); setChips(mainChips); setFlow({});
    }
  };

  const ask = (e: React.FormEvent) => {
    e.preventDefault();
    const q = input.trim();
    if (!q) return;
    setInput("");
    push({ from: "user", text: q });
    const nq = normalize(q);
    const qa = assistantQA.find((x) => x.keywords.some((k) => nq.includes(normalize(k))));
    const prods = searchProducts(q, 4);
    const cats = searchCategories(q).slice(0, 3);
    const ps = searchPosts(q).slice(0, 2);
    if (qa) push({ from: "bot", text: qa.answer });
    if (prods.length) push({ from: "bot", text: "J'ai trouvé ces produits :" }, { from: "bot", kind: "products", slugs: prods.map((p) => p.slug) });
    if (cats.length || ps.length) push({ from: "bot", kind: "links", cats: cats.map((c) => c.slug), posts: ps.map((p) => ({ slug: p.slug, title: p.title })) });
    if (!qa && !prods.length && !cats.length && !ps.length)
      push({ from: "bot", text: "Je n'ai pas la réponse, mais notre équipe peut vous aider directement 🙂" }, { from: "bot", kind: "whatsapp", question: q });
    setChips(mainChips);
  };

  return (
    <AnimatePresence>
      {assistantOpen && (
        <motion.div
          role="dialog" aria-label={t.assistant.title}
          initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 360, damping: 32 }}
          className="fixed inset-x-2 bottom-2 z-[70] flex h-[min(640px,calc(100dvh-1rem))] flex-col overflow-hidden rounded-3xl border bg-background shadow-lift sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[400px]"
          onKeyDown={(e) => e.key === "Escape" && setAssistantOpen(false)}
        >
          <div className="glass flex items-center gap-3 border-b px-4 py-3">
            <Logo className="h-10 w-10" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-display font-bold">{t.assistant.title}</p>
              <p className="flex items-center gap-1.5 text-xs text-success"><span className="h-1.5 w-1.5 rounded-full bg-success" />Réponses instantanées</p>
            </div>
            <button onClick={() => act({ label: "Recommencer", action: "reset" })} className="grid h-9 w-9 place-items-center rounded-full hover:bg-surface" aria-label="Recommencer"><RotateCcw className="h-4 w-4" /></button>
            <button onClick={() => setAssistantOpen(false)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-surface" aria-label="Fermer"><X className="h-5 w-5" /></button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto bg-surface p-4" aria-live="polite">
            {msgs.map((m, i) => {
              if ("kind" in m && m.kind === "products") {
                return (
                  <div key={i} className="grid gap-2">
                    {m.slugs.map((s) => {
                      const p = getProducts().find((x) => x.slug === s);
                      if (!p) return null;
                      return (
                        <div key={s} className="grid grid-cols-[56px_minmax(0,1fr)] gap-3 rounded-2xl bg-background p-2 shadow-card">
                          <ProductImage icon={getCategory(p.category)?.icon ?? "fridge"} label=" " className="rounded-xl" />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">{p.name}</p>
                            <p className="tabular text-sm font-bold text-primary">{formatPrice(p.price)}</p>
                            <div className="mt-1 flex gap-2">
                              <button onClick={() => add(p.slug)} className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">Ajouter</button>
                              <Link to="/produit/$slug" params={{ slug: p.slug }} onClick={() => setAssistantOpen(false)} className="rounded-full border px-3 py-1 text-xs font-semibold">Voir</Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              }
              if ("kind" in m && m.kind === "links") {
                return (
                  <div key={i} className="flex flex-wrap gap-2">
                    {m.cats.map((c) => <Link key={c} to="/boutique/$category" params={{ category: c }} onClick={() => setAssistantOpen(false)} className="rounded-full bg-background px-3 py-1.5 text-xs font-semibold shadow-card hover:text-primary">Rayon {getCategory(c)?.name} →</Link>)}
                    {m.posts.map((p) => <Link key={p.slug} to="/conseils/$slug" params={{ slug: p.slug }} onClick={() => setAssistantOpen(false)} className="rounded-full bg-background px-3 py-1.5 text-xs font-semibold shadow-card hover:text-primary">📖 {p.title}</Link>)}
                  </div>
                );
              }
              if ("kind" in m && m.kind === "whatsapp") {
                return (
                  <a key={i} href={waLink(m.question)} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp_click", { location: "assistant" })} className="btn btn-whatsapp w-full py-2.5 text-sm">
                    <WhatsAppIcon className="h-4 w-4" />Poser la question sur WhatsApp
                  </a>
                );
              }
              const mm = m as { from: "bot" | "user"; text: string };
              return (
                <div key={i} className={`flex ${mm.from === "user" ? "justify-end" : "justify-start"}`}>
                  <p className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${mm.from === "user" ? "rounded-br-md bg-ink text-ink-foreground" : "rounded-bl-md bg-background shadow-card"}`}>{mm.text}</p>
                </div>
              );
            })}
            <div ref={endRef} />
          </div>
          <div className="border-t bg-background">
            <div className="no-scrollbar flex gap-2 overflow-x-auto px-3 pt-3">
              {chips.map((c) => (
                <button key={c.action + c.label} onClick={() => act(c)} className="shrink-0 rounded-full border-[1.5px] border-primary/30 px-3 py-1.5 text-xs font-semibold text-primary-deep hover:bg-primary hover:text-primary-foreground">{c.label}</button>
              ))}
            </div>
            <form onSubmit={ask} className="flex gap-2 p-3">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t.assistant.placeholder} aria-label={t.assistant.placeholder} className="field rounded-full py-2.5" />
              <button type="submit" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground" aria-label="Envoyer"><Send className="h-4 w-4" /></button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
