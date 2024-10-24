import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { API, Auth } from "aws-amplify";
import * as queries from "@/graphql/CustomQueries/Notification";
import * as mutation from "@/graphql/CustomMutations/Notification";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  eyelashSelection,
  isFocusPromotion,
  notificationNavigate,
  userAuthenticated,
} from "@/atoms";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "./CustomButton";
import styles from "@/utils/styles/Promotions.js";
import Fontisto from "@expo/vector-icons/Fontisto";

const NotificationsPage = () => {
  const global = require("@/utils/styles/global.js");
  const [notificationAll, setNotificationAll] = useState(null);
  const userAuth = useRecoilValue(userAuthenticated);
  const [notificationDelete, setNotificationDelete] = useState(false);
  const [notificationNothing, setNotificationNothing] = useState(false);
  const [reload, setReload] = useState(false);
  const setPageSelection = useSetRecoilState(eyelashSelection);
  const [isFocus, setIsFocus] = useRecoilState(isFocusPromotion);

  const navigation = useNavigation();

  const fetchNotifications = async () => {
    const user = await Auth.currentAuthenticatedUser();
    try {
      const response = await API.graphql({
        query: queries.listUserNotifications,
        authMode: "AMAZON_COGNITO_USER_POOLS",
        variables: {
          id: user.attributes["custom:userTableID"],
        },
      });

      setNotificationAll(response.data.listUserNotifications.items);
      if (response.data.listUserNotifications.items.length !== 0)
        setNotificationDelete(true);
      if (response.data.listUserNotifications.items.length === 0)
        setNotificationNothing(true);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAllNotifications = async () => {
    try {
      notificationAll.map(async (item) => {
        const response = await API.graphql({
          query: mutation.deleteUserNotification,
          authMode: "AMAZON_COGNITO_USER_POOLS",
          variables: {
            input: {
              id: item?.id,
            },
          },
        });
      });
      setReload(!reload);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [reload]);

  if (!userAuth)
    return (
      <View
        style={[
          {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 20,
            paddingBottom: 80,
          },
          global.bgWhite,
        ]}
      >
        <Text
          style={{ fontSize: 16, fontFamily: "light", textAlign: "center" }}
        >
          Ingresa a tu cuenta para ver todas las promociones
        </Text>
        <CustomButton
          text={`Iniciar sesion`}
          handlePress={() => {
            navigation.navigate("Login_Welcome");
          }}
          textStyles={[styles.textSearch, global.black]}
          buttonStyles={[styles.search, global.bgYellow]}
        />
      </View>
    );

  if (notificationAll !== null)
    return (
      <ScrollView
        style={[
          {
            flex: 1,
          },
          global.bgWhite,
        ]}
      >
        <View
          style={{
            padding: 20,
          }}
        >
          <Text
            style={{
              fontFamily: "thinItalic",
              fontSize: 24,
              marginTop: 20,
              marginBottom: 10,
            }}
          >
            Historial de notificaciones
          </Text>
          <View
            style={[
              {
                width: "200%",
                height: 1,
                left: "-10%",
                marginBottom: 20,
              },
              global.bgMidGray,
            ]}
          />
          {notificationAll.map((item, index) => {
            let data = JSON.parse(item?.data);
            return (
              <TouchableOpacity
                key={index}
                style={{
                  borderColor: "#ffb703",
                  borderWidth: 1,
                  height: 120,
                  padding: 5,
                  borderRadius: 4,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  setPageSelection(0);
                  setIsFocus(true);
                  if (item.type === "date") return;
                  navigation.navigate("Home_Tab", {
                    screen: "FavoritesHome",
                    params: {
                      reload: true,
                      promotion: true,
                      promotionID: data?.promotionID,
                    },
                  });
                }}
              >
                <View
                  style={{
                    borderColor: "#ffb703",
                    borderWidth: 1,
                    borderStyle: "dashed",
                    height: 105,
                    borderRadius: 4,
                    width: "100%",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    padding: 10,
                  }}
                >
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      width: "20%",
                    }}
                  >
                    {item.type === "date" ? (
                      <Fontisto name="date" size={32} color="black" />
                    ) : (
                      <Image
                        style={{
                          width: 50,
                          height: 85,
                          resizeMode: "contain",
                        }}
                        source={{ uri: data?.image }}
                      />
                    )}
                  </View>
                  <View
                    style={{
                      width: "75%",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "mediumItalic",
                        fontSize: 12,
                      }}
                    >
                      {item?.title}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "light",
                        fontSize: 12,
                        marginTop: 5,
                      }}
                    >
                      {item?.message}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
          {notificationNothing && (
            <View
              style={{
                flex: 1,
                height: 500,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "light",
                  fontSize: 18,
                }}
              >
                No tienes notificaciones
              </Text>
            </View>
          )}
          {notificationDelete && (
            <Pressable
              style={[
                global.mainBgColor,
                {
                  padding: 15,
                  borderRadius: 4,
                  borderColor: "#1f1f1f",
                  borderWidth: 1,
                  marginTop: 15,
                },
              ]}
              onPress={() => {
                deleteAllNotifications();
                setNotificationDelete(false);
              }}
            >
              <Text
                style={{
                  fontFamily: "bold",
                  fontSize: 14,
                  textAlign: "center",
                }}
              >
                Limpiar notificaciones
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    );
};

export default NotificationsPage;
