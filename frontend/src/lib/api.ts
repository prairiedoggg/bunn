import { env } from "@/lib/env"

export type Story = {
  id: number
  title: string
  pen_name: string | null
  body: string
  critiques_count: number
  created_at: string
}

export type Critique = {
  id: number
  story_id?: number
  pen_name: string | null
  body: string
  created_at: string
}

function apiUrl(path: string) {
  return env.apiBaseUrl ? `${env.apiBaseUrl}${path}` : path
}

export async function listStories(): Promise<Story[]> {
  const res = await fetch(apiUrl("/api/stories"), { cache: "no-store" })
  if (!res.ok) throw new Error("stories fetch failed")
  const data = (await res.json()) as { stories: Story[] }
  return data.stories
}

export async function getStory(id: string): Promise<{ story: Story; critiques: Critique[] }> {
  const res = await fetch(apiUrl(`/api/stories/${id}`), { cache: "no-store" })
  if (!res.ok) throw new Error("story fetch failed")
  return (await res.json()) as { story: Story; critiques: Critique[] }
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

