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
import styles from "@/utils/styles/Activity.module.css";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { es } from "@/utils/constants/lenguage";
import { useRecoilValue } from "recoil";
import { activitySelect, tagsList } from "@/atoms";
import Activity from "./Activity";

const CustomActivities = ({ data }) => {
  const global = require("@/utils/styles/global.js");
  const [modalVisible, setModalVisible] = useState(false);
  const { control } = useForm();
  const activity = useRecoilValue(activitySelect);
  useEffect(() => {}, []);

  return (
    <ScrollView
      style={[global.bgWhite, { flex: 1 }]}
      showsVerticalScrollIndicator={false}
    >
      <View>
        <Text style={styles.labelInputTag}>Actividad (*)</Text>
        <TouchableOpacity
          style={[styles.inputContainerTag]}
          onPress={() => setModalVisible(!modalVisible)}
        >
          <View style={{ flex: 1, flexDirection: "row" }}>
            {activity.name ? (
              <View style={styles.containerTag}>
                <Text style={styles.textTag}>{activity.name}</Text>
              </View>
            ) : (
              <Text style={styles.textInputTag}>
                Selecciona tu actividad laboral
              </Text>
            )}
          </View>

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
                  <Text style={styles.titleTag}>
                    Elige una actividad laboral
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  

                  <View style={[{ flex: 1 }]}>
                    <FlatList
                      data={data}
                      renderItem={({ item }) => <Activity item={item} />}
                      numColumns={3}
                      keyExtractor={(item, index) => index}
                      showsVerticalScrollIndicator={false}
                      columnWrapperStyle={{ justifyContent: "space-between" }}
                    />
                  </View>
                    <TouchableOpacity
                      onPress={() => setModalVisible(!modalVisible)}
                      style={[{alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 8, borderColor: '#1f1f1f', borderWidth: 1}, global.bgYellow]}
                    >
                      <Text style={{fontFamily: 'bold', color: '#1f1f1f', textAlign: 'center'}}>Aceptar</Text>
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

export default CustomActivities;
