import { useEffect } from "react";
import { FC, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { TabScreenProps } from "../navigators/types";
import { useContract } from "../hooks/useContract";
import { abi, CONTRACT_ADDRESS } from "../contract";
import { Screen, Text, AddNewChat, ChatCard } from "../components";
import { color, spacing } from "../theme";


export const ChatScreen: FC<TabScreenProps<"chat_list">> = () => {
  const [friends, setFriends] = useState([]);

  const [contract] = useContract(CONTRACT_ADDRESS, abi);

  useEffect(() => {
    if (contract) {
      loadFriends();
    }
  }, [contract]);

  async function loadFriends() {
    console.log("LOADING FRIENDS");
    let friendList = [];
    // Get Friends
    try {
      const data = await contract.getMyFriendList();
      data.forEach((item) => {
        friendList.push({ publicKey: item[0], name: item[1] });
      });
    } catch (err) {
      console.log(err);
      friendList = null;
    }
    setFriends(friendList);
    console.log("LOADED FRIENDS");
  }

  // Add a friend to the users' Friends List
  async function addChat(name, publicKey) {
    try {
      let present = await contract.checkUserExists(publicKey);
      if (!present) {
        alert("Amigo não encontrado. Convide-o para conectar-se ao ChatU :)");
        return;
      }
      try {
        await contract.addFriend(publicKey, name);
        const frnd = { name: name, publicKey: publicKey };
        setFriends(friends.concat(frnd));
      } catch (err) {
        alert(
          "Amigo já adicionado! Você não pode ser amigo de alguém duas vezes ;P"
        );
      }
    } catch (err) {
      console.log(err);
      alert("Conta inválida!");
    }
  }

  const renderItem = ({ item }) => (
    <ChatCard
      key={item.publicKey}
      publicKey={item.publicKey}
      name={item.name}
    />
  );

  return (
    <Screen preset="fixed" style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title} preset='bold'>ChatU</Text>
      </View>
      <FlatList
        style={styles.chatListContainer}
        data={friends}
        renderItem={renderItem}
        keyExtractor={item => item.publicKey}
      />
      <AddNewChat
        myContract={contract}
        addHandler={(name, publicKey) => addChat(name, publicKey)}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: 'space-around',
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
  chatListContainer: {
    flex: 1,
    marginHorizontal: spacing[4],
  },
});
