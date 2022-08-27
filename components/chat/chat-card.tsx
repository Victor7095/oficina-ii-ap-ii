import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { spacing } from "../../theme";
import Blockies from "../blockies/blockies";
import { Text } from "../text/text";

// This is a function which renders the friends in the friends list
export function ChatCard(props) {
  return (
    <View>
      <TouchableOpacity
        style={styles.container}
        onPress={() => {
          props.getMessages(props.publicKey);
        }}
      >
        <Blockies
          blockies={props.publicKey} //string content to generate icon
          width={64} // blocky width
          height={64} // blocky height
          containerStyle={styles.blockieContainer} // style of the view will wrap the icon
          style={styles.blockie} // style of icon
        />
        <View style={styles.chatDetails}>
          <Text style={styles.name}>{props.name}</Text>
          <Text style={styles.publicKey}>
            {props.publicKey}
          </Text>
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
  },
  blockieContainer: {
    width: 64,
  },
  blockie: {
    backgroundColor: "transparent",
    width: 64,
  },
  chatDetails: {
    flex: 1,
    marginLeft: spacing[2],
  },
  name: {
    fontSize: 18,
    marginBottom: spacing[2],
  },
  publicKey: {
    fontSize: 12,
  }
});
