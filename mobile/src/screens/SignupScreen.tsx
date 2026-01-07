import { useState } from "react"
import { Alert, Pressable, Text, TextInput, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { registerEmail } from "@/lib/api"
import { setToken } from "@/lib/auth"

export function SignupScreen() {
  const nav = useNavigation<any>()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc", padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "900" }}>이메일로 가입</Text>
      <Text style={{ color: "#475569" }}>가입 후 바로 글을 쓸 수 있어요.</Text>

      <View style={{ gap: 10, padding: 14, borderRadius: 18, borderWidth: 1, borderColor: "#e2e8f0", backgroundColor: "white" }}>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="이름(선택)"
          style={{ borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 }}
        />
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
              const token = await registerEmail({ email, password, name })
              await setToken(token)
              Alert.alert("완료", "가입되었어요.")
              nav.goBack()
            } catch (e: any) {
              Alert.alert("가입 실패", e?.message ?? "다시 시도해 주세요.")
            } finally {
              setLoading(false)
            }
          }}
          style={{ padding: 14, borderRadius: 14, backgroundColor: "#0f172a" }}
        >
          <Text style={{ color: "white", fontWeight: "800", textAlign: "center" }}>{loading ? "가입 중..." : "가입하기"}</Text>
        </Pressable>
      </View>
    </View>
  )
}

