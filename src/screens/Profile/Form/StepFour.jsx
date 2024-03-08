import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Modal,
  TouchableOpacity,
} from "react-native";
import styles from "@/utils/styles/StepFour.module.css";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRecoilState } from "recoil";
import { activeModalScreen, base64Business, blobBusiness, imageBusiness } from "@/atoms";
import StepClear from "./StepClear";

const StepFour = ({ navigation, route }) => {
  const global = require("@/utils/styles/global.js");
  const [image, setImage] = useRecoilState(imageBusiness);
  const [blobImage, setBlobImage] = useRecoilState(blobBusiness);
  const [imageB64, setImageB64] = useRecoilState(base64Business);
  const [active, setActive] = useRecoilState(activeModalScreen);
  const [error, setError] = useState(false)
  const { business } = route.params;
  // console.log(map);

  function urlToBlob(url) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onerror = reject;
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          resolve(xhr.response);
        }
      };
      xhr.open("GET", url);
      xhr.responseType = "blob"; // convert type
      xhr.send();
    });
  }
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [6, 4],
      quality: 0.1,
      base64: true,
    });
    if (!result.canceled) {
      setImageB64(result.assets[0].base64);
      const { uri } = result.assets[0];
      const blobData = await urlToBlob(uri);
      setBlobImage(blobData);
      setImage(uri);
      setError(false)
    }
  };
  // useEffect(() => {}, []);
  return (
    <View style={[global.bgWhite, styles.container]}>
      <Modal animationType="none" transparent={active} visible={active}>
        <View style={[styles.modalMain]}>
          <ScrollView style={{ flex: 1 }}>
            <View style={[styles.modalContent]}>
              <View style={[styles.modalTop]}>
              <StepClear
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
                <View style={{ marginTop: -15, marginBottom: -20 }}>
                  <View>
                    <Text
                      style={{
                        fontFamily: "regular",
                        fontSize: 30,
                        marginTop: 30,
                      }}
                    >
                      Ya casi estamos listos
                    </Text>
                    <Text
                      style={{
                        fontFamily: "bold",
                        fontSize: 18,
                      }}
                    >
                      Sube una foto de tu negocio
                    </Text>
                  </View>
                </View>
              </View>
              <View style={[styles.modalMid]}>
                <Pressable
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                  }}
                  onPress={() => pickImage()}
                >
                  <View
                    style={{
                      width: 300,
                      height: 300,
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 2,
                      borderStyle: "dashed",
                      borderRadius: 5,
                    }}
                  >
                    {image ? (
                      <Image
                        style={{
                          width: 295,
                          height: 295,
                          borderRadius: 5,
                        }}
                        source={{ uri: image }}
                      />
                    ) : (
                      <Image
                        style={{
                          width: 120,
                          height: 120,
                          resizeMode: "contain",
                        }}
                        source={require("@/utils/images/cameraadd.png")}
                      />
                    )}
                  </View>
                </Pressable>
                {error && <Text style={{fontFamily: 'bold', fontSize: 16, color: 'red', textAlign: 'center', position: 'absolute', bottom: -30, left: 40}}>Tienes que subir una imagen</Text>}
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
                    navigation.push("StepThree", { business: business })
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
                    if (!image) {
                      setError(true)
                      return
                    };
                    navigation.push("StepFive", {
                      business: business,
                    });
                  }}
                >
                  <Text
                    style={[
                      { fontFamily: "bold", fontSize: 18, color: "#1f1f1f" },
                    ]}
                  >
                    4 / 5
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

export default StepFour;
