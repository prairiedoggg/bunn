import { env } from "@/lib/env"

export type Story = {
  id: number
  title: string
  pen_name: string | null
  body: string
  critiques_count: number
  tags: string[]
  created_at: string
}

export type Critique = {
  id: number
  story_id?: number
  pen_name: string | null
  body: string | null
  is_public?: boolean
  mine?: boolean
  created_at: string
}

function apiUrl(path: string) {
  // 서버(RSC)에서는 fetch("/api/...")가 URL 파싱 에러가 나므로 Rails로 직결합니다.
  if (typeof window === "undefined") return `${env.serverApiBaseUrl}${path}`
  // 브라우저에서는 Next rewrites(/api/*)를 통해 프록시됩니다.
  return path
}

export async function listStories(params?: { q?: string; tag?: string }): Promise<Story[]> {
  const sp = new URLSearchParams()
  if (params?.q) sp.set("q", params.q)
  if (params?.tag) sp.set("tag", params.tag)

  const url = sp.toString() ? `/api/stories?${sp.toString()}` : "/api/stories"
  const res = await fetch(apiUrl(url), { cache: "no-store" })
  if (!res.ok) throw new Error("stories fetch failed")
  const data = (await res.json()) as { stories: Story[] }
  return data.stories
}

export async function getStory(id: string): Promise<{ story: Story; critiques: Critique[] }> {
  const res = await fetch(apiUrl(`/api/stories/${id}`), { cache: "no-store" })
  if (!res.ok) throw new Error("story fetch failed")
  return (await res.json()) as { story: Story; critiques: Critique[] }
}

export async function listTags(): Promise<Array<{ id: number; name: string }>> {
  const res = await fetch(apiUrl("/api/tags"), { cache: "no-store" })
  if (!res.ok) throw new Error("tags fetch failed")
  const data = (await res.json()) as { tags: Array<{ id: number; name: string }> }
  return data.tags
}

export async function createStory(input: { title: string; pen_name?: string; body: string }) {
  const res = await fetch(apiUrl("/api/stories"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ story: input }),
  })
  const data = (await res.json()) as { story?: Story; errors?: string[] }
  if (!res.ok) throw new Error(data.errors?.join("\n") || "create failed")
  return data.story!
}

export async function createCritique(storyId: number, input: { pen_name?: string; body: string }) {
  const res = await fetch(apiUrl(`/api/stories/${storyId}/critiques`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ critique: input }),
  })
  const data = (await res.json()) as { critique?: Critique; errors?: string[] }
  if (!res.ok) throw new Error(data.errors?.join("\n") || "create critique failed")
  return data.critique!
}

