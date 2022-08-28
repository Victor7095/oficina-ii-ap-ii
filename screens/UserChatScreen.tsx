import { useCallback, useEffect } from "react";
import { FC, useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { MaterialIcons as Icons } from "@expo/vector-icons";

import { RootStackScreenProps } from "../navigators/types";
import { useContract } from "../hooks/useContract";
import { abi, CONTRACT_ADDRESS } from "../contract";
import { Screen, Text } from "../components";
import { color, spacing } from "../theme";
import { GiftedChat } from "react-native-gifted-chat";
import { useNavigation } from "@react-navigation/native";

export const UserChatScreen: FC<RootStackScreenProps<"user_chat">> = ({
  route,
}) => {
  const { publicKey, name } = route.params;
  const [contract] = useContract(CONTRACT_ADDRESS, abi);

  const [identity, setIdentity] = useState("");
  const [messages, setMessages] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    if (contract) {
      getMessages(publicKey);
      contract.signer.getAddress().then((address) => {
        setIdentity(address);
      });
      const filterTo = contract.filters.NewMessage(publicKey, null, null);

      contract.on(filterTo, (from, timestamp, message) => {
        console.log("EVENT RECEIVED: NewMessage ");
        const createdAt = new Date(1000 * timestamp.toNumber()).toUTCString();
        const newMessage = {
          _id: messages.length,
          text: message,
          createdAt,
          user: {
            _id: from,
            name,
          },
        };
        // TODO:  APPEND
        setMessages((prevMessages) => [newMessage, ...prevMessages]);
      });
      return () => {
        contract.removeAllListeners(filterTo);
      };
    }
    return () => {};
  }, [contract]);

  const onSend = useCallback(
    async (newMessages = []) => {
      console.log("SENDING", newMessages);
      await contract.sendMessage(publicKey, newMessages[0].text);

      setMessages((previousMessages) => {
        return GiftedChat.append(previousMessages, newMessages);
      });
      console.log("SENT");
    },
    [contract]
  );

  // Fetch chat messages with a friend
  async function getMessages(friendsPublicKey) {
    console.log("LOADING MESSAGES");
    let messages = [];
    // Get messages
    const data = await contract.readMessage(friendsPublicKey);
    //const reversed = data.reverse();
    data
      .slice()
      .reverse()
      .forEach((item, index) => {
        console.log(item[2]);
        const timestamp = new Date(1000 * item[1].toNumber()).toUTCString();
        messages.push({
          _id: index,
          text: item[2],
          createdAt: timestamp,
          user: {
            _id: item[0],
            name,
          },
        });
      });
    setMessages(GiftedChat.append([], messages));
  }

  const goBack = () => {
    navigation.navigate("tabs");
  };

  const platformConf =
    Platform.OS === "ios"
      ? {
          minInputToolbarHeight: 40,
        }
      : {};

  return (
    <Screen preset="fixed" style={styles.container}>
      <View style={styles.chatHeader}>
        <TouchableOpacity style={styles.buttonBack} onPress={goBack}>
          <Icons size={24} name="arrow-back" color={color.primary} />
        </TouchableOpacity>
        <Text>{name}</Text>
      </View>
      <GiftedChat
        messagesContainerStyle={styles.messageContainer}
        messages={messages}
        renderAvatarOnTop
        onSend={(messages) => onSend(messages)}
        user={{ _id: identity }}
        {...platformConf}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: spacing[4],
  },
  buttonBack: {
    marginRight: spacing[4],
  },
  messageContainer: {
    backgroundColor: color.background,
  },
});
