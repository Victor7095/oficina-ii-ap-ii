import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { spacing } from "../../theme";
import Blockies from "../blockies/blockies";
import { Text } from "../text/text";


// This is a function which renders the friends in the friends list
export function ChatCard(props) {

  const navigation = useNavigation();

  const handlePress = () => {
    console.log('ENTER USER CHAT')
    navigation.navigate("user_chat", {
      publicKey: props.publicKey,
      name: props.name,
    });
  };

  return (
    <View>
      <TouchableOpacity style={styles.container} onPress={handlePress}>
        <Blockies
          blockies={props.publicKey} //string content to generate icon
          width={64} // blocky width
          height={64} // blocky height
          containerStyle={styles.blockieContainer} // style of the view will wrap the icon
          style={styles.blockie} // style of icon
        />
        <View style={styles.chatDetails}>
          <Text style={styles.name} preset='bold'>{props.name}</Text>
          <Text style={styles.publicKey}>{props.publicKey}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 64 + 2 * spacing[4],
    paddingVertical: spacing[4],
    justifyContent: "flex-start",
    alignItems: "center",
    marginVertical: spacing[2],
  },
  blockieContainer: {
    width: 64,
  },
  blockie: {
    backgroundColor: "transparent",
    width: 64,
    alignSelf: "center",
  },
  chatDetails: {
    flex: 1,
    marginLeft: spacing[2],
  },
  name: {
    fontSize: 16,
    marginBottom: spacing[2],
  },
  publicKey: {
    fontSize: 10,
  },
});
