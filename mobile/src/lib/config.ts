import Constants from "expo-constants"
import { Platform } from "react-native"

type Extra = {
  apiBaseUrl?: string
}

// Expo 개발환경에서 localhost는 디바이스/에뮬레이터마다 다릅니다.
// - iOS 시뮬레이터: http://localhost:3000
// - Android 에뮬레이터: http://10.0.2.2:3000
// - 실제 디바이스: 같은 Wi-Fi의 PC IP 사용 (예: http://192.168.0.10:3000)
function defaultApiBaseUrl() {
  if (Platform.OS === "android") return "http://10.0.2.2:3000"
  return "http://localhost:3000"
}

const extra = (Constants.expoConfig?.extra ?? {}) as Extra

export const config = {
  apiBaseUrl: extra.apiBaseUrl ?? defaultApiBaseUrl(),
} as const

