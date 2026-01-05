import Link from "next/link"
import { ThemeToggle } from "@/components/ThemeToggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="group flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-base font-black text-white shadow-sm dark:bg-white dark:text-slate-900">
            文
          </span>
          <span className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            文 <span className="ml-1 text-xs font-medium text-slate-500 dark:text-slate-400">단편소설 · 합평</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/stories/new"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 active:bg-slate-950 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            새 소설 쓰기
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

