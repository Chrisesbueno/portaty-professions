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
const ItemList = ({ data, number, styled }) => {
  const navigation = useNavigation();
  const [save, setSave] = useState("");
  const [loading, setLoading] = useState(false);

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
    setSave("");
  };

  const fetchFavorite = () => {
    setSave(data.id);
  };
  useLayoutEffect(() => {
    fetchFavorite();
  }, []);
  if (save)
    return (
      <TouchableOpacity
        style={styled.column}
        onPress={() =>
          navigation.navigate("FavoritePage", {
            data: {
              item: data,
              image: JSON.parse(data.business.images[0]).url,
            },
          })
        }
      >
        <View
          style={{
            // justifyContent: "space-between",
            marginLeft: 10,
          }}
        >
            <Image
              style={{
                width: 130,
                height: 130,
                resizeMode: "cover",
                borderRadius: 4,
                borderColor: '#1f1f1f',
                borderWidth: 0.7
              }}
              source={{ uri: data?.business?.thumbnail }}
            />
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-between",
              paddingHorizontal: 10,
              paddingTop: 5,
              paddingBottom: 15,
            }}
          >
            <View>
              <Text style={{ fontSize: 13, fontFamily: "medium", color: '#1f1f1f' }}>
                Nombre
              </Text>
              <Text style={{ fontSize: 12, fontFamily: "light", color: '#1f1f1f'  }}>
                {data.business.name}
              </Text>
            </View>
            <View style={{}}>
              <Text style={{ fontSize: 13, fontFamily: "medium", color: '#1f1f1f'  }}>
                Actividad laboral
              </Text>
              <Text style={{ fontSize: 12, fontFamily: "light", color: '#1f1f1f', textTransform:"capitalize"  }}>
                {data.business.activity}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: 'center',
              position: "relative",
              top: 18,
              right: 7
            }}
          >
            <Ionicons name="eye-outline" size={16} color="#1f1f1f" />
            <Text style={{ fontSize: 13, fontFamily: "medium", marginLeft: 2, marginBottom: 1 }}>
              Ver
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
};

export default ItemList;
