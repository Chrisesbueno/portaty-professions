import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Modal,
  ActivityIndicator,
} from "react-native";
import styles from "@/utils/styles/StepThree.module.css";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import LottieView from "lottie-react-native";
import { Feather } from "@expo/vector-icons";
import MapMarketBusiness from "@/components/MapMarketBusiness";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  activeModalScreen,
  directionBusiness,
  emptyLocation,
  mapBusiness,
  selectLocation,
  mapUser
} from "@/atoms";
import StepClear from "./StepClear";

const StepThree = ({ navigation, route }) => {
  const global = require("@/utils/styles/global.js");
  const { control, handleSubmit } = useForm();
  const animation = useRef(null);
  const userLocation = useRecoilValue(mapUser)
  const { business } = route.params;
  const map = useRecoilValue(mapBusiness);
  const [selectionLocation, setSelectionLocation] =
    useRecoilState(selectLocation);
  const empty = useRecoilValue(emptyLocation);
  const direction = useRecoilValue(directionBusiness);
  const [active, setActive] = useRecoilState(activeModalScreen);

  console.log(empty);

  useEffect(() => {}, []);
  return (
    <View style={[global.bgWhite, styles.container]}>
      <Modal animationType="none" transparent={active} visible={active}>
        <View style={[styles.modalMain]}>
          <ScrollView style={{ flex: 1 }}>
            <View style={[styles.modalContent]}>
              <View style={[styles.modalTop]}>
                <StepClear
                  styled={styles.modalContent}
                  navig={() => navigation.navigate("Unprofile")}
                />

                {/* <Pressable
                  onPress={() => {
                    navigation.navigate("Unprofile");
                  }}
                >
                  <Image
                    style={{
                      width: 55,
                      height: 55,
                      resizeMode: "contain",
                    }}
                    source={require("@/utils/images/arrow_back.png")}
                  />
                </Pressable> */}
                <View style={{ marginBottom: 20, marginTop: -15 }}>
                  <View>
                    {/* <Text
                      style={{
                        fontFamily: "medium",
                        fontSize: 30,
                        marginTop: 30,
                      }}
                    >
                      Ahora lo mas importante
                    </Text> */}
                    <Text
                      style={{
                        fontFamily: "medium",
                        fontSize: 30,
                        marginBottom: 5,
                        marginTop: 30,
                      }}
                    >
                      Por favor, indicanos ¿donde se ubica tu negocio?
                    </Text>
                    <LottieView
                      autoPlay
                      ref={animation}
                      style={{
                        width: 175,
                        height: 175,
                        backgroundColor: "#fff",
                        justifyContent: "center",
                        alignSelf: "center",
                        marginTop: 10,
                      }}
                      source={require("@/utils/animations/map.json")}
                    />
                  </View>
                </View>
              </View>
              <View style={[styles.modalMid]}>
                {userLocation ? (
                  <MapMarketBusiness
                    control={control}
                    initialLocation={userLocation}
                    name={"coordinates"}
                    text={"Abrir Mapa"}
                    title={business?.name}
                    placeholder={"Selecciona tu ubicacion"}
                    // rules={{
                    //   required: es.businessForm.register.email.rules,
                    // }}
                  />
                ) : (
                  <ActivityIndicator color={`#ffb703`} />
                )}
              </View>
              <View style={[styles.modalBott]}>
                <Pressable
                  style={[
                    {
                      borderWidth: 1,
                      width: 120,
                      height: 60,
                      borderRadius: 8,
                      alignSelf: "flex-end",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "space-around",
                      paddingHorizontal: 10,
                    },
                  ]}
                  onPress={() =>
                    navigation.push("StepTwo", { business: business })
                  }
                >
                  <Feather name="arrow-left-circle" size={30} color="black" />
                  <Text
                    style={[
                      { fontFamily: "bold", fontSize: 18, color: "#1f1f1f" },
                    ]}
                  >
                    Atras
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    global.bgYellow,
                    {
                      borderWidth: 1,
                      width: 120,
                      height: 60,
                      borderRadius: 8,
                      alignSelf: "flex-end",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "space-around",
                      paddingHorizontal: 10,
                    },
                  ]}
                  onPress={() => {
                    if (selectionLocation) return;
                    if (empty) {
                      setSelectionLocation(true);
                    }
                    navigation.push("StepFour", {
                      business: business,
                    });
                  }}
                >
                  <Text
                    style={[
                      { fontFamily: "bold", fontSize: 18, color: "#1f1f1f" },
                    ]}
                  >
                    3 / 5
                  </Text>
                  <Feather
                    name="arrow-right-circle"
                    size={30}
                    color="#1f1f1f"
                  />
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default StepThree;
