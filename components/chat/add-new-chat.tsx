import React from "react";
import { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { Text } from "../text/text";
import { Button } from "../button/button";
import { TextField } from "../text-field/text-field";
import { color, spacing } from "../../theme";

// This Modal help Add a new friend
export function AddNewChat(props) {
  const [name, setName] = useState("");
  const [publicKey, setPublicKey] = useState("");

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <View>
      <Button onPress={handleShow}
              text="➕ 😊"
              style={styles.addChat}
              textStyle={styles.addChatText}>
      </Button>
      <Modal
        visible={show}
        animationType="slide"
        transparent={true}
        onDismiss={handleClose}
      >
        <View style={styles.modalBackground}>
          <View style={[styles.centeredView]}>
            <View>
              <Text style={styles.modalTitle}> Adicionar amigo </Text>
            </View>
            <View>
              <View>
                <TextField
                  label="Nome"
                  value={name}
                  onChangeText={(text) => setName(text)}
                  placeholder="Digite o nome do amigo"
                />
                <TextField
                  label="Chave pública"
                  value={publicKey}
                  onChangeText={(text) => setPublicKey(text)}
                  placeholder="Digite a chave pública do amigo"
                />
              </View>
            </View>
            <View>
              <Button
                text="Adicionar amigo"
                onPress={() => {
                  props.addHandler(name, publicKey);
                  handleClose();
                }}
                style={styles.modalAddButton}
              />
              <Button text="Fechar" onPress={handleClose} style={styles.modalCloseButton} />
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
    backgroundColor: color.background,
  },
  addChat: {
    alignSelf: "flex-end",
    fontSize: 20,
    borderRadius: 20,
    marginVertical: spacing[4],
    marginHorizontal: spacing[4],
  },
  addChatText: {
    fontSize: 20,
  },
  modalTitle: {
    fontSize: 18,
    alignSelf: 'center',
  },
  modalInput: {
    color: color.text,
    fontSize: 14,
  },
  modalAddButton: {
    marginTop: spacing[6],
    marginBottom: spacing[3],
    alignSelf: 'stretch',
    marginHorizontal: spacing[7]
  },
  modalCloseButton: {
    alignSelf: 'stretch',
    marginHorizontal: spacing[7],
  },
});
