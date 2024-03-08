import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Modal,
  ActivityIndicator,
} from "react-native";
import styles from "@/utils/styles/StepComplete.module.css";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import LottieView from "lottie-react-native";
import { activeModalScreen } from "@/atoms";
import { useRecoilState } from "recoil";

const StepComplete = ({ navigation, route }) => {
  const global = require("@/utils/styles/global.js");
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useRecoilState(activeModalScreen);
  
  const animation = useRef(null);
  let dataB = route.params;
  console.log(dataB);
  useEffect(() => {}, []);
  return (
    <View style={[global.bgWhite, styles.container]}>
      <Modal animationType="none" transparent={active} visible={active}>
        <View style={[styles.modalMain]}>
          <ScrollView style={{ flex: 1 }}>
            <View style={[styles.modalContent]}>
              <View style={[styles.modalTop]}>
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
                    <Text
                      style={{
                        fontFamily: "regular",
                        fontSize: 26,
                        marginTop: 80,
                        marginBottom: 50,
                        textAlign: "center",
                      }}
                    >
                      ¡Tu negocio se registro exitosamente!
                    </Text>
                    <Image
                      style={{
                        width: 200,
                        height: 200,
                        borderRadius: 100,
                        alignSelf: 'center'
                      }}
                      source={{ uri: dataB.business.image }}
                    />
                    
                  </View>
                </View>
              </View>
              <View style={[styles.modalMid]}>
                <Text
                  style={{
                    fontFamily: "regular",
                    fontSize: 26,
                    marginBottom: 5,
                    marginTop: 50,
                    textAlign: "center",
                  }}
                >
                  Bienvenido {dataB.business.name}, a Portaty
                </Text>
                {/* <LottieView
                      autoPlay
                      ref={animation}
                      style={{
                        width: 65,
                        height: 65,
                        backgroundColor: "#fff",
                        justifyContent: "center",
                        alignSelf: "center",
                        marginTop: 10,
                      }}
                      source={require("@/utils/animations/check.json")}
                    /> */}
              </View>
              <View style={[styles.modalBott]}>
                <Pressable
                  style={[
                    global.bgYellow,
                    {
                      flex: 1,
                      borderWidth: 1,
                      width: 300,
                      height: 60,
                      borderRadius: 8,
                      alignSelf: "center",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "space-around",
                      paddingHorizontal: 10,
                    },
                  ]}
                  onPress={() => {
                    navigation.replace("StepLoading")
                    setActive(false)
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={[
                        {
                          fontFamily: "bold",
                          fontSize: 18,
                          color: "#1f1f1f",
                        },
                      ]}
                    >
                      Ir a tu perfil
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default StepComplete;
