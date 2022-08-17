import React from "react";
import { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { Text } from "../text/text";
import { Button } from "../button/button";
import { TextField } from "../text-field/text-field";

// This Modal help Add a new friend
export function AddNewChat(props) {
  const [name, setName] = useState("");
  const [publicKey, setPublicKey] = useState("");

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <View>
      <Button onPress={handleShow} text="+ NewChat"></Button>
      <Modal
        visible={show}
        animationType="slide"
        transparent={true}
        onDismiss={handleClose}
      >
        <View style={styles.modalBackground}>
          <View style={[styles.centeredView]}>
            <View>
              <Text> Add New Friend </Text>
            </View>
            <View>
              <View>
                <TextField
                  label="Name"
                  value={name}
                  onChangeText={(text) => setName(text)}
                  placeholder="Name"
                />
                <TextField
                  label="Public Key"
                  value={publicKey}
                  onChangeText={(text) => setPublicKey(text)}
                  placeholder="Enter Friends Public Key"
                />
              </View>
            </View>
            <View>
              <Button text="Close" onPress={handleClose} />
              <Button
                text="Add Friend"
                onPress={() => {
                  props.addHandler(name, publicKey);
                  handleClose();
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  centeredView: {
    flex: 1,
    marginTop: 100,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "white",
  },
});
