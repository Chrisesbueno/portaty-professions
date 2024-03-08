import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
const ItemProfile = ({ data, identityID, styled }) => {
  const navigation = useNavigation();
  if (identityID)
    return (
      <TouchableOpacity
        style={styled.column}
        onPress={() =>
          navigation.navigate("PageNavigator", {
            screen: "Page",
            params: {
              data: {
                item: data,
                image: JSON.parse(data.images[0]).url,
              },
            },
            // {
            // data: {
            //   item: data,
            //   image: JSON.parse(data.images[0]).url,
            // },
          })
        }
      >
        <View
          style={{
            justifyContent: "space-between",
            marginLeft: 10,
          }}
        >
          <Image
            style={{
              width: 130,
              height: 130,
              resizeMode: "cover",
              borderRadius: 2,
              borderColor: "#1f1f1f",
              borderWidth: 0.7,
            }}
            source={{ uri: data?.thumbnail }}
          />
        </View>
        <View>
          <View
            style={{
              flex: 1,
              // flexDirection: "row",
              justifyContent: "space-between",
              marginLeft: 20,
            }}
          >
            <View>
              <Text style={{ fontSize: 13, fontFamily: "medium" }}>Nombre</Text>
              <Text style={{ fontSize: 12, fontFamily: "regular" }}>
                {data.name}
              </Text>
            </View>
            <View style={{}}>
              <Text style={{ fontSize: 13, fontFamily: "medium" }}>
                Actividad laboral
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "light",
                  textTransform: "capitalize",
                }}
              >
                {data.activity}
              </Text>
            </View>
          </View>
          <View style={{ height: 30 }}></View>
        </View>
      </TouchableOpacity>
    );
};

export default ItemProfile;
