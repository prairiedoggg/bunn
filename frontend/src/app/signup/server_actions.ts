"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

type ActionState = { error?: string }

export async function signupAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get("email") ?? "")
  const password = String(formData.get("password") ?? "")
  const name = String(formData.get("name") ?? "")

  const base = process.env.API_BASE_URL ?? "http://localhost:3000"
  const res = await fetch(`${base}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  })

  const data = (await res.json().catch(() => null)) as { token?: string; errors?: string[] } | null
  if (!res.ok || !data?.token) return { error: data?.errors?.[0] ?? "가입에 실패했어요." }

  ;(await cookies()).set("auth_token", data.token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  })

  redirect("/")
}

