"use client"

import { useEffect, useState } from "react"

export default function AuthCallbackPage() {
  const [message, setMessage] = useState("로그인 처리 중...")

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "")
    const sp = new URLSearchParams(hash)
    const token = sp.get("token")

    if (!token) {
      setMessage("토큰이 없어요. 다시 시도해 주세요.")
      return
    }

    fetch("/api/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (r) => {
        if (!r.ok) throw new Error("token set failed")
        window.location.replace("/")
      })
      .catch(() => setMessage("로그인 처리에 실패했어요. 다시 시도해 주세요."))
  }, [])

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
      {message}
    </div>
  )
}

