import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { StoriesScreen } from "@/screens/StoriesScreen"
import { AccountScreen } from "@/screens/AccountScreen"

const Tab = createBottomTabNavigator()

export function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Stories" component={StoriesScreen} options={{ title: "소설" }} />
      <Tab.Screen name="Account" component={AccountScreen} options={{ title: "계정" }} />
    </Tab.Navigator>
  )
}

