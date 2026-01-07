import { useEffect, useState } from "react"
import { Alert, Pressable, Text, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { clearToken, getToken } from "@/lib/auth"

export function AccountScreen() {
  const nav = useNavigation<any>()
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    ;(async () => {
      const t = await getToken()
      setLoggedIn(!!t)
    })()
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc", padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "900" }}>계정</Text>

      {loggedIn ? (
        <>
          <Pressable
            onPress={async () => {
              await clearToken()
              setLoggedIn(false)
              Alert.alert("로그아웃", "로그아웃 되었어요.")
            }}
            style={{ padding: 14, borderRadius: 14, backgroundColor: "#0f172a" }}
          >
            <Text style={{ color: "white", fontWeight: "800" }}>로그아웃</Text>
          </Pressable>

          <Pressable
            onPress={() => nav.navigate("NewStory")}
            style={{ padding: 14, borderRadius: 14, borderWidth: 1, borderColor: "#e2e8f0", backgroundColor: "white" }}
          >
            <Text style={{ fontWeight: "800" }}>새 소설 쓰기</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Pressable onPress={() => nav.navigate("Login")} style={{ padding: 14, borderRadius: 14, backgroundColor: "#0f172a" }}>
            <Text style={{ color: "white", fontWeight: "800" }}>로그인</Text>
          </Pressable>
          <Pressable onPress={() => nav.navigate("Signup")} style={{ padding: 14, borderRadius: 14, borderWidth: 1, borderColor: "#e2e8f0", backgroundColor: "white" }}>
            <Text style={{ fontWeight: "800" }}>이메일로 가입</Text>
          </Pressable>
        </>
      )}
    </View>
  )
}

