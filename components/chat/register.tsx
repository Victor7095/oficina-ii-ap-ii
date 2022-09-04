import React from "react";
import { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { Text } from "../text/text";
import { Button } from "../button/button";
import { TextField } from "../text-field/text-field";

// This Modal help Add a new friend
export function Register({ show, handleClose, registerHanlder }) {
  const [name, setName] = useState("");

  return (
    <Modal
      visible={show}
      animationType="slide"
      transparent={true}
      onDismiss={handleClose}
    >
      <View style={styles.modalBackground}>
        <View style={[styles.centeredView]}>
          <View>
            <Text>Conectar-se ao app</Text>
          </View>
          <View>
            <View>
              <TextField
                label="Nome"
                value={name}
                onChangeText={(text) => setName(text)}
                placeholder="Escolha seu nome"
              />
            </View>
          </View>
          <View>
            <Button text="Close" onPress={handleClose} />
            <Button
              text="Register"
              onPress={() => {
                registerHanlder(name);
                handleClose();
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
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
