import { redirect } from "next/navigation"
import { env } from "@/lib/env"

export default async function RandomPage() {
  const res = await fetch(`${env.serverApiBaseUrl}/api/stories/random`, { cache: "no-store" })
  if (!res.ok) redirect("/")
  const data = (await res.json()) as { story?: { id: number } | null }
  if (!data.story?.id) redirect("/")
  redirect(`/stories/${data.story.id}`)
}

