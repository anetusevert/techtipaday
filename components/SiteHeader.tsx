import Link from "next/link";
import { CaretT } from "./CaretT";
import { NavLinks } from "./NavLinks";
import { SearchForm } from "./SearchForm";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="mast">
        <Link href="/" className="brand" aria-label="TechTipADay, home">
          <CaretT />
          <span className="wordmark">
            TechTip<span>ADay</span>
          </span>
        </Link>
        <SearchForm />
        <NavLinks />
      </div>
    </header>
  );
}
