import { FC, useState, useEffect } from "react";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { useContract } from "../hooks/useContract";
import { abi, CONTRACT_ADDRESS } from "../contract";
import { StyleSheet, View, Image} from "react-native";
import { Button, Screen, Text } from "../components";
import { TabScreenProps } from "../navigators/types";
import { color, spacing } from "../theme";


export const SettingsScreen: FC<TabScreenProps<"settings">> = ({
  navigation,
}) => {
  const connector = useWalletConnect();
  const [contract, signer] = useContract(CONTRACT_ADDRESS, abi);
  const [name, setName] = useState();

  const handleDisconnect = () => {
    console.log("DISCONNECT");
    connector.killSession();
    navigation.navigate("home");
  };

  useEffect(() => {
    if (contract) {
      loadName();
    }
  }, [contract]);

  async function loadName() {
    console.log("LOADING NAME");
    let name;
    try {
      const address = await signer.getAddress();
      name = await contract.getUsername(address);
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
        <Text style={styles.title} preset='bold'>Configurações</Text>
      </View>
      <View style={styles.center}>
      {connector && connector.accounts && <Text style={styles.infoText}>
        Seu nome: {name}{'\n'}
        {'\n'}Sua chave pública:
        {'\n'}{connector.accounts}</Text>}
        <Image source={require('../assets/bg-image.png')}/>
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
    marginTop: spacing[3],
    marginBottom: spacing[5],
    textAlign: 'center',
    justifyContent: 'center'
  },
  button: {
    marginTop: spacing[5],
    paddingHorizontal: spacing[7],
  },
});

export default SettingsScreen;
