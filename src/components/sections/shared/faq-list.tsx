import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { FaqItem } from "@/data/faq";

/** Accordéon FAQ (Radix : navigation clavier et ARIA intégrées). */
export function FaqList({ items, idPrefix = "faq" }: { items: FaqItem[]; idPrefix?: string }) {
  return (
    <Accordion type="single" collapsible className="divide-y rounded-3xl border bg-card px-5 md:px-7">
      {items.map((f, i) => (
        <AccordionItem key={f.q} value={`${idPrefix}-${i}`} className="border-b-0">
          <AccordionTrigger className="py-5 text-left font-display text-base font-bold text-ink hover:no-underline md:text-lg">{f.q}</AccordionTrigger>
          <AccordionContent className="pb-5 text-[0.95rem] leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function faqLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}
