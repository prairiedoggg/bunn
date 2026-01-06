"use server"

import { redirect } from "next/navigation"
import { cookies } from "next/headers"

type ActionState = { errors: string[] }

export async function createStoryAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const title = String(formData.get("title") ?? "")
  const pen_name = String(formData.get("pen_name") ?? "")
  const body = String(formData.get("body") ?? "")
  const tags = String(formData.get("tags") ?? "")
    .split(/[,\s]+/)
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 10)

  if (!title.trim()) return { errors: ["제목을 입력해 주세요."] }
  if (!body.trim()) return { errors: ["본문을 입력해 주세요."] }

  const base = process.env.API_BASE_URL ?? "http://localhost:3000"
  const token = (await cookies()).get("auth_token")?.value
  if (!token) return { errors: ["로그인이 필요해요."] }

  const res = await fetch(`${base}/api/stories`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ story: { title, pen_name, body, tags } }),
  })

  const data = (await res.json().catch(() => null)) as { story?: { id: number }; errors?: string[] } | null

  if (!res.ok) {
    return { errors: data?.errors?.length ? data.errors : ["소설 등록에 실패했어요."] }
  }

  redirect(`/stories/${data?.story?.id}`)
}

