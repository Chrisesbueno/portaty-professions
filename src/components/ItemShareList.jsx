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

const ItemShareList = ({ data, styled }) => {
  const navigation = useNavigation();
  const global = require("@/utils/styles/global.js");
  const [save, setSave] = useState("");
  const fetchFavorite = async () => {
    try {
      const { attributes } = await Auth.currentAuthenticatedUser();
      const favorite = await API.graphql({
        query: queries.favoritesByBusinessID,
        authMode: "AMAZON_COGNITO_USER_POOLS",
        variables: {
          businessID: data.business.id,
          userID: { eq: attributes["custom:userTableID"] },
        },
      });
      if (favorite.data.favoritesByBusinessID.items.length !== 0)
        setSave(favorite.data.favoritesByBusinessID.items[0].id);
    } catch (error) {
      console.log(error);
    }
  };
  const onCreateFavorite = async () => {
    try {
      const { attributes } = await Auth.currentAuthenticatedUser();
      const favorites = await API.graphql({
        query: customFavorites.createFavorites,
        variables: {
          input: {
            businessID: data.business.id,
            userID: attributes["custom:userTableID"],
            position: 0,
          },
        },
        authMode: "AMAZON_COGNITO_USER_POOLS",
      });
      console.log(favorites.data.createFavorites);
      setSave(favorites.data.createFavorites.id);
    } catch (error) {
      console.log(error);
    }
  };

  const onDeleteFavorite = async () => {
    try {
      const { attributes } = await Auth.currentAuthenticatedUser();
      const favorites = await API.graphql({
        query: customFavorites.deleteFavorites,
        variables: {
          input: {
            id: save,
          },
        },
        authMode: "AMAZON_COGNITO_USER_POOLS",
      });
      console.log(favorites);
      setSave("");
    } catch (error) {
      console.log(error);
    }
  };
  useLayoutEffect(() => {
    fetchFavorite();
  }, []);
  if (data)
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 15,
        }}
      >
        <TouchableOpacity
          style={{ flexDirection: "row", width: 150 }}
          onPress={() =>
            navigation.navigate("SharePage", {
              item: data.business.id,
              image: `https://picsum.photos/id/1/200/300`,
            })
          }
        >
          <View
            style={{
              justifyContent: "space-between",
            }}
          >
            <Image
              style={{
                width: 50,
                height: 50,
                resizeMode: "cover",
                borderRadius: 50,
              }}
              source={{ uri: `https://picsum.photos/id/1/200/300` }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginLeft: 10,
            }}
          >
            <View>
              <Text
                style={[
                  { fontSize: 15, fontFamily: "light" },
                  global.mainColor,
                ]}
              >
                {data.business.name}
              </Text>
              <Text
                style={[{ fontSize: 15, fontFamily: "light" }, global.black]}
              >
                {data.business.activity}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            save === "" ? global.mainBgColor : global.bgWhiteSmoke,
            {
              padding: 10,
              borderRadius: 8,
              justifyContent: "center",
              alignItems: "center",
              width: 120,
            },
          ]}
          onPress={() => {
            if (save === "") {
              onCreateFavorite();
            } else {
              onDeleteFavorite();
            }
          }}
        >
          <Text
            style={[
              save === "" ? global.white : global.black,
              { fontFamily: "light", fontSize: 12, textAlign: "center" },
            ]}
          >
            {save === "" ? "Agregar a favoritos" : "Eliminar de favoritos"}
          </Text>
        </TouchableOpacity>
      </View>
    );
};

export default ItemShareList;
