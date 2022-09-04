import "react-native-get-random-values";
import "@ethersproject/shims";
import "node-libs-react-native/globals.js";

import { useCallback, FC, useState, useEffect } from "react";

import { StyleSheet, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useWalletConnect } from "@walletconnect/react-native-dapp";

import { Button, Screen, Text } from "../components";
import { RootStackScreenProps } from "../navigators/types";
import { useContract } from "../hooks/useContract";
import { abi, CONTRACT_ADDRESS } from "../contract";
import { Register } from "../components/chat/register";
import { color, spacing } from "../theme";


const HandleWalletConnect = () => {
  const connector = useWalletConnect();

  const connectWallet = useCallback(() => {
    console.log("CONNECTING");
    if (connector && !connector.connected) {
      return connector
        .connect()
        .then((status) => {
          console.log("CONNECTED", status);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    return null;
  }, [connector?.connect]);

  return <Button text="Conectar carteira" onPress={connectWallet} />;
};

export const HomeScreen: FC<RootStackScreenProps<"home">> = ({
  navigation,
}) => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const connector = useWalletConnect();

  const [contract, signer] = useContract(CONTRACT_ADDRESS, abi);

  useEffect(() => {
    console.log("DISCONNECTING");
    connector && connector.connected && connector.killSession();
  }, []);

  useEffect(() => {
    async function checkUserExists() {
      if (signer && (await signer.getAddress())) {
        // Obter Username e Criar um se não existir
        try {
          const address = await signer.getAddress();
          let present = await contract.checkUserExists(address);

          if (!present) {
            setShowRegisterModal(true);
          } else {
            navigation.navigate("tabs");
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("NO SIGNER");
      }
    }
    checkUserExists();
  }, [signer]);

  const registerUser = async (username: string) => {
    // Obter Username e Criar um se não existir
    try {
      await contract.createAccount(username);
      navigation.navigate("tabs");
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseRegisterModal = () => {
    setShowRegisterModal(false);
  };

  return (
    <Screen preset="fixed" style={styles.container}>
        <Image source={require('../assets/bg-image.png')}/>
        <Text style={styles.infoText1} preset="bold">Siga os passos:</Text>
        <Text style={styles.infoText2}>1. Instale o Metamask em seu dispositivo
        {'\n'}2. Crie ou abra sua conta/carteira e obtenha alguns ethers
        {'\n'}3. Clique a seguir para efetuar a transação e conectar sua conta ao app</Text>


      <HandleWalletConnect />
      <Text style={styles.connectText} preset="bold">Conectado: {connector.connected ? "SIM" : "NÃO"}</Text>

      <Register
        show={showRegisterModal}
        registerHanlder={(name) => registerUser(name)}
        handleClose={handleCloseRegisterModal}
      />

      <StatusBar style="auto" />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bar,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText1: {
    marginTop: spacing[6],
    marginBottom: spacing[1],
    fontSize: 14,
    textAlign: 'center',
    justifyContent: 'center',
  },
  infoText2: {
    marginBottom: spacing[6],
    fontSize: 12,
    textAlign: 'center',
    justifyContent: 'center',
  },
  connectText: {
    marginTop: spacing[2],
    fontSize: 14,
    textAlign: 'center',
    justifyContent: 'center',
  },
});
