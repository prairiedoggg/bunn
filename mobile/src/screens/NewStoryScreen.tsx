import { useState } from "react"
import { Alert, Pressable, Text, TextInput, View } from "react-native"
import { createStory } from "@/lib/api"
import { getToken } from "@/lib/auth"
import { useNavigation } from "@react-navigation/native"

export function NewStoryScreen() {
  const nav = useNavigation<any>()
  const [title, setTitle] = useState("")
  const [penName, setPenName] = useState("")
  const [body, setBody] = useState("")
  const [tags, setTags] = useState("")
  const [loading, setLoading] = useState(false)

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc", padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "900" }}>새 이야기</Text>

      <View style={{ gap: 10, padding: 14, borderRadius: 18, borderWidth: 1, borderColor: "#e2e8f0", backgroundColor: "white" }}>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="제목 (한 줄)"
          style={{ borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 }}
        />
        <TextInput
          value={penName}
          onChangeText={setPenName}
          placeholder="필명(선택)"
          style={{ borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 }}
        />
        <TextInput
          value={tags}
          onChangeText={setTags}
          placeholder="태그(선택) 예) 판타지, 성장, 1인칭"
          style={{ borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 }}
        />
        <TextInput
          value={body}
          onChangeText={setBody}
          placeholder="여기에 이야기를 조용히 풀어놓아 주세요."
          multiline
          style={{ borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, minHeight: 160 }}
        />

        <Pressable
          disabled={loading}
          onPress={async () => {
            const token = await getToken()
            if (!token) {
              Alert.alert("잠깐만요", "로그인 후에 글을 남길 수 있어요.")
              nav.navigate("Login")
              return
            }
            try {
              setLoading(true)
              const tagList = tags
                .split(/[,\s]+/)
                .map((t) => t.trim().toLowerCase())
                .filter(Boolean)
                .slice(0, 10)
              const s = await createStory({ title, pen_name: penName, body, tags: tagList })
              Alert.alert("완료", "이야기를 올렸어요.")
              nav.replace("StoryDetail", { id: s.id })
            } catch (e: any) {
              Alert.alert("등록 실패", e?.message ?? "다시 시도해 주세요.")
            } finally {
              setLoading(false)
            }
          }}
          style={{ padding: 14, borderRadius: 14, backgroundColor: "#0f172a" }}
        >
          <Text style={{ color: "white", fontWeight: "800", textAlign: "center" }}>{loading ? "올리는 중..." : "올리기"}</Text>
        </Pressable>
      </View>
    </View>
  )
}

