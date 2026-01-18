"use client"

import { useActionState } from "react"
import { createCritiqueAction } from "@/app/stories/[id]/server_actions"

type ActionState = { errors: string[] }

const initialState: ActionState = { errors: [] }

export function CritiqueForm({ storyId }: { storyId: number }) {
  const [state, action, pending] = useActionState(createCritiqueAction, initialState)

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="storyId" value={String(storyId)} />

      {state.errors.length > 0 ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-100">
          <p className="font-medium">잠깐, 문장을 한 번 더 다듬어 볼까요?</p>
          <ul className="mt-2 list-disc pl-5">
            {state.errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
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
        <div className="hidden md:block" aria-hidden="true"></div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="body">
          합평
        </label>
        <textarea
          id="body"
          name="body"
          rows={5}
          placeholder="좋았던 문장, 아쉬웠던 숨결, 다음에 기대되는 장면을 남겨주세요."
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-700 dark:focus:ring-slate-800"
        />
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <input
            type="checkbox"
            name="is_public"
            defaultChecked
            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-slate-800"
          />
          공개 합평
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">(끄면 비공개로 남겨져요)</span>
        </label>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
        >
          {pending ? "남기는 중..." : "합평 남기기"}
        </button>
      </div>
    </form>
  )
}

