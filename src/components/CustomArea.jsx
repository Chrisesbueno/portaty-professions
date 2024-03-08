import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  Modal,
  FlatList,
  TouchableOpacity,
} from "react-native";
import styles from "@/utils/styles/Area.module.css";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { es } from "@/utils/constants/lenguage";
import { useRecoilValue } from "recoil";
import { areaSelect } from "@/atoms";
import Area from "./Area";
import { FlashList } from "@shopify/flash-list";

const CustomArea = ({ data }) => {
  const global = require("@/utils/styles/global.js");
  const [modalVisible, setModalVisible] = useState(false);
  const { control } = useForm();
  const area = useRecoilValue(areaSelect);
  console.log(area);
  useEffect(() => {}, []);

  return (
    <ScrollView
      style={[global.bgWhite, { flex: 1 }]}
      showsVerticalScrollIndicator={false}
    >
      <View>
        <TouchableOpacity
          style={[
            {
              width: 100,
              padding: 15,
              borderRadius: 7,
              borderColor: '#1f1f1f',
              borderWidth: 1,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'flex-end',
              marginTop: 10
            },
            global.bgYellow,
          ]}
          onPress={() => setModalVisible(!modalVisible)}
        >
          <Text
            style={{
              fontFamily: "bold",
              fontSize: 16,
            }}
          >
            Buscar
          </Text>

          <Modal
            animationType="none"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
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
                        width: 35,
                        height: 35,
                        resizeMode: "contain",
                      }}
                      source={require("@/utils/images/arrow_back.png")}
                    />
                  </Pressable>
                  <Text style={styles.titleTag}>Elige un area laboral</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={[{ flex: 1 }]}>
                    <FlashList
                      data={data}
                      renderItem={({ item }) => <Area item={item} />}
                      numColumns={1}
                      keyExtractor={(item, index) => index}
                      estimatedItemSize={50}
                      // showsVerticalScrollIndicator={false}
                      // columnWrapperStyle={{ justifyContent: "space-between" }}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => setModalVisible(!modalVisible)}
                    style={[
                      {
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 15,
                        borderRadius: 8,
                        borderColor: "#1f1f1f",
                        borderWidth: 1,
                        marginTop: 15,
                      },
                      global.bgYellow,
                    ]}
                  >
                    <Text
                      style={{
                        fontFamily: "bold",
                        color: "#1f1f1f",
                        textAlign: "center",
                      }}
                    >
                      Aceptar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CustomArea;
