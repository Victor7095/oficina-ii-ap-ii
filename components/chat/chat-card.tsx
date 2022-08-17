import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "../text/text";

// This is a function which renders the friends in the friends list
export function ChatCard(props) {
  return (
    <View>
      <TouchableOpacity
        style={{ width: "100%", alignSelf: "center" }}
        onPress={() => {
          props.getMessages(props.publicKey);
        }}
      >
        <View>
          <Text> {props.name} </Text>
          <Text>
            {props.publicKey.length > 20
              ? props.publicKey.substring(0, 20) + " ..."
              : props.publicKey}{" "}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
