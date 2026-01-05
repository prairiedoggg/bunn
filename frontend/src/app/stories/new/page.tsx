import Link from "next/link"
import { StoryForm } from "@/components/StoryForm"

export default function NewStoryPage() {
  return (
    <section className="mx-auto w-full max-w-3xl space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight">새 소설</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">짧고 선명하게. 읽는 사람이 숨 쉬도록.</p>
        </div>
        <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100">
          목록
        </Link>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <StoryForm />
      </div>
    </section>
  )
}

