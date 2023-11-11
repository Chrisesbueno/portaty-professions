import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Share,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Auth, API, Storage } from "aws-amplify";
import * as mutations from "@/graphql/CustomMutations/Profile";
import * as customSearch from "@/graphql/CustomQueries/Search";
import CustomSelect from "@/components/CustomSelect";
import styles from "@/utils/styles/Profile.module.css";
import CustomButton from "@/components/CustomButton";

import {
  FontAwesome5,
  MaterialCommunityIcons,
  AntDesign,
  FontAwesome,
  Foundation,
  EvilIcons,
  Feather,
} from "@expo/vector-icons";
// amplify
const Profile = ({ route, navigation }) => {
  const global = require("@/utils/styles/global.js");
  const { user } = route.params;
  const [name, setName] = useState(user?.name);
  const [lastName, setLastName] = useState(user["custom:lastName"]);
  const [email, setEmail] = useState(user?.email);
  const [editActive, setEditActive] = useState(false);
  const [isSave, setIsSave] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  console.log("PROFILE: ", user);
  const onShare = async () => {
    try {
      await Share.share({
        message: `Han compartido contigo un negocio, da click para mirarlo https://www.portaty.com/share/list?id=${user.id}`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  useEffect(() => {
    onCheckChange();
  }, [name, lastName]);

  const onCheckChange = () => {
    // si hubo un cambio de informacion habilitar boton
    console.log(name?.toLowerCase()?.trim());
    console.log(lastName?.toLowerCase().trim());
    console.log(user?.name?.toLowerCase().trim());
    console.log(user?.lastName?.toLowerCase().trim());
    if (
      name?.toLowerCase()?.trim() !== user?.name?.toLowerCase().trim() ||
      lastName?.toLowerCase().trim() !==
        user["custom:lastName"]?.toLowerCase().trim()
    ) {
      console.log("hubo cambio");
      setIsSave(true);
    } else {
      console.log("no hubo cambio");
      setIsSave(false);
    }
  };

  const onSaveChange = async () => {
    setIsLoading(true);
    const data = await Auth.currentAuthenticatedUser();
    const tableID = data?.attributes["custom:userTableID"];
    console.log("ID DE TABLAA  CAMBAIR: ", tableID);

    try {
      // Cambiar en Cognito
      await Auth.updateUserAttributes(data, {
        name: name,
        "custom:lastName": lastName,
      });
      navigation.goBack();
      // Cambiar en tabla
      const result = await API.graphql({
        query: mutations.updateUsers,
        authMode: "AMAZON_COGNITO_USER_POOLS",
        variables: {
          input: {
            id: tableID,
            name,
            lastName,
          },
        },
      });
      console.log("ACTUALIZAR: ", result);
    } catch (error) {
      const { message } = new Error(error);
      console.log("ERROR AL ACTUALIZAR ATRIBUTO IDENTITY ID: ", message);
    }
    setIsLoading(false);
  };

  return (
    <View
      style={[
        {
          flex: 1,
        },
        global.bgWhite,
      ]}
    >
      <ScrollView style={{ flex: 1, marginTop: 40 }}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 26, fontFamily: "thin" }}>0</Text>
          <Text style={{ fontSize: 22, fontFamily: "thin" }}>
            Mis Favoritos
          </Text>
        </View>
        <View style={[styles.line, global.bgWhiteSmoke]} />
        <TouchableOpacity
          style={{
            padding: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onPress={onShare}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={[
                {
                  width: 58,
                  height: 58,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                },
                global.mainBgColor,
              ]}
            >
              <EvilIcons name="share-google" size={25} color="white" />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontFamily: "light", fontSize: 16 }}>
                Compartir tus favoritos
              </Text>
              <Text style={{ fontFamily: "thin", fontSize: 12, width: 150 }}>
                Comparte con tus amigos y familiares la lista de tus favoritos
              </Text>
            </View>
          </View>
          <Image
            style={{
              width: 40,
              height: 40,
              resizeMode: "cover",
            }}
            source={require("@/utils/images/arrow_right.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: -25,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={[
                {
                  width: 58,
                  height: 58,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                },
                global.mainBgColor,
              ]}
            >
              <FontAwesome name="edit" size={20} color="white" />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontFamily: "light", fontSize: 16 }}>Editar</Text>
              <Text style={{ fontFamily: "thin", fontSize: 12, width: 150 }}>
                Actualiza tus datos
              </Text>
            </View>
          </View>
          <Switch
            trackColor={{
              false: "#767577",
              true: "#FF8811",
            }}
            thumbColor={editActive ? "#FFFFFF" : "#f4f3f4"}
            onValueChange={() => setEditActive(!editActive)}
            value={editActive}
          />
        </TouchableOpacity>
        <View style={{ marginBottom: 80 }}>
          <Text style={{ fontSize: 22, fontFamily: "thinItalic", padding: 10 }}>
            Datos personales
          </Text>
          <View style={[styles.line, global.bgWhiteSmoke]} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 20,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* <Foundation name="torso-business" size={22} color="#1f1f1f" /> */}
              <Text
                style={[
                  { fontFamily: "lightItalic", fontSize: 15 },
                  global.midGray,
                ]}
              >
                Nombre
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                onChangeText={setName}
                value={name}
                style={[
                  {
                    fontSize: 13,
                    fontFamily: "lightItalic",
                    padding: 10,
                    borderColor: "#1f1f1f",
                    borderWidth: 0.3,
                    borderRadius: 4,
                  },
                  editActive ? global.bgWhite : global.bgWhiteSoft,
                ]}
                editable={editActive ? true : false}
              />
            </View>
          </View>
          <View style={[styles.line, global.bgWhiteSmoke]} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 20,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* <FontAwesome5 name="store" size={16} color="#1f1f1f" /> */}
              <Text
                style={[
                  { fontFamily: "lightItalic", fontSize: 15 },
                  global.midGray,
                ]}
              >
                Apellido
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                onChangeText={setLastName}
                value={lastName}
                style={[
                  {
                    fontSize: 13,
                    fontFamily: "lightItalic",
                    padding: 10,
                    borderColor: "#1f1f1f",
                    borderWidth: 0.3,
                    borderRadius: 4,
                  },
                  editActive ? global.bgWhite : global.bgWhiteSoft,
                ]}
                editable={editActive ? true : false}
              />
            </View>
          </View>
          <View style={[styles.line, global.bgWhiteSmoke]} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 20,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* <MaterialCommunityIcons
                  name="email-open-multiple-outline"
                  size={20}
                  color="#1f1f1f"
                /> */}
              <Text
                style={[
                  { fontFamily: "lightItalic", fontSize: 15 },
                  global.midGray,
                ]}
              >
                Correo
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                value={email}
                style={[
                  {
                    fontSize: 13,
                    fontFamily: "lightItalic",
                    padding: 10,
                    borderColor: "#1f1f1f",
                    borderWidth: 0.3,
                    borderRadius: 4,
                  },
                  global.bgWhiteSoft,
                ]}
                editable={false}
              />
            </View>
          </View>
          <View style={{ height: 60 }}>
            {editActive && (
              <CustomButton
                text={isLoading ? <ActivityIndicator /> : "Guardar"}
                handlePress={onSaveChange}
                textStyles={[global.white]}
                buttonStyles={[
                  {
                    paddingVertical: 10,
                    margin: 10,
                    marginHorizontal: 80,
                    borderRadius: 6,
                    flexDirection: "row",
                    justifyContent: "center",
                  },
                  isSave ? global.mainBgColor : global.bgWhiteSoft,
                  ,
                ]}
                disabled={!isSave && isLoading}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
