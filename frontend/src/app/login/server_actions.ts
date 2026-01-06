"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

type ActionState = { error?: string }

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "")
  const password = String(formData.get("password") ?? "")

  const base = process.env.API_BASE_URL ?? "http://localhost:3000"
  const res = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  const data = (await res.json().catch(() => null)) as { token?: string; error?: string } | null
  if (!res.ok || !data?.token) return { error: data?.error ?? "로그인에 실패했어요." }

  ;(await cookies()).set("auth_token", data.token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  })

  redirect("/")
}

export async function logoutAction() {
  ;(await cookies()).delete("auth_token")
  redirect("/")
}

