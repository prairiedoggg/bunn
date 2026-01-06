import { cookies } from "next/headers"

export async function getAuthToken() {
  return (await cookies()).get("auth_token")?.value ?? null
}

