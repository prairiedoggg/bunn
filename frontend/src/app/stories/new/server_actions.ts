"use server"

import { redirect } from "next/navigation"

type ActionState = { errors: string[] }

export async function createStoryAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const title = String(formData.get("title") ?? "")
  const pen_name = String(formData.get("pen_name") ?? "")
  const body = String(formData.get("body") ?? "")

  if (!title.trim()) return { errors: ["제목을 입력해 주세요."] }
  if (!body.trim()) return { errors: ["본문을 입력해 주세요."] }

  const res = await fetch("/api/stories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ story: { title, pen_name, body } }),
  })

  const data = (await res.json().catch(() => null)) as { story?: { id: number }; errors?: string[] } | null

  if (!res.ok) {
    return { errors: data?.errors?.length ? data.errors : ["소설 등록에 실패했어요."] }
  }

  redirect(`/stories/${data?.story?.id}`)
}

