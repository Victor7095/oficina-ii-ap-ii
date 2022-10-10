import { useEffect } from "react";
import { FC, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import { TabScreenProps } from "../navigators/types";
import { useContract } from "../hooks/useContract";
import { abi, CONTRACT_ADDRESS } from "../contract";
import { Screen, Text, AddNewChat, ChatCard } from "../components";
import { color, spacing } from "../theme";

export const ChatScreen: FC<TabScreenProps<"chat_list">> = () => {
  const [sessions, setSessions] = useState([]);

  const [contract] = useContract(CONTRACT_ADDRESS, abi);

  useEffect(() => {
    if (contract) {
      loadSessions();
    }
  }, [contract]);

  async function loadSessions() {
    console.log("LOADING FRIENDS");
    let sessionList = [];
    // Get Friends
    try {
      const data = await contract.getSessions();
      sessionList = await Promise.all(
        data.map(async (item) => {
          let publicKey = item[0].toHexString();
          if (item.sessionType == 0) {
            const users = await contract.getSessionUsers(
              parseInt(item[0].toHexString(), 16)
            );
            publicKey = users[1][0];
          }
          return {
            sessionId: parseInt(item[0].toHexString(), 16),
            publicKey,
            name: item[1],
            sessionType: item[2],
          };
        })
      );
    } catch (err) {
      console.log(err);
      sessionList = null;
    }
    setSessions(sessionList);
    console.log("LOADED FRIENDS");
  }

  // Add a friend to the users' Friends List
  async function addChat(name, publicKeys, sessionType) {
    console.log("CREATE SESSION");
    console.log(name, publicKeys, sessionType);
    try {
      if (Number(sessionType) === 0) {
        name = await contract.getUsername(publicKeys[0]);
      }
      try {
        await contract.createSession(name, publicKeys, sessionType, {
          gasLimit: 1000000,
        });
        //const frnd = { name: name, publicKey: publicKeys };
        //setFriends(friends.concat(frnd));
      } catch (err) {
        console.log(err);
        alert(
          "Amigo já adicionado! Você não pode ser amigo de alguém duas vezes."
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
      sessionId={item.publicKey}
      publicKey={item.publicKey}
      name={item.name}
    />
  );

  return (
    <Screen preset="fixed" style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Conversas
        </Text>
      </View>
      <FlatList
        style={styles.chatListContainer}
        contentContainerStyle={{ flexGrow: 1 }}
        data={sessions}
        renderItem={renderItem}
        keyExtractor={(item) => item.publicKey}
        ListEmptyComponent={
          <View style={styles.emptyListContainer}>
            <Text style={styles.emptyListText}>Nenhuma conversa criada</Text>
          </View>
        }
      />
      <AddNewChat
        myContract={contract}
        addHandler={(name, publicKey, sessionType) =>
          addChat(name, publicKey, sessionType)
        }
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "space-around",
  },
  header: {
    justifyContent: "center",
    alignSelf: "stretch",
    alignItems: "center",
    backgroundColor: color.bar,
    paddingVertical: spacing[3],
  },
  title: {
    fontSize: 24,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyListText: {
    fontSize: 18,
  },
  chatListContainer: {
    flex: 1,
    marginHorizontal: spacing[4],
  },
});
