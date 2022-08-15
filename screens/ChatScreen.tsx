import { FC } from "react";
import { StyleSheet } from "react-native";
import { Screen, Text } from "../components";
import { TabScreenProps } from "../navigators/types";


export const ChatScreen: FC<TabScreenProps<"chat">> = () => {
  return (
    <Screen preset="fixed" style={styles.container}>
      <Text>Chat Screen</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});