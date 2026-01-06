"use client"

import Link from "next/link"
import { useActionState } from "react"
import { signupAction } from "./server_actions"

type State = { error?: string }
const initial: State = {}

export default function SignupPage() {
  const [state, action, pending] = useActionState(signupAction, initial)

  return (
    <section className="mx-auto w-full max-w-md space-y-5">
      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tight">이메일로 가입</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">가입 후 바로 글을 쓸 수 있어요.</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <form action={action} className="space-y-4">
          {state.error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-100">
              {state.error}
            </div>
          ) : null}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="name">
              이름(선택)
            </label>
            <input
              id="name"
              name="name"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="email">
              이메일
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="password">
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-slate-800"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            {pending ? "가입 중..." : "가입하기"}
          </button>
        </form>

        <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          이미 계정이 있나요?{" "}
          <Link href="/login" className="font-semibold text-slate-900 hover:underline dark:text-slate-100">
            로그인
          </Link>
        </div>
      </div>
    </section>
  )
}

