import "react-native-get-random-values";
import "@ethersproject/shims";
import "node-libs-react-native/globals.js";

import { useCallback, FC } from "react";

import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useWalletConnect } from "@walletconnect/react-native-dapp";

import { Button, Screen, Text } from "../components";
import { RootStackScreenProps } from "../navigators/types";

const HandleWalletConnect = () => {
  const connector = useWalletConnect();
  const navigation = useNavigation();

  const connectWallet = useCallback(() => {
    if (connector && !connector.connected) {
      return connector.connect().then((status) => {
        console.log(status);

        // TODO: Mínima ideia se isso é necessário
        connector.approveSession({
          accounts: connector.accounts,
          chainId: 3,
          rpcUrl: "https://ropsten.infura.io/v3",
        });

        navigation.navigate("tabs");
      });
    }
    return null;
  }, [connector?.connect]);

  return <Button text="Wallet connect" onPress={connectWallet} />;
};

export const HomeScreen: FC<RootStackScreenProps<"home">> = () => {
  const connector = useWalletConnect();
  

  return (
    <Screen preset="fixed" style={styles.container}>
      <HandleWalletConnect />
      <Text>Open up App.tsx to start working on your app!</Text>
      <Text>Connected: {connector.connected ? "YES" : "NO"}</Text>

      <StatusBar style="auto" />
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
