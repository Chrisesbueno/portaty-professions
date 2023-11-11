import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Auth, API, Storage } from "aws-amplify";
import * as queries from "@/graphql/CustomQueries/Favorites";
import * as customFavorites from "@/graphql/CustomMutations/Favorites";
import { Ionicons } from "@expo/vector-icons";
const ItemProfile = ({ data, identityID, styled }) => {
  const [selectKey, setSelectKey] = useState("");
  const navigation = useNavigation();
  console.log(identityID);
  const getImage = async () => {
    try {
      await Storage.get(data.image, {
        level: "protected",
        identityId: identityID,
      }).then((res) => setSelectKey(res));
    } catch (error) {
      console.log("toy", error);
    }
  };
  useLayoutEffect(() => {
    console.log(selectKey);
    getImage();
  }, []);
  if (identityID)
    return (
      <TouchableOpacity
        style={styled.column}
        onPress={() =>
          navigation.navigate("Page", {
            data: {
              item: data,
              image: selectKey,
            },
          })
        }
      >
        <View
          style={{
            justifyContent: "space-between",
            marginLeft: 10,
            // alignItems: 'center',
            // justifyContent: 'center'
          }}
        >
          {selectKey !== "" ? (
            <Image
              style={{
                width: 100,
                height: 100,
                resizeMode: "cover",
                borderRadius: 2,
              }}
              source={{ uri: selectKey }}
            />
          ) : (
            <View style={{ paddingTop: 40 }}>
              <ActivityIndicator />
            </View>
          )}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 5,
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Ionicons name="trash-outline" size={12} color="black" />
              <Text
                style={{ fontSize: 12, fontFamily: "light", marginLeft: 1 }}
              >
                Eliminar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Ionicons name="eye-outline" size={12} color="black" />
              <Text
                style={{ fontSize: 12, fontFamily: "light", marginLeft: 1 }}
              >
                Ver
              </Text>
            </TouchableOpacity>
          </View>
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
              <Text style={{ fontSize: 13, fontFamily: "light" }}>
                Razon Social
              </Text>
              <Text style={{ fontSize: 12, fontFamily: "thin" }}>
                {data.name}
              </Text>
            </View>
            <View style={{}}>
              <Text style={{ fontSize: 13, fontFamily: "light" }}>
                Actividad Laboral
              </Text>
              <Text style={{ fontSize: 12, fontFamily: "thin" }}>
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
