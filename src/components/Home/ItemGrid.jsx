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
  const [selectKey, setSelectKey] = useState("");
  const [loading, setLoading] = useState(false);
  const selectionFavorite = selection.some((item) => item === data.id);
  console.log(data.business.identityID, data.business.image);
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
    console.log(favorites);
  };
  const getImage = async () => {
    setLoading(true);
    try {
      await Storage.get(data.business.image, {
        level: "protected",
        identityId: data.business.identityID,
      }).then((res) => setSelectKey(res));
      setLoading(false);
    } catch (error) {
      console.log("toy en grid", error);
    }
  };
  useLayoutEffect(() => {
    getImage();
  }, []);
  // if (save)
  if (selectKey)
    return (
      <TouchableOpacity
        style={styled.column}
        onPress={() => {
          if (selectionFavorite) {
            // setSelect(false)
            // console.log(selection)
            let selections = selection.filter((item) => item !== data.id);
            setSelection(selections);
          } else {
            navigation.navigate("FavoritePage", {
              data: {
                item: data,
                image: selectKey,
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
        {!selectKey ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator size={`small`} color="fb8500" />
          </View>
        ) : (
          <Image
            style={{
              width: "100%",
              height: "100%",
              resizeMode: "cover",
              borderRadius: 2,
            }}
            source={{ uri: selectKey }}
          />
        )}
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
