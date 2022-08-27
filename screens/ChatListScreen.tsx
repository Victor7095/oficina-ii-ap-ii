import { useEffect } from "react";
import { FC, useState } from "react";
import { StyleSheet, View } from "react-native";

import { TabScreenProps } from "../navigators/types";
import { useContract } from "../hooks/useContract";
import { abi, CONTRACT_ADDRESS } from "../contract";
import { Screen, Text, AddNewChat, ChatCard } from "../components";
import { spacing } from "../theme";

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
        alert("Address not found: Ask them to join the app :)");
        return;
      }
      try {
        await contract.addFriend(publicKey, name);
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

  // Displays each card
  const chats = friends
    ? friends.map((friend) => {
        return (
          <ChatCard
            key={friend.publicKey}
            publicKey={friend.publicKey}
            name={friend.name}
          />
        );
      })
    : null;

  return (
    <Screen preset="fixed" style={styles.container}>
      <View>
        <Text>Chat Screen</Text>
      </View>
      <AddNewChat
        myContract={contract}
        addHandler={(name, publicKey) => addChat(name, publicKey)}
      />
      <View style={styles.chatListContainer}>{chats}</View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
    paddingHorizontal: spacing[4],
  },
  chatListContainer: {
    flex: 1,
  },
});
