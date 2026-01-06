import Link from "next/link"
import { getStory } from "@/lib/api"
import { CritiqueForm } from "@/components/CritiqueForm"
import { deleteCritiqueAction } from "./server_actions"

type Props = { params: Promise<{ id: string }> }

export default async function StoryDetailPage({ params }: Props) {
  const { id } = await params
  const { story, critiques } = await getStory(id)

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_420px]">
      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h1 className="break-words text-2xl font-black tracking-tight">{story.title}</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          <span className="font-medium">{story.pen_name?.trim() ? story.pen_name : "익명"}</span>
          <span className="mx-1 text-slate-300 dark:text-slate-700">·</span>
          <span className="text-slate-500 dark:text-slate-400">{new Date(story.created_at).toLocaleString("ko-KR")}</span>
        </p>
        {story.tags?.length ? (
          <p className="mt-3 flex flex-wrap gap-2">
            {story.tags.slice(0, 10).map((t) => (
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
        <hr className="my-6 border-slate-200 dark:border-slate-800" />
        <div className="whitespace-pre-wrap break-words text-base leading-relaxed text-slate-800 dark:text-slate-200">{story.body}</div>
      </article>

      <aside className="space-y-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-base font-bold">
              합평 (<span className="tabular-nums">{story.critiques_count}</span>)
            </h2>
            <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100">
              목록
            </Link>
          </div>

          <div className="mt-4">
            <CritiqueForm storyId={story.id} />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="space-y-3">
            {critiques.length === 0 ? (
              <p className="text-sm text-slate-600 dark:text-slate-300">아직 합평이 없어요. 첫 합평을 남겨주세요.</p>
            ) : (
              critiques.map((c) => (
                <article key={c.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold">
                      {c.pen_name?.trim() ? c.pen_name : "익명"}
                      <span className="ml-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                        {new Date(c.created_at).toLocaleString("ko-KR")}
                      </span>
                    </p>
                    <form action={deleteCritiqueAction}>
                      <input type="hidden" name="storyId" value={String(story.id)} />
                      <input type="hidden" name="critiqueId" value={String(c.id)} />
                      <button
                        type="submit"
                        className="shrink-0 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                      >
                        삭제
                      </button>
                    </form>
                  </div>
                  <div className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-800 dark:text-slate-200">{c.body}</div>
                </article>
              ))
            )}
          </div>
        </div>
      </aside>
    </section>
  )
}

