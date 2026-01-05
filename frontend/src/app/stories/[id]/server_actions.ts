"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

type ActionState = { errors: string[] }

export async function createCritiqueAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const storyId = String(formData.get("storyId") ?? "")
  const pen_name = String(formData.get("pen_name") ?? "")
  const body = String(formData.get("body") ?? "")

  if (!storyId) return { errors: ["잘못된 요청이에요."] }
  if (!body.trim()) return { errors: ["합평을 입력해 주세요."] }

  const res = await fetch(`/api/stories/${storyId}/critiques`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ critique: { pen_name, body } }),
  })

  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { errors?: string[] } | null
    return { errors: data?.errors?.length ? data.errors : ["합평 등록에 실패했어요."] }
  }

  revalidatePath(`/stories/${storyId}`)
  redirect(`/stories/${storyId}`)
}

export async function deleteCritiqueAction(formData: FormData) {
  const storyId = String(formData.get("storyId") ?? "")
  const critiqueId = String(formData.get("critiqueId") ?? "")

  if (!storyId || !critiqueId) return

  await fetch(`/api/stories/${storyId}/critiques/${critiqueId}`, { method: "DELETE" })
  revalidatePath(`/stories/${storyId}`)
  redirect(`/stories/${storyId}`)
}

