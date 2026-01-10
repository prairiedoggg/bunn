import { config } from "@/lib/config"
import { getToken } from "@/lib/auth"

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
  pen_name: string | null
  body: string | null
  is_public?: boolean
  mine?: boolean
  created_at: string
}

export type Tag = { id: number; name: string }

async function request(path: string, init?: RequestInit, auth: boolean = false) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> | undefined),
  }

  if (auth) {
    const token = await getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${config.apiBaseUrl}${path}`, { ...init, headers })
  return res
}

export async function listStories(params?: { q?: string; tag?: string }) {
  const sp = new URLSearchParams()
  if (params?.q) sp.set("q", params.q)
  if (params?.tag) sp.set("tag", params.tag)
  const qs = sp.toString()
  const res = await request(`/api/stories${qs ? `?${qs}` : ""}`)
  if (!res.ok) throw new Error("stories fetch failed")
  return ((await res.json()) as { stories: Story[] }).stories
}

export async function getStory(id: number) {
  const res = await request(`/api/stories/${id}`)
  if (!res.ok) throw new Error("story fetch failed")
  return (await res.json()) as { story: Story; critiques: Critique[] }
}

export async function randomStory() {
  const res = await request(`/api/stories/random`)
  if (!res.ok) return null
  const data = (await res.json()) as { story: Story | null }
  return data.story
}

export async function listTags() {
  const res = await request(`/api/tags`)
  if (!res.ok) throw new Error("tags fetch failed")
  return ((await res.json()) as { tags: Tag[] }).tags
}

export async function registerEmail(input: { email: string; password: string; name?: string }) {
  const res = await request(`/api/auth/register`, { method: "POST", body: JSON.stringify(input) })
  const data = (await res.json().catch(() => null)) as { token?: string; errors?: string[] } | null
  if (!res.ok || !data?.token) throw new Error(data?.errors?.[0] ?? "register failed")
  return data.token
}

export async function loginEmail(input: { email: string; password: string }) {
  const res = await request(`/api/auth/login`, { method: "POST", body: JSON.stringify(input) })
  const data = (await res.json().catch(() => null)) as { token?: string; error?: string } | null
  if (!res.ok || !data?.token) throw new Error(data?.error ?? "login failed")
  return data.token
}

export async function createStory(input: { title: string; pen_name?: string; body: string; tags?: string[] }) {
  const res = await request(`/api/stories`, { method: "POST", body: JSON.stringify({ story: input }) }, true)
  const data = (await res.json().catch(() => null)) as { story?: Story; errors?: string[] } | null
  if (!res.ok || !data?.story) throw new Error(data?.errors?.[0] ?? "create story failed")
  return data.story
}

export async function createCritique(storyId: number, input: { pen_name?: string; body: string; is_public?: boolean }) {
  const res = await request(`/api/stories/${storyId}/critiques`, { method: "POST", body: JSON.stringify({ critique: input }) }, true)
  const data = (await res.json().catch(() => null)) as { critique?: Critique; errors?: string[] } | null
  if (!res.ok || !data?.critique) throw new Error(data?.errors?.[0] ?? "create critique failed")
  return data.critique
}

