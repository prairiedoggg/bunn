import { useEffect, useState } from "react"
import { ActivityIndicator, Alert, Pressable, ScrollView, Switch, Text, TextInput, View } from "react-native"
import { createCritique, getStory } from "@/lib/api"
import { useRoute } from "@react-navigation/native"

export function StoryDetailScreen() {
  const route = useRoute<any>()
  const id = Number(route.params?.id)

  const [loading, setLoading] = useState(true)
  const [story, setStory] = useState<any>(null)
  const [critiques, setCritiques] = useState<any[]>([])
  const [penName, setPenName] = useState("")
  const [body, setBody] = useState("")
  const [isPublic, setIsPublic] = useState(true)

  const refresh = async () => {
    setLoading(true)
    try {
      const data = await getStory(id)
      setStory(data.story)
      setCritiques(data.critiques)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [id])

  if (loading) return <ActivityIndicator style={{ marginTop: 24 }} />
  if (!story) return <Text style={{ padding: 16 }}>찾는 글이 보이지 않아요.</Text>

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f8fafc" }} contentContainerStyle={{ padding: 16, gap: 12 }}>
      <View style={{ borderWidth: 1, borderColor: "#e2e8f0", backgroundColor: "white", borderRadius: 18, padding: 14 }}>
        <Text style={{ fontSize: 20, fontWeight: "900" }}>{story.title}</Text>
        <Text style={{ marginTop: 6, color: "#475569", fontSize: 12 }}>
          {(story.pen_name?.trim() ? story.pen_name : "익명") + " · " + new Date(story.created_at).toLocaleString("ko-KR")}
        </Text>
        {story.tags?.length ? (
          <Text style={{ marginTop: 8, fontSize: 12, fontWeight: "800", color: "#0f172a" }}>
            {story.tags.map((t: string) => `#${t}`).join("  ")}
          </Text>
        ) : null}
        <Text style={{ marginTop: 12, color: "#0f172a", lineHeight: 20 }}>{story.body}</Text>
      </View>

      <View style={{ borderWidth: 1, borderColor: "#e2e8f0", backgroundColor: "white", borderRadius: 18, padding: 14 }}>
        <Text style={{ fontSize: 14, fontWeight: "900" }}>합평 ({story.critiques_count})</Text>

        <View style={{ marginTop: 10, gap: 8 }}>
          <TextInput
            value={penName}
            onChangeText={setPenName}
            placeholder="필명(선택)"
            style={{ borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: "white" }}
          />
          <TextInput
            value={body}
            onChangeText={setBody}
            placeholder="좋았던 문장, 아쉬웠던 숨결, 다음에 기대되는 장면을 남겨주세요"
            multiline
            style={{ borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, minHeight: 100, backgroundColor: "white" }}
          />
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 4 }}>
            <Text style={{ fontWeight: "800", color: "#0f172a" }}>공개 합평</Text>
            <Switch value={isPublic} onValueChange={setIsPublic} />
          </View>
          <Pressable
            onPress={async () => {
              try {
                await createCritique(story.id, { pen_name: penName, body, is_public: isPublic })
                setPenName("")
                setBody("")
                setIsPublic(true)
                await refresh()
              } catch (e: any) {
                Alert.alert("합평을 남기지 못했어요", e?.message ?? "로그인이 필요할 수 있어요.")
              }
            }}
            style={{ alignSelf: "flex-end", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, backgroundColor: "#0f172a" }}
          >
            <Text style={{ color: "white", fontWeight: "800" }}>합평 남기기</Text>
          </Pressable>
        </View>
      </View>

      <View style={{ gap: 10 }}>
        {critiques.length === 0 ? <Text style={{ color: "#475569" }}>아직 이 글엔 답장이 없어요.</Text> : null}
        {critiques.map((c) => (
          <View key={c.id} style={{ borderWidth: 1, borderColor: "#e2e8f0", backgroundColor: "white", borderRadius: 18, padding: 14 }}>
            <Text style={{ fontWeight: "800" }}>
              {c.pen_name?.trim() ? c.pen_name : c.is_public === false ? "비공개" : "익명"}{" "}
              <Text style={{ fontWeight: "600", color: "#64748b", fontSize: 12 }}>{new Date(c.created_at).toLocaleString("ko-KR")}</Text>
            </Text>
            <Text style={{ marginTop: 8, color: "#0f172a", lineHeight: 20 }}>{c.body ?? "비공개로 남겨진 합평입니다."}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

