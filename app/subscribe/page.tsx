import { Newsletter } from "@/components/Newsletter";
import { pageAlternates } from "@/lib/seo";
import { SITE_DESC } from "@/lib/tips";

export const metadata = {
  title: "Get tomorrow's tip a day early",
  description: `Get tomorrow's TechTipADay tip the evening before it goes on the site. ${SITE_DESC}`,
  alternates: pageAlternates("/subscribe"),
};

export default function SubscribePage() {
  return (
    <main className="article">
      <Newsletter level={1} />
    </main>
  );
}
