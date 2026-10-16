import { Newsletter } from "@/components/Newsletter";
import { Rise } from "@/components/Reveal";
import { pageAlternates } from "@/lib/seo";
import { SITE_DESC } from "@/lib/tips";

export const metadata = {
  title: "Subscribe",
  description: `Get each TechTipADay tip by email. ${SITE_DESC}`,
  alternates: pageAlternates("/subscribe"),
};

export default function SubscribePage() {
  return (
    <main className="article">
      <Rise>
        <Newsletter level={1} />
      </Rise>
    </main>
  );
}
