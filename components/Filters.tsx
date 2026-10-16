import Link from "next/link";
import { CATEGORIES, PLATFORMS } from "@/lib/taxonomy";
import { tipsHref, type TipQuery } from "@/lib/tips";

const difficulties = ["Easy", "Moderate"] as const;

export function Filters({ query, counts }: { query: TipQuery; counts?: { label: string; n: number } }) {
  const base = { q: query.q, platform: query.platform, difficulty: query.difficulty, sort: query.sort, category: query.category };
  return (
    <div className="filter-stack">
      <div className="filter-row">
        <p id="sort-label">Order</p>
        <ul className="chips" aria-labelledby="sort-label">
          <li>
            <Link href={tipsHref({ ...base, sort: undefined })} aria-current={query.sort === "popular" ? undefined : "page"}>
              New
            </Link>
          </li>
          <li>
            <Link href={tipsHref({ ...base, sort: "popular" })} aria-current={query.sort === "popular" ? "page" : undefined}>
              Popular
            </Link>
          </li>
        </ul>
      </div>
      <div className="filter-row">
        <p id="platform-label">Platform</p>
        <ul className="chips" aria-labelledby="platform-label">
          <li>
            <Link href={tipsHref({ ...base, platform: undefined })} aria-current={query.platform ? undefined : "page"}>
              Any
            </Link>
          </li>
          {PLATFORMS.map((platform) => (
            <li key={platform.id}>
              <Link
                href={tipsHref({ ...base, platform: platform.id })}
                aria-current={query.platform === platform.id ? "page" : undefined}
              >
                {platform.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="filter-row">
        <p id="diff-label">Difficulty</p>
        <ul className="chips" aria-labelledby="diff-label">
          <li>
            <Link href={tipsHref({ ...base, difficulty: undefined })} aria-current={query.difficulty ? undefined : "page"}>
              Any
            </Link>
          </li>
          {difficulties.map((difficulty) => (
            <li key={difficulty}>
              <Link
                href={tipsHref({ ...base, difficulty })}
                aria-current={query.difficulty === difficulty ? "page" : undefined}
              >
                {difficulty}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="filter-row">
        <p id="topic-label">Topic</p>
        <ul className="chips" aria-labelledby="topic-label">
          <li>
            <Link href={tipsHref({ ...base, category: undefined })} aria-current={query.category ? undefined : "page"}>
              Any
            </Link>
          </li>
          {CATEGORIES.map((category) => (
            <li key={category.id}>
              <Link
                href={tipsHref({ ...base, category: category.id })}
                aria-current={query.category === category.id ? "page" : undefined}
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {counts ? (
        <p className="result-count">
          {counts.n} {counts.n === 1 ? "tip" : "tips"}
          {query.sort === "popular" ? " on the editor's shortlist" : ""}. Popular is a shortlist, not a view count.
        </p>
      ) : null}
    </div>
  );
}
