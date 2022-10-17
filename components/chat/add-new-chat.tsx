import React from "react";
import { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { Text } from "../text/text";
import { Button } from "../button/button";
import { TextField } from "../text-field/text-field";
import { color, spacing } from "../../theme";
import { MaterialCommunityIcons as Icons } from "@expo/vector-icons";
import RadioGroup, { RadioButtonProps } from "react-native-radio-buttons-group";

// This Modal help Add a new friend
export function AddNewChat(props) {
  const [name, setName] = useState("");
  const [publicKeys, setPublicKeys] = useState([]);
  const [publicKey, setPublicKey] = useState("");

  const [sessionType, setSessionType] = useState<RadioButtonProps[]>([
    {
      id: "1", // acts as primary key, should be unique and non-empty string
      label: "Grupo",
      value: "1",
      selected: true,
    },
    {
      id: "0",
      label: "Privado",
      value: "0",
    },
  ]);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDeleteAddress = (publicKey) => {
    setPublicKeys(publicKeys.filter((item) => item !== publicKey));
  };

  const handleAddAddress = () => {
    if (publicKey === "") {
      alert("Insira um endereço válido");
      return;
    }
    setPublicKeys(publicKeys.concat(publicKey));
    setPublicKey("");
  };

  function onPressRadioButton(radioButtonsArray: RadioButtonProps[]) {
    setSessionType(radioButtonsArray);
    setName("");
    setPublicKey("");
    setPublicKeys([]);
  }

  return (
    <View>
      <Button onPress={handleShow} style={styles.addChat}>
        <Icons size={35} name="plus" color={color.bar} />
        <Icons size={35} name="emoticon" color={color.bar} />
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
              <Text style={styles.modalTitle}> Nova conversa </Text>
            </View>
            <View>
              <View>
                <RadioGroup
                  radioButtons={sessionType}
                  onPress={onPressRadioButton}
                  containerStyle={styles.radioGroupContainer}
                />
                {sessionType.find((e) => e.selected)?.value === "1" && (
                  <>
                    <TextField
                      label="Nome"
                      value={name}
                      onChangeText={(text) => setName(text)}
                      placeholder="Digite o nome do grupo"
                    />
                    {publicKeys.map((key) => (
                      <View style={styles.newFriendContainer} key={key}>
                        <Text style={styles.newFriendKey}>{key}</Text>
                        <Button
                          text="–"
                          onPress={() => handleDeleteAddress(key)}
                          style={styles.newFriendButton}
                        />
                      </View>
                    ))}
                  </>
                )}
                <View style={sessionType.find((e) => e.selected)?.value === "1" && (styles.newFriendContainer)}>
                  <TextField
                    label="Chave pública"
                    value={publicKey}
                    onChangeText={(text) => setPublicKey(text)}
                    placeholder="Digite a chave pública do amigo"
                  />
                  {sessionType.find((e) => e.selected)?.value === "1" && (
                    <Button
                      text="+"
                      onPress={handleAddAddress}
                      style={styles.newFriendButton}
                    />
                  )}
                </View>
              </View>
            </View>
            <View>
              <Button
                text="Criar conversa"
                onPress={() => {
                  const keys = publicKeys;
                  if (sessionType.find((e) => e.selected)?.value === "0") {
                    keys.push(publicKey);
                  }
                  props.addHandler(
                    name,
                    keys,
                    sessionType.find((e) => e.selected)?.value
                  );
                  handleClose();
                }}
                style={styles.modalAddButton}
              />
              <Button
                text="Fechar"
                onPress={handleClose}
                style={styles.modalCloseButton}
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
    backgroundColor: color.background,
  },
  addChat: {
    alignSelf: "flex-end",
    fontSize: 20,
    borderRadius: 20,
    marginVertical: spacing[4],
    marginHorizontal: spacing[4],
    flexDirection: "row",
    paddingHorizontal: spacing[1],
  },
  addChatText: {
    fontSize: 20,
  },
  modalTitle: {
    fontSize: 18,
    alignSelf: "center",
    marginBottom: spacing[2],
  },
  radioGroupContainer: {
    flexDirection: "row",
    fontSize: 12,
  },
  newFriendContainer: {
    flexDirection: "row",
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    marginLeft: spacing[1],
    marginRight: spacing[7],
  },
  newFriendKey: {
    fontSize: 10,
    marginLeft: spacing[1],
  },
  newFriendButton: {
    paddingVertical: spacing[0],
    borderRadius: 20,
    alignSelf: 'flex-end',
    marginLeft: spacing[2],
  },
  modalInput: {
    color: color.text,
    fontSize: 14,
  },
  modalAddButton: {
    marginTop: spacing[5],
    marginBottom: spacing[3],
    alignSelf: "stretch",
    marginHorizontal: spacing[7],
  },
  modalCloseButton: {
    alignSelf: "stretch",
    marginHorizontal: spacing[7],
  },
});
