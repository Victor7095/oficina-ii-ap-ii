import { FC } from "react";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { StyleSheet, View, Image} from "react-native";
import { Button, Screen, Text } from "../components";
import { TabScreenProps } from "../navigators/types";
import { color, spacing } from "../theme";


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
      <View style={styles.header}>
        <Text style={styles.title} preset='bold'>Configurações</Text>
      </View>
      <View style={styles.center}>
        <Image source={require('../assets/bg-image.png')}/>
        <Text style={styles.infoText}>Já está de saída? :(</Text>
        <Text>Clique a seguir para desconectar.</Text>
        {connector && connector.accounts && <Text></Text>}
        <Button text="Desconectar" onPress={handleDisconnect} />
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
    marginTop: spacing[6],
    textAlign: 'center',
    justifyContent: 'center'
  },
});

export default SettingsScreen;
