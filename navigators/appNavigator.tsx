import React from "react";
import { useColorScheme, View } from "react-native";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import { HomeScreen, UserChatScreen } from "../screens";
import { navigationRef } from "./navigationUtilities";
import { TabNavigator } from "./tabNavigator";
import { color } from "../theme";
import { RootStackParamList } from "./types";

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<RootStackParamList>();

const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="home"
    >
      <Stack.Screen name="home" component={HomeScreen} />
      <Stack.Screen name="tabs" component={TabNavigator} />
      <Stack.Screen name="user_chat" component={UserChatScreen} />
    </Stack.Navigator>
  );
};

interface Props
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = (props: Props) => {
  const colorScheme = useColorScheme();

  const style = {
    flex: 1,
    backgroundColor: color.button,
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <View style={style}>
        <AppStack />
      </View>
    </NavigationContainer>
  );
};

AppNavigator.displayName = "AppNavigator";

const exitRoutes = ["home"];
export const canExit = (routeName: string) => exitRoutes.includes(routeName);
