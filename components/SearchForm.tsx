export function SearchForm({ q = "", labelled = false }: { q?: string; labelled?: boolean }) {
  return (
    <form className="search" action="/tips" method="get" role="search">
      <label className={labelled ? undefined : "sr"} htmlFor={labelled ? "q-page" : "q-header"}>
        Search tips
      </label>
      <input
        id={labelled ? "q-page" : "q-header"}
        name="q"
        type="search"
        defaultValue={q}
        placeholder="Search tips"
        autoComplete="off"
        enterKeyHint="search"
      />
      <button className="btn btn-primary" type="submit">
        Search
      </button>
    </form>
  );
}
