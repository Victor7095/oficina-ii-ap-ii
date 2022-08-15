import { FC } from "react";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { StyleSheet } from "react-native";
import { Button, Screen, Text } from "../components";
import { TabScreenProps } from "../navigators/types";

export const SettingsScreen: FC<TabScreenProps<"settings">> = ({
  navigation,
}) => {
  const connector = useWalletConnect();

  const handleDisconnect = () => {
    console.log("DISCONNECT");
    connector.killSession();
    navigation.navigate("home");
  };

  return (
    <Screen preset="fixed" style={styles.container}>
      <Text>Settings Screen</Text>
      <Text>{connector.accounts[0]}</Text>
      <Button text="Disconnect" onPress={handleDisconnect} />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SettingsScreen;
