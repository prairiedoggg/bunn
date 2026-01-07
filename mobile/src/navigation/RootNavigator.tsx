import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { MainTabs } from "@/navigation/MainTabs"
import type { RootStackParamList } from "@/navigation/types"
import { LoginScreen } from "@/screens/LoginScreen"
import { SignupScreen } from "@/screens/SignupScreen"
import { StoryDetailScreen } from "@/screens/StoryDetailScreen"
import { NewStoryScreen } from "@/screens/NewStoryScreen"

const Stack = createNativeStackNavigator<RootStackParamList>()

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="StoryDetail" component={StoryDetailScreen} options={{ title: "소설" }} />
        <Stack.Screen name="NewStory" component={NewStoryScreen} options={{ title: "새 소설" }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: "로그인" }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ title: "이메일 가입" }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

