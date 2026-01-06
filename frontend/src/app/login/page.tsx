"use client"

import Link from "next/link"
import { useActionState } from "react"
import { loginAction } from "./server_actions"

type State = { error?: string }
const initial: State = {}

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, initial)
  const backend = process.env.NEXT_PUBLIC_BACKEND_ORIGIN ?? "http://localhost:3000"

  return (
    <section className="mx-auto w-full max-w-md space-y-5">
      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tight">로그인</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">가입한 사람만 소설을 쓸 수 있어요.</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="space-y-2">
          <a
            href={`${backend}/api/auth/google`}
            className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
          >
            Google로 계속하기
          </a>
          <a
            href={`${backend}/api/auth/apple`}
            className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
          >
            Apple로 계속하기
          </a>
          <a
            href={`${backend}/api/auth/naver`}
            className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
          >
            네이버로 계속하기
          </a>
          <a
            href={`${backend}/api/auth/kakao`}
            className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
          >
            카카오로 계속하기
          </a>
        </div>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">또는</div>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        </div>

        <form action={action} className="space-y-4">
          {state.error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-100">
              {state.error}
            </div>
          ) : null}

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
            {pending ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          계정이 없나요?{" "}
          <Link href="/signup" className="font-semibold text-slate-900 hover:underline dark:text-slate-100">
            이메일로 가입
          </Link>
        </div>
      </div>
    </section>
  )
}

