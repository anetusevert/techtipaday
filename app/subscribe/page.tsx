import { Newsletter } from "@/components/Newsletter";
import { pageAlternates } from "@/lib/seo";
import { SITE_DESC } from "@/lib/tips";

export const metadata = {
  title: "Get tomorrow's tip a day early",
  description: `The TechTipADay newsletter. ${SITE_DESC} The list is not open yet.`,
  alternates: pageAlternates("/subscribe"),
};

export default function SubscribePage() {
  return (
    <main className="article">
      <Newsletter level={1} />
    </main>
  );
}
