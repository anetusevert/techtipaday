import type { FaqItem } from "@/lib/taxonomy";

/** Visible FAQ. The matching FAQPage JSON-LD is emitted by the page, from the same items. */
export function Faq({ items, title = "Questions people ask" }: { items: FaqItem[]; title?: string }) {
  if (!items.length) return null;
  return (
    <section className="block faq" aria-labelledby="faq-title">
      <h2 id="faq-title">{title}</h2>
      {items.map((item) => (
        <details key={item.q} open>
          <summary>
            <h3>{item.q}</h3>
          </summary>
          <p>{item.a}</p>
        </details>
      ))}
    </section>
  );
}
