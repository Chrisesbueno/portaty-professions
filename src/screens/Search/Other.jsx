import React, { useCallback } from "react";
import { StyleSheet, Text, Pressable, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
const Other = ({ route, navigation }) => {
  const { params } = route;
  useFocusEffect(useCallback(() => {}, []));

  if (params?.id === undefined) {
    return (
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>ID no encontrado</Text>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Text style={styles.textStyle}>Volver a incio</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View>
      <Text>ID: {params?.id} </Text>
    </View>
  );
};

export default Other;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
