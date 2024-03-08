import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  TouchableOpacity
} from "react-native";
import styles from "@/utils/styles/StepTwo.module.css";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import CustomInput from "@/components/CustomInput";
import { es } from "@/utils/constants/lenguage";
import * as Cellular from "expo-cellular";
import LottieView from "lottie-react-native";
import { Feather, MaterialIcons, Entypo } from "@expo/vector-icons";
import { activeModalScreen, areaSelect, optionBussines, userAuthenticated } from "@/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { API } from "aws-amplify";
import * as customProfile from "@/graphql/CustomQueries/Profile";
import CustomActivities from "@/components/CustomActivities";
import CustomArea from "@/components/CustomArea";
import StepClear from "./StepClear";

const StepTwo = ({ navigation, route }) => {
  const global = require("@/utils/styles/global.js");
  const { control, handleSubmit } = useForm();
  const animation = useRef(null);
  const [areasList, setAreasList] = useState([]);
  const { business } = route.params;
  const [active, setActive] = useRecoilState(activeModalScreen);
  const [selectOption, setSelectOption] = useRecoilState(optionBussines);
  const area = useRecoilValue(areaSelect);
  console.log(selectOption);

  const listOptions = [
    {
      name: "Servicio/s",
      icon: (
        <MaterialIcons name="home-repair-service" size={32} color="black" />
      ),
      id: 0
    },
    {
      name: "Producto/s",
      icon: <Entypo name="shopping-basket" size={30} color="black" />,
      id: 1
    },
    {
      name: "Ambos",
      icon: (
        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4}}>
          <Entypo name="shopping-basket" size={23} color="black" />
          <Text style={{fontFamily: 'bold'}}>{" "}/{" "}</Text>
          <MaterialIcons name="home-repair-service" size={25} color="black" />
        </View>
      ),
      id: 2
    },
  ];

  const MultipleData = async () => {
    const activities = await API.graphql({
      query: customProfile.listAreas,
    });
    setAreasList(activities.data.listAreas.items);
    console.log(activities.data.listAreas.items);
  };

  const handleOption = (item) => {
    setSelectOption(item)
  } 
  useEffect(() => {
    MultipleData();
  }, []);
  return (
    <View style={[global.bgWhite, styles.container]}>
      <Modal animationType="none" transparent={active} visible={active}>
        <View style={[styles.modalMain]}>
          <ScrollView style={{ flex: 1 }}>
            <View style={[styles.modalContent]}>
              <View style={[styles.modalTop]}>
                <StepClear navig={() => navigation.navigate("Unprofile")} />
                <View style={{ marginBottom: 20, marginTop: -15 }}>
                  <View>
                    <Text
                      style={{
                        fontFamily: "medium",
                        fontSize: 32,
                        marginTop: 30,
                      }}
                    >
                      Ahora, {business.name}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "bold",
                        fontSize: 20,
                        marginBottom: 5,
                      }}
                    >
                      Cuéntanos ¿a qué se dedica tu negocio?
                    </Text>
                    <LottieView
                      autoPlay
                      ref={animation}
                      style={{
                        width: 120,
                        height: 120,
                        backgroundColor: "#fff",
                        justifyContent: "center",
                        alignSelf: "center",
                      }}
                      source={require("@/utils/animations/work.json")}
                    />
                  </View>
                </View>
              </View>
              <View style={[styles.modalMid]}>
                <View style={{
                  marginBottom: 30,
                  marginTop: -15
                }}>
                  <Text
                    style={{
                      fontFamily: "medium",
                      fontSize: 20,
                      marginBottom: 5,
                    }}
                  >
                    ¿Qué ofrece tu negocio?
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    {listOptions.map((item, index) => (
                      <TouchableOpacity
                        style={{
                          borderWidth: 1,
                          borderColor: "#1f1f1f",
                          width: 100,
                          height: 100,
                          borderRadius: 8,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: selectOption.id === index ? '#ffb703' : '#ffffff'
                        }}
                        key={index}
                        onPress={() => handleOption(item)}
                      >
                        <Text style={{
                          fontFamily: 'bold',
                          marginBottom: 10
                        }}>{item.name}</Text>
                        {item.icon}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <View>
                  <View
                    style={{
                      flexDirection: "row",
                      columnGap: 10,
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "bold",
                        fontSize: 16,
                      }}
                    >
                      Tu sector:
                    </Text>
                    <Text
                      style={{
                        fontFamily: "medium",
                        fontSize: 14,
                      }}
                    >
                      {area?.area ? area?.area : "No has seleccionado aun"}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      columnGap: 10,
                      justifyContent: "space-between",
                      marginVertical: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "bold",
                        fontSize: 16,
                      }}
                    >
                      Tu actividad :
                    </Text>
                    <Text
                      style={{
                        fontFamily: "medium",
                        fontSize: 14,
                      }}
                    >
                      {area?.activity
                        ? area?.activity
                        : "No has seleccionado aun"}
                    </Text>
                  </View>
                </View>
                {areasList.length !== 0 ? <CustomArea data={areasList} /> : ""}
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
                    navigation.push("StepOne", { business: business })
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
                  onPress={() =>
                    navigation.push("StepThree", {
                      business: business,
                    })
                  }
                >
                  <Text
                    style={[
                      { fontFamily: "bold", fontSize: 18, color: "#1f1f1f" },
                    ]}
                  >
                    2 / 5
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

export default StepTwo;
