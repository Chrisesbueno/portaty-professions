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
import { useRecoilState } from "recoil";
import { favoriteSelection } from "@/atoms";
import { AntDesign, EvilIcons } from "@expo/vector-icons";

const ItemGrid = ({ data, number, styled }) => {
  const global = require("@/utils/styles/global.js");
  const [select, setSelect] = useState(false);
  const [selection, setSelection] = useRecoilState(favoriteSelection);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const selectionFavorite = selection.some((item) => item === data.id);
  
  const onDeleteFavorite = async () => {
    const favorites = await API.graphql({
      query: customFavorites.deleteFavorites,
      variables: {
        input: {
          id: data.id,
        },
      },
      authMode: "AMAZON_COGNITO_USER_POOLS",
    });
  };

    return (
      <TouchableOpacity
        style={styled.column}
        onPress={() => {
          if (selectionFavorite) {
            let selections = selection.filter((item) => item !== data.id);
            setSelection(selections);
          } else {
            navigation.navigate("FavoritePage", {
              data: {
                item: data,
                image: JSON.parse(data.business.images[0]).url,
              },
            });
          }
        }}
        onLongPress={() => {
          // setSelect(true);
          setSelection([...selection, data.id]);
        }}
        delayLongPress={1000}
        activeOpacity={1}
      >
          <Image
            style={{
              width: "100%",
              height: "100%",
              resizeMode: "cover",
              borderRadius: 2,
            }}
            source={{ uri: data.business.thumbnail }}
          />
        {selectionFavorite ? (
          <View
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundColor: "#fff",
              opacity: 0.7,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AntDesign name="checkcircleo" size={18} color="green" />
            <Text style={{ fontSize: 12, fontFamily: "thin", marginTop: 5 }}>
              Seleccionado
            </Text>
          </View>
        ) : (
          ""
        )}
        {data.position > 0 && (
          <View
            style={[
              {
                position: "absolute",
                width: 25,
                height: 25,
                borderRadius: 5,
                opacity: 0.5,
                alignItems: "center",
                justifyContent: "center",
                left: 4,
                top: 3,
              },
              global.bgMidGray,
            ]}
          >
            <EvilIcons name="lock" size={26} color="#1f1f1f" />
          </View>
        )}
        {/* <TouchableOpacity style={styled.options} onPress={openOptions}>
        <Ionicons name="ellipsis-vertical-outline" size={24} color="black" />
          {active && (
            <View style={styled.modal}>
              <Text style={styled.text}>Anclar</Text>
              <TouchableOpacity onPress={onDeleteFavorite}>
                <Text style={styled.text}>Eliminar</Text>
                </TouchableOpacity> 
            </View>
          )}
        </TouchableOpacity> */}
      </TouchableOpacity>
    );
};

export default ItemGrid;
