import Link from "next/link"

function buildHref(current: { q?: string; tag?: string }, next: { q?: string; tag?: string }) {
  const sp = new URLSearchParams()
  const q = next.q ?? current.q
  const tag = next.tag ?? current.tag

  if (q?.trim()) sp.set("q", q.trim())
  if (tag?.trim()) sp.set("tag", tag.trim())
  const qs = sp.toString()
  return qs ? `/?${qs}` : "/"
}

export function StoryFilters({
  tags,
  current,
}: {
  tags: Array<{ id: number; name: string }>
  current: { q?: string; tag?: string }
}) {
  const currentTag = current.tag?.trim() || ""
  const currentQ = current.q?.trim() || ""

  return (
    <div className="space-y-4">
      <form action="/" method="get" className="flex items-center gap-2">
        <input
          name="q"
          defaultValue={currentQ}
          placeholder="제목/본문 검색"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-700 dark:focus:ring-slate-800"
        />
        {currentTag ? <input type="hidden" name="tag" value={currentTag} /> : null}
        <button
          type="submit"
          className="shrink-0 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
        >
          검색
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        <Link
          href={buildHref(current, { tag: "" })}
          className={`rounded-full border px-3 py-1 text-xs font-semibold shadow-sm ${
            currentTag === ""
              ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
          }`}
        >
          전체
        </Link>

        {tags.map((t) => {
          const active = currentTag === t.name
          return (
            <Link
              key={t.id}
              href={buildHref(current, { tag: t.name })}
              className={`rounded-full border px-3 py-1 text-xs font-semibold shadow-sm ${
                active
                  ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
              }`}
            >
              #{t.name}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

