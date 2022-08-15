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
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HomeScreen } from "../screens";
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
    </Stack.Navigator>
  );
};

interface Props
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = (props: Props) => {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  const style = {
    flex: 1,
    paddingTop: insets.top,
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
