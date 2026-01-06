export const env = {
  // 서버(Next RSC/Server Actions)에서는 상대경로 fetch가 깨질 수 있어 절대 URL을 사용합니다.
  // docker-compose에서는 API_BASE_URL=http://web:3000 로 주입됩니다.
  serverApiBaseUrl: process.env.API_BASE_URL ?? "http://localhost:3000",
} as const

