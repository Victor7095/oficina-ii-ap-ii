import React from "react";
import { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { Text } from "../text/text";
import { Button } from "../button/button";
import { TextField } from "../text-field/text-field";
import { spacing } from "../../theme";

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
            <Text style={styles.modalTitle}>Conectar-se ao app</Text>
          </View>
          <View>
            <View>
              <TextField
                label="Seu nome"
                value={name}
                onChangeText={(text) => setName(text)}
                placeholder="Escolha seu nome"
              />
            </View>
          </View>
          <View>
            <Button
              text="Registrar-se"
              onPress={() => {
                registerHanlder(name);
                handleClose();
              }}
              style={styles.modalButton}
            />
            <Button text="Fechar" onPress={handleClose} style={styles.modalButton}/>
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
  modalTitle: {
    fontSize: 18,
    alignSelf: 'center',
    marginBottom: spacing[4],
  },
  modalButton: {
    marginTop: spacing[3],
    alignSelf: 'stretch',
    marginHorizontal: spacing[7]
  },
});
