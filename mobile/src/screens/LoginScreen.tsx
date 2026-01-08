import { useState } from "react"
import { Alert, Pressable, Text, TextInput, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { loginEmail } from "@/lib/api"
import { setToken } from "@/lib/auth"
import * as WebBrowser from "expo-web-browser"
import * as Linking from "expo-linking"
import { config } from "@/lib/config"

export function LoginScreen() {
  const nav = useNavigation<any>()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const socialLogin = async (provider: "google" | "apple" | "naver" | "kakao") => {
    // Expo 개발환경에서는 exp://... 딥링크가 만들어집니다.
    const returnTo = Linking.createURL("auth/callback")
    const startUrl = `${config.apiBaseUrl}/api/auth/${provider}?return_to=${encodeURIComponent(returnTo)}`

    try {
      const result = await WebBrowser.openAuthSessionAsync(startUrl, returnTo)
      if (result.type !== "success" || !result.url) return

      const hash = result.url.split("#")[1] ?? ""
      const sp = new URLSearchParams(hash)
      const token = sp.get("token")
      if (!token) {
        Alert.alert("로그인 실패", "토큰이 없어요. 다시 시도해 주세요.")
        return
      }

      await setToken(token)
      Alert.alert("완료", "소셜 로그인 되었어요.")
      nav.goBack()
    } catch (e: any) {
      Alert.alert("소셜 로그인 실패", e?.message ?? "다시 시도해 주세요.")
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc", padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "900" }}>로그인</Text>
      <Text style={{ color: "#475569" }}>가입한 사람만 소설을 쓸 수 있어요.</Text>

      <View style={{ gap: 10, padding: 14, borderRadius: 18, borderWidth: 1, borderColor: "#e2e8f0", backgroundColor: "white" }}>
        <Pressable onPress={() => socialLogin("google")} style={{ padding: 14, borderRadius: 14, borderWidth: 1, borderColor: "#e2e8f0" }}>
          <Text style={{ fontWeight: "800", textAlign: "center" }}>Google로 계속하기</Text>
        </Pressable>
        <Pressable onPress={() => socialLogin("apple")} style={{ padding: 14, borderRadius: 14, borderWidth: 1, borderColor: "#e2e8f0" }}>
          <Text style={{ fontWeight: "800", textAlign: "center" }}>Apple로 계속하기</Text>
        </Pressable>
        <Pressable onPress={() => socialLogin("naver")} style={{ padding: 14, borderRadius: 14, borderWidth: 1, borderColor: "#e2e8f0" }}>
          <Text style={{ fontWeight: "800", textAlign: "center" }}>네이버로 계속하기</Text>
        </Pressable>
        <Pressable onPress={() => socialLogin("kakao")} style={{ padding: 14, borderRadius: 14, borderWidth: 1, borderColor: "#e2e8f0" }}>
          <Text style={{ fontWeight: "800", textAlign: "center" }}>카카오로 계속하기</Text>
        </Pressable>

        <View style={{ height: 1, backgroundColor: "#e2e8f0", marginVertical: 6 }} />

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="이메일"
          autoCapitalize="none"
          keyboardType="email-address"
          style={{ borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 }}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="비밀번호"
          secureTextEntry
          style={{ borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 }}
        />

        <Pressable
          disabled={loading}
          onPress={async () => {
            try {
              setLoading(true)
              const token = await loginEmail({ email, password })
              await setToken(token)
              Alert.alert("완료", "로그인 되었어요.")
              nav.goBack()
            } catch (e: any) {
              Alert.alert("로그인 실패", e?.message ?? "다시 시도해 주세요.")
            } finally {
              setLoading(false)
            }
          }}
          style={{ padding: 14, borderRadius: 14, backgroundColor: "#0f172a" }}
        >
          <Text style={{ color: "white", fontWeight: "800", textAlign: "center" }}>{loading ? "로그인 중..." : "로그인"}</Text>
        </Pressable>

        <Pressable onPress={() => nav.navigate("Signup")} style={{ paddingVertical: 8 }}>
          <Text style={{ textAlign: "center", fontWeight: "800" }}>이메일로 가입</Text>
        </Pressable>
      </View>
    </View>
  )
}

