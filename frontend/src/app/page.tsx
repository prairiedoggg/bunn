import Link from "next/link"
import { listStories, listTags } from "@/lib/api"
import { StoryFilters } from "@/components/StoryFilters"

type Props = {
  searchParams: Promise<{ q?: string; tag?: string }>
}

export default async function Home({ searchParams }: Props) {
  const sp = await searchParams
  const q = sp.q
  const tag = sp.tag

  const [stories, tags] = await Promise.all([listStories({ q, tag }), listTags()])
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">문(文)</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">짧은 소설을 올리고, 정직한 합평을 나누는 곳.</p>
      </div>

      <StoryFilters tags={tags} current={{ q, tag }} />

      {stories.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-950">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">아직 올라온 소설이 없어요.</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">첫 번째 글을 올려볼까요?</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {stories.map((s) => (
            <article key={s.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <h2 className="truncate text-lg font-semibold tracking-tight">
                <Link href={`/stories/${s.id}`} className="hover:underline">
                  {s.title}
                </Link>
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                <span className="font-medium">{s.pen_name?.trim() ? s.pen_name : "익명"}</span>
                <span className="mx-1 text-slate-300 dark:text-slate-700">·</span>
                <span className="text-slate-500 dark:text-slate-400">{new Date(s.created_at).toLocaleString("ko-KR")}</span>
              </p>
              {s.tags?.length ? (
                <p className="mt-2 flex flex-wrap gap-2">
                  {s.tags.slice(0, 5).map((t) => (
                    <Link
                      key={t}
                      href={`/?tag=${encodeURIComponent(t)}`}
                      className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      #{t}
                    </Link>
                  ))}
                </p>
              ) : null}
              <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                {s.body.length > 180 ? `${s.body.slice(0, 180)}…` : s.body}
              </p>
              <div className="mt-5 flex items-center justify-between">
                <Link
                  href={`/stories/${s.id}`}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 active:bg-slate-950 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                  읽기
                </Link>
                <span className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                  합평 <span className="tabular-nums">{s.critiques_count}</span>
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
