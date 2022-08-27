import { ethers } from "ethers";
import { useEffect } from "react";
import { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Screen, Text, AddNewChat, ChatCard, Button } from "../components";
import { TabScreenProps } from "../navigators/types";
import { abi } from "../abi";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import WalletConnectProvider from "@walletconnect/web3-provider";

// Add the contract address inside the quotes
const CONTRACT_ADDRESS = "0x0724EE0D1bFd45b511f0C8dbA0745866852e875C";
// Save the contents of abi in a variable
const contractABI = abi;

export const ChatScreen: FC<TabScreenProps<"chat">> = () => {
  const connector = useWalletConnect();
  const [friends, setFriends] = useState(null);
  const [myContract, setMyContract] = useState(null);

  useEffect(() => {
    async function load() {
      const provider = new WalletConnectProvider({
        rpc: {
          3: "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        },
        chainId: 3,
        connector: connector,
        qrcode: false,
      });
      await provider.enable();
      const ethersProvider = new ethers.providers.Web3Provider(provider);

      const signer = ethersProvider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI,
        signer
      );
      setMyContract(contract);

      // Obter Username e Criar um se não existir
      try {
        const address = await signer.getAddress();
        let present = await contract.checkUserExists(address);
        let username = "";
        if (present) username = await contract.getUsername(address);
        else {
          if (username === "") username = "GUEST_2";
          await contract.createAccount(username);
        }
      } catch (error) {
        console.log(error);
      }
    }
    load();
  }, []);

  async function loadFriends() {
    let friendList = [];
    // Get Friends
    try {
      const data = await myContract.getMyFriendList();
      data.forEach((item) => {
        friendList.push({ publicKey: item[0], name: item[1] });
      });
    } catch (err) {
      friendList = null;
    }
    setFriends(friendList);
  }

  // TODO: TESTE SMART CONTRACT
  const test = async () => {
    loadFriends();
  };

  // Add a friend to the users' Friends List
  async function addChat(name, publicKey) {
    try {
      let present = await myContract.checkUserExists(publicKey);
      if (!present) {
        alert("Address not found: Ask them to join the app :)");
        return;
      }
      try {
        await myContract.addFriend(publicKey, name);
        const frnd = { name: name, publicKey: publicKey };
        setFriends(friends.concat(frnd));
      } catch (err) {
        alert(
          "Friend already added! You can't be friends with the same person twice ;P"
        );
      }
    } catch (err) {
      console.log(err);
      alert("Invalid address!");
    }
  }

  // Fetch chat messages with a friend
  async function getMessage(friendsPublicKey) {
    let messages = [];
    // Get messages
    const data = await myContract.readMessage(friendsPublicKey);
    data.forEach((item) => {
      const timestamp = new Date(1000 * item[1].toNumber()).toUTCString();
      messages.push({
        publicKey: item[0],
        timeStamp: timestamp,
        data: item[2],
      });
    });
  }

  // Displays each card
  const chats = friends
    ? friends.map((friend) => {
        return (
          <ChatCard
            key={friend.publicKey}
            publicKey={friend.publicKey}
            name={friend.name}
            getMessages={(key) => getMessage(key)}
          />
        );
      })
    : null;

  return (
    <Screen preset="fixed" style={styles.container}>
      <Text>Chat Screen</Text>
      <Text>Connected: {connector.connected ? "YES" : "NO"}</Text>
      <Button text="LOAD FRIENDS" onPress={test} />
      <AddNewChat
        myContract={myContract}
        addHandler={(name, publicKey) => addChat(name, publicKey)}
      />
      <View
        style={{
          backgroundColor: "#DCDCDC",
          height: "100%",
        }}
      >
        {chats}
      </View>
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
