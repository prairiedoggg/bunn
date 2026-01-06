import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { token?: string } | null
  const token = body?.token
  if (!token) return NextResponse.json({ error: "missing token" }, { status: 400 })

  const res = NextResponse.json({ ok: true })
  res.cookies.set("auth_token", token, { httpOnly: true, sameSite: "lax", path: "/" })
  return res
}

