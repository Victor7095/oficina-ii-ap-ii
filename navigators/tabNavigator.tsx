import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { MaterialCommunityIcons as Icons } from "@expo/vector-icons" 

import {
  ChatScreen,
  SettingsScreen,
} from "../screens"
import { color } from "../theme"
import { TabNavigatorParamList } from "./types"

const Tab = createBottomTabNavigator<TabNavigatorParamList>()

function TabBarIcon(props: { name: React.ComponentProps<typeof Icons>["name"]; color: string }) {
  const iconStyle = { marginBottom: -15 }
  return <Icons size={35} style={iconStyle} {...props} />
}

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="chat"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: color.primary,
        tabBarInactiveTintColor: color.primary,
        tabBarInactiveBackgroundColor: color.bar,
        tabBarActiveBackgroundColor: color.bar,
        tabBarStyle: {
          backgroundColor: color.bar,
        }
      }}
    >
      <Tab.Screen
        name="chat"
        component={ChatScreen}
        options={{
          tabBarLabel: "",
          tabBarIcon: function tbIcon({ color, focused }) {
            return <TabBarIcon name={focused ? "chat" : "chat-outline"} color={color} />
          },
        }}
      />
      <Tab.Screen
        name="settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "",
          tabBarIcon: function tabBarIcon({ color, focused }) {
            return <TabBarIcon name={focused ? "cog" : "cog-outline"} color={color} />
          },
        }}
      />
    </Tab.Navigator>
  )
}