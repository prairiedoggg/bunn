import { useEffect, useMemo, useState } from "react"
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from "react-native"
import { listStories, listTags, randomStory, type Story } from "@/lib/api"
import { useNavigation } from "@react-navigation/native"

export function StoriesScreen() {
  const nav = useNavigation<any>()
  const [loading, setLoading] = useState(true)
  const [stories, setStories] = useState<Story[]>([])
  const [tags, setTags] = useState<Array<{ id: number; name: string }>>([])
  const [q, setQ] = useState("")
  const [activeTag, setActiveTag] = useState<string>("")

  const header = useMemo(() => {
    return (
      <View style={{ gap: 12, padding: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 22, fontWeight: "800" }}>문(文)</Text>
          <Pressable
            onPress={async () => {
              const s = await randomStory()
              if (s?.id) nav.navigate("StoryDetail", { id: s.id })
            }}
            style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: "#e2e8f0" }}
          >
            <Text style={{ fontWeight: "700" }}>한 편 뽑기</Text>
          </Pressable>
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="문장 찾기"
            style={{
              flex: 1,
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderWidth: 1,
              borderColor: "#e2e8f0",
              borderRadius: 12,
              backgroundColor: "white",
            }}
          />
          <Pressable
            onPress={async () => {
              setLoading(true)
              const next = await listStories({ q, tag: activeTag || undefined })
              setStories(next)
              setLoading(false)
            }}
            style={{ paddingHorizontal: 14, justifyContent: "center", borderRadius: 12, backgroundColor: "#0f172a" }}
          >
            <Text style={{ color: "white", fontWeight: "700" }}>찾기</Text>
          </Pressable>
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          <Pressable
            onPress={async () => {
              setActiveTag("")
              setLoading(true)
              const next = await listStories({ q: q || undefined })
              setStories(next)
              setLoading(false)
            }}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 999,
              backgroundColor: activeTag === "" ? "#0f172a" : "white",
              borderWidth: 1,
              borderColor: activeTag === "" ? "#0f172a" : "#e2e8f0",
            }}
          >
            <Text style={{ color: activeTag === "" ? "white" : "#0f172a", fontWeight: "700", fontSize: 12 }}>모두</Text>
          </Pressable>
          {tags.map((t) => {
            const active = activeTag === t.name
            return (
              <Pressable
                key={t.id}
                onPress={async () => {
                  setActiveTag(t.name)
                  setLoading(true)
                  const next = await listStories({ q: q || undefined, tag: t.name })
                  setStories(next)
                  setLoading(false)
                }}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: active ? "#0f172a" : "white",
                  borderWidth: 1,
                  borderColor: active ? "#0f172a" : "#e2e8f0",
                }}
              >
                <Text style={{ color: active ? "white" : "#0f172a", fontWeight: "700", fontSize: 12 }}>#{t.name}</Text>
              </Pressable>
            )
          })}
        </View>
      </View>
    )
  }, [activeTag, nav, q, tags])

  useEffect(() => {
    ;(async () => {
      try {
        const [s, t] = await Promise.all([listStories(), listTags()])
        setStories(s)
        setTags(t)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      {loading ? <ActivityIndicator style={{ marginTop: 24 }} /> : null}
      <FlatList
        ListHeaderComponent={header}
        data={stories}
        keyExtractor={(it) => String(it.id)}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => nav.navigate("StoryDetail", { id: item.id })}
            style={{
              marginHorizontal: 16,
              marginBottom: 12,
              padding: 14,
              borderRadius: 18,
              borderWidth: 1,
              borderColor: "#e2e8f0",
              backgroundColor: "white",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "800" }} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={{ marginTop: 4, color: "#475569", fontSize: 12 }}>
              {(item.pen_name?.trim() ? item.pen_name : "익명") + " · " + new Date(item.created_at).toLocaleString("ko-KR")}
            </Text>
            {item.tags?.length ? (
              <Text style={{ marginTop: 6, color: "#0f172a", fontSize: 12, fontWeight: "700" }} numberOfLines={1}>
                {item.tags.slice(0, 5).map((t) => `#${t}`).join("  ")}
              </Text>
            ) : null}
            <Text style={{ marginTop: 10, color: "#334155" }} numberOfLines={3}>
              {item.body}
            </Text>
            <Text style={{ marginTop: 10, color: "#0f172a", fontWeight: "800", fontSize: 12 }}>
              합평 {item.critiques_count}개
            </Text>
          </Pressable>
        )}
      />
    </View>
  )
}

