import { FC, useState, useEffect } from "react";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { useContract } from "../hooks/useContract";
import { abi, CONTRACT_ADDRESS } from "../contract";
import { StyleSheet, View } from "react-native";
import { Button, Screen, Text } from "../components";
import { TabScreenProps } from "../navigators/types";
import { color, spacing } from "../theme";
import Blockies from "../components/blockies/blockies";


export const SettingsScreen: FC<TabScreenProps<"settings">> = ({
  navigation,
}) => {
  const connector = useWalletConnect();
  const [contract] = useContract(CONTRACT_ADDRESS, abi);
  const [name, setName] = useState();

  const handleDisconnect = () => {
    console.log("DISCONNECT");
    connector.killSession();
    navigation.navigate("home");
  };

  useEffect(() => {
    if (contract) {
      loadNameAddress();
    }
  }, [contract]);

  async function loadNameAddress() {
    console.log("LOADING NAME");
    let name;
    try {
      name = await contract.getUsername(connector.accounts[0]);
    } catch (err) {
      console.log(err);
      name = null;
    }
    setName(name);
    console.log("LOADED NAME");
  }

  return (
    <Screen preset="fixed" style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
      </View>
      <View style={styles.center}>
      {connector && connector.accounts && <Text style={styles.infoText}>
        {name}{'\n'}
        {'\n'}{connector.accounts[0]}</Text>}
        <Blockies
          blockies={connector.accounts[0]} //string content to generate icon
          width={200} // blocky width
          height={200} // blocky height
          containerStyle={styles.blockieContainer} // style of the view will wrap the icon
          style={styles.blockie} // style of icon
        />
        <Button style={styles.button} text="Desconectar" onPress={handleDisconnect} />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'space-around',
    alignContent: 'space-around',
  },
  header: {
    justifyContent: "center",
    alignSelf: 'stretch',
    alignItems: 'center',
    backgroundColor: color.bar,
    paddingVertical: spacing[3],
  },
  title: {
    fontSize: 24,
  },
  center: {
    flex: 1,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    marginTop: spacing[2],
    marginBottom: spacing[5],
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 20,
  },
  button: {
    marginTop: spacing[5],
    paddingHorizontal: spacing[7],
  },
  blockieContainer: {
    flex: 1,
  },
  blockie: {
    backgroundColor: "transparent",
    width: 200,
    alignSelf: "center",
  },
});

export default SettingsScreen;
