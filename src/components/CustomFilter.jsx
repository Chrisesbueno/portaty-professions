import {
  View,
  Text,
  Image,
  Pressable,
  Modal,
  TouchableOpacity,
} from "react-native";
import styles from "@/utils/styles/Tags.module.css";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { filterState } from "@/atoms";
import Slider from "@react-native-community/slider";

const CustomFilter = () => {
  const global = require("@/utils/styles/global.js");
  const [modalVisible, setModalVisible] = useState(false);
  const [filterValue, setFilterValue] = useRecoilState(filterState);
  const [filterRadio, setFilterRadio] = useState(1);

  useEffect(() => {}, []);

  return (
    <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
      <Text
        style={{
          fontSize: 14,
          fontFamily: "thinItalic",
          textAlign: "right",
          marginRight: 20,
          marginBottom: 10,
        }}
      >
        Filtrar busqueda
      </Text>
      <Modal animationType="none" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalTop}>
              <Pressable
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Image
                  style={{
                    width: 25,
                    height: 25,
                    resizeMode: "contain",
                  }}
                  source={require("@/utils/images/arrow_back.png")}
                />
              </Pressable>
              <Text style={styles.modalText}>{`Filtra tu busqueda`}</Text>
            </View>
            <View style={{ flex: 1 }}>
            <Text
                style={styles.modalText}
              >{`La distancia de tu radio son: ${filterRadio} km`}</Text>
              <Slider
                style={{ height: 100 }}
                minimumValue={0.01}
                maximumValue={100}
                onValueChange={(e) => setFilterRadio(e)}
                step={0.01}
                minimumTrackTintColor="#5E2129"
                maximumTrackTintColor="#1f1f1f"
                thumbTintColor="#5E2129"
                value={filterValue}
              />
              <Text
                style={styles.modalText}
              >{`La distancia esta reflejada en un radio de kilometros`}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={[
                  global.mainBgColor,
                  {
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                    height: 49,
                    marginTop: 80,
                  },
                ]}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setFilterValue(filterRadio)
                }}
              >
                <Text
                  style={[global.white, { fontFamily: "medium", fontSize: 14 }]}
                >
                  {`Buscar`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

export default CustomFilter;
