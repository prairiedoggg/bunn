export const env = {
  // 비워두면 Next rewrites(/api/*)를 통해 같은 오리진으로 프록시됩니다(CORS 회피).
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
} as const

