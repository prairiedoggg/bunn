"use client"

import { useActionState } from "react"
import { createStoryAction } from "@/app/stories/new/server_actions"

type ActionState = { errors: string[] }
const initialState: ActionState = { errors: [] }

export function StoryForm() {
  const [state, action, pending] = useActionState(createStoryAction, initialState)

  return (
    <form action={action} className="space-y-5">
      {state.errors.length > 0 ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900 shadow-sm dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-100">
          <p className="font-medium">잠깐, 문장을 한 번 더 다듬어 볼까요?</p>
          <ul className="mt-2 list-disc pl-5">
            {state.errors.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="title">
            제목
          </label>
          <input
            id="title"
            name="title"
            placeholder="예) 잉크 냄새가 남은 밤"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-700 dark:focus:ring-slate-800"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="pen_name">
            필명(선택)
          </label>
          <input
            id="pen_name"
            name="pen_name"
            placeholder="익명"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-700 dark:focus:ring-slate-800"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="body">
          본문
        </label>
        <textarea
          id="body"
          name="body"
          rows={16}
          placeholder="여기에 이야기를 조용히 풀어놓아 주세요."
          className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-700 dark:focus:ring-slate-800"
        />
        <p className="text-xs text-slate-500 dark:text-slate-400">줄바꿈은 그대로, 리듬도 그대로.</p>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="tags">
          태그(선택)
        </label>
        <input
          id="tags"
          name="tags"
          placeholder="예) 판타지, 성장, 1인칭"
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-700 dark:focus:ring-slate-800"
        />
        <p className="text-xs text-slate-500 dark:text-slate-400">쉼표(,) 또는 공백으로 구분해요. 최대 10개.</p>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
        >
          {pending ? "올리는 중..." : "올리기"}
        </button>
      </div>
    </form>
  )
}

