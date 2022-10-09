import { useCallback, useEffect } from "react";
import { FC, useState } from "react";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { MaterialIcons as Icons } from "@expo/vector-icons";

import { RootStackScreenProps } from "../navigators/types";
import { useContract } from "../hooks/useContract";
import { abi, CONTRACT_ADDRESS } from "../contract";
import { Screen, Text } from "../components";
import { color, spacing, typography } from "../theme";
import { GiftedChat, InputToolbar, Send, Composer, Bubble, Day, Time} from "react-native-gifted-chat";
import { useNavigation } from "@react-navigation/native";

import ptbr from 'dayjs/locale/pt-br'

export const UserChatScreen: FC<RootStackScreenProps<"user_chat">> = ({
  route,
}) => {
  const { publicKey, name } = route.params;
  const [contract] = useContract(CONTRACT_ADDRESS, abi);

  const [identity, setIdentity] = useState("");
  const [messages, setMessages] = useState([]);

  const navigation = useNavigation();

  // Carregar contrato, mensagens anteriores e registrar evento
  useEffect(() => {
    if (contract) {
      getMessages(publicKey);
      contract.signer.getAddress().then((address) => {
        setIdentity(address);
      });

      // Registrar evento para receber mensagens
      const filterTo = contract.filters.NewMessage(publicKey, null, null);
      contract.removeAllListeners(filterTo);
      contract.on(filterTo, (from, timestamp, message) => {
        console.log("EVENT RECEIVED: NewMessage ");
        const createdAt = new Date(1000 * timestamp.toNumber()).toUTCString();
        setMessages((prevMessages) => [
          {
            _id: prevMessages.length,
            text: message,
            createdAt,
            user: {
              _id: from,
              name,
            },
          },
          ...prevMessages,
        ]);
      });
      return () => {
        console.log("REMOVE LISTENERS: NewMessage ");
        contract.removeAllListeners(filterTo);
      };
    }
    return () => {};
  }, [contract]);

  // Fetch chat messages with a friend
  async function getMessages(friendsPublicKey) {
    console.log("LOADING MESSAGES");
    let messages = [];
    // Get messages
    const data = await contract.readMessage(friendsPublicKey);
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

  const goBack = () => {
    navigation.navigate("tabs");
  };

  const platformConf =
    Platform.OS === "ios"
      ? {
          minInputToolbarHeight: 40,
        }
      : {};
  
  const customtInputToolbar = props => {
        return (
          <InputToolbar
            {...props}
            containerStyle={{
              backgroundColor: color.bar,
            }}
          />
        );
  };

  const customComposer = props => {
    return (
      <Composer
        {...props}
        placeholderTextColor={color.inputText}
        textInputStyle={{
          color: color.text,
          fontFamily: typography.primary,
          fontSize: 12
        }}
      />
    );
  };

  const customSend = props => {
    return (
      <Send
        {...props}
        containerStyle={{
          backgroundColor: color.bar,
          justifyContent: 'center',
        }}
        sendButtonProps={{
          style:{
            backgroundColor: color.button,
            color: color.textButton,
            alignSelf: 'stretch'
          },
        }}
        label=' ➡ '
        textStyle={{
          color: color.textButton,
          paddingTop: spacing[2],
        }}
      />
    );
  };

  const customBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left:{
            backgroundColor: color.leftBubble,
          },
          right:{
            backgroundColor: color.rightBubble,
          },
        }}
        textStyle={{
          left:{
            color: color.text,
            fontFamily: typography.primary,
            fontSize: 14
          },
          right:{
            color: color.text,
            fontFamily: typography.primary,
            fontSize: 14
          },
        }}
      />
    );
  };

  const customDay = props => {
    return (
      <Day
        {...props}
          textStyle={{
            color: color.inputText,
            fontFamily: typography.primary,
            fontSize: 12
          }}
          wrapperStyle={{
            paddingVertical: spacing[2],
          }}
      />
    );
  };

  const customTime = props => {
    return (
      <Time
        {...props}
          timeTextStyle={{
            left:{
              color: color.inputText,
              fontFamily: typography.primary,
              fontSize: 8
            },
            right:{
              color: color.inputText,
              fontFamily: typography.primary,
              fontSize: 8
            },
          }}
          timeFormat='hh:mm A'
      />
    );
  };
      

  return (
    <Screen preset="fixed" style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.buttonBack} onPress={goBack}>
          <Icons size={24} name="arrow-back" color={color.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>{name}</Text>
      </View>
      <GiftedChat
        messagesContainerStyle={styles.messageContainer}
        renderInputToolbar={props => customtInputToolbar(props)}
        renderComposer={props => customComposer(props)}
        renderSend={props => customSend(props)}
        renderBubble={props => customBubble(props)}
        renderDay={props => customDay(props)}
        renderTime={props => customTime(props)}
        renderAvatar={null}
        placeholder='Digite uma mensagem'
        alwaysShowSend={true}
        optionTintColor={color.background}
        messages={messages}
        multiline={false}
        locale={ptbr}
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
    alignItems: 'stretch',
    justifyContent: "center",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    alignContent: 'center',
    backgroundColor: color.bar,
    paddingVertical: spacing[2],
  },
  title: {
    marginRight: spacing[4],
    fontSize: 20,
  },
  buttonBack: {
    marginLeft: spacing[2],
    alignSelf: 'center',
  },
  messageContainer: {
    backgroundColor: color.background,
  },
});
